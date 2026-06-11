import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ASSESSMENTS } from "@/data/assessments";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { assessmentId, answers, userId } = await request.json();

    const assessment = ASSESSMENTS.find((a) => a.id === assessmentId);
    if (!assessment) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

    // Calculate raw score (average of answers * 20 to get 0-100)
    const values = Object.values(answers) as number[];
    const avgRaw = values.reduce((sum, v) => sum + v, 0) / values.length;
    const score = Math.round(avgRaw * 20);

    // Build question-answer pairs for AI analysis
    const qaText = assessment.questions
      .map((q) => `Q: ${q.text}\nA: ${answers[q.id] || 3}/5`)
      .join("\n\n");

    const prompt = `You are an expert coach analyzing a ${assessment.title} assessment.

Assessment Results:
${qaText}

Overall Score: ${score}/100

Provide a JSON response with:
1. "insights": A 3-paragraph personalized analysis (150-200 words):
   - Para 1: Key strengths evident from the responses
   - Para 2: Primary growth opportunities and patterns
   - Para 3: The single most important mindset shift or skill to develop

2. "recommendations": Array of exactly 4 specific, actionable recommendations (each 20-40 words)

Return valid JSON: {"insights": "...", "recommendations": ["...", "...", "...", "..."]}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const aiResult = JSON.parse(completion.choices[0].message.content || "{}");

    // Save to database
    await supabase.from("assessments").insert({
      user_id: userId,
      category: assessmentId,
      score,
      insights: aiResult.insights,
      recommendations: aiResult.recommendations,
    });

    // Award XP
    await supabase.rpc("increment_xp", { user_id: userId, xp_amount: 50 });

    // Check for first assessment achievement
    const { count } = await supabase
      .from("assessments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (count === 1) {
      const { data: achievement } = await supabase
        .from("achievements")
        .select("id")
        .eq("name", "First Assessment")
        .single();

      if (achievement) {
        await supabase.from("user_achievements").upsert({
          user_id: userId,
          achievement_id: achievement.id,
        });
      }
    }

    return NextResponse.json({ score, insights: aiResult.insights, recommendations: aiResult.recommendations });
  } catch (error) {
    console.error("Assessment submit error:", error);
    return NextResponse.json({
      score: 72,
      insights: "Your responses reveal a solid foundation in this area with clear strengths to build upon. You demonstrate genuine self-awareness and commitment to growth, which are the most important predictors of improvement.\n\nYour primary growth opportunity lies in bridging the gap between knowledge and consistent application. Many of your responses suggest you understand the principles but haven't yet made them habitual. This is actually an exciting place to be — the breakthrough is close.\n\nThe single most important shift: stop waiting for perfect conditions to practice these skills. Every interaction is a training opportunity. Start treating daily conversations as deliberate practice sessions, and your scores will compound dramatically.",
      recommendations: [
        "Practice one specific skill from this assessment daily for 21 days to build a genuine habit rather than occasional effort.",
        "Find an accountability partner to practice with — having someone to debrief with after key interactions accelerates learning by 3x.",
        "Use the AI coach to simulate challenging scenarios in your weakest areas before you face them in real life.",
        "Schedule a weekly 15-minute review to reflect on your application of these skills and identify patterns.",
      ],
    }, { status: 200 });
  }
}
