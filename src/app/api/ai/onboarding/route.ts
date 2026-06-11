import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { careerStage, skillLevel, focusAreas, goals, challenges } = await request.json();

    const prompt = `You are an elite growth coach. Create a personalized growth roadmap for this user.

User Profile:
- Career stage: ${careerStage}
- Current skill level: ${skillLevel}
- Focus areas: ${focusAreas.join(", ")}
- Goals: ${goals.join(", ")}
- Current challenges: ${challenges.join(", ")}

Provide TWO things in JSON format:

1. "roadmap": A concise 3-paragraph personalized growth roadmap (max 200 words total).
   - Para 1: Assessment of where they are now and their biggest opportunity
   - Para 2: Their 90-day focused growth strategy
   - Para 3: The one transformational insight they need to embrace

2. "weeklyFocus": A specific, actionable weekly focus (2-3 sentences) — what to practice this week based on their profile.

Return valid JSON only: {"roadmap": "...", "weeklyFocus": "..."}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Onboarding API error:", error);
    // Return fallback content so onboarding doesn't break
    return NextResponse.json({
      roadmap: `Based on your profile as a ${request.body ? "driven professional" : "growth seeker"}, you are positioned at a pivotal point in your development journey. Your combination of goals and self-awareness puts you ahead of most peers who never take intentional action toward growth.\n\nYour 90-day strategy focuses on building keystone habits in your top focus areas while using AI coaching to accelerate skill acquisition. Prioritize depth over breadth — master one communication framework, one leadership practice, and one productivity system before expanding.\n\nThe transformational insight: consistent action compounds faster than sporadic intensity. The leaders who achieve elite performance aren't more talented — they're more consistent. Your daily 30-minute growth practice will create results that surprise you within 90 days.`,
      weeklyFocus: "This week, focus on one foundational skill from your top priority area. Complete one assessment to establish your baseline, then have a daily 10-minute AI coaching session to build momentum. Track how you feel at the start and end of each day.",
    });
  }
}
