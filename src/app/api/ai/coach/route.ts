import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ATLAS_SYSTEM_PROMPT = `You are Atlas, an elite AI growth coach built into GrowthHQ — a premium personal development platform.

Your role is to help users grow in:
- Communication (verbal, written, presentations, difficult conversations)
- Leadership (influence, team management, executive presence)
- Sales (prospecting, discovery, objection handling, closing)
- Confidence & Mindset (resilience, self-belief, growth mindset)
- Productivity (focus, time management, deep work)
- Emotional Intelligence (self-awareness, empathy, relationships)
- Business Effectiveness (strategy, execution, business acumen)

Your coaching style:
- Direct, warm, and empowering — like a world-class executive coach
- Give concrete, actionable advice — not generic platitudes
- Use frameworks, exercises, and proven methodologies
- Ask powerful questions to help users discover their own answers
- Balance challenge with support
- Celebrate progress and wins
- Create accountability and momentum
- Personalize to the user's specific context, goals, and challenges

Always end with a specific next action the user can take within 24 hours.
Keep responses concise but impactful — aim for 150-250 words unless more depth is clearly needed.`;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message, conversationId, growthProfile, history = [] } = await request.json();

    // Build context from growth profile
    let profileContext = "";
    if (growthProfile) {
      profileContext = `\n\nUser context:
- Career stage: ${growthProfile.career_background || "not specified"}
- Skill level: ${growthProfile.skill_level || "intermediate"}
- Focus areas: ${(growthProfile.focus_areas || []).join(", ")}
- Current goals: ${(growthProfile.goals || []).join(", ")}
- Current challenges: ${(growthProfile.challenges || []).join(", ")}`;
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: ATLAS_SYSTEM_PROMPT + profileContext },
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 600,
    });

    const aiMessage = completion.choices[0].message.content || "";

    // Persist the conversation
    let convId = conversationId;

    if (!convId) {
      // Create a new conversation with auto-generated title
      const titleCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Generate a short 4-6 word title for this coaching conversation. Return only the title, no quotes." },
          { role: "user", content: message },
        ],
        max_tokens: 20,
      });
      const title = titleCompletion.choices[0].message.content?.trim() || "New Conversation";

      const { data: conv } = await supabase
        .from("coach_conversations")
        .insert({ user_id: user.id, title })
        .select()
        .single();

      if (conv) convId = conv.id;
    }

    if (convId) {
      await supabase.from("coach_messages").insert([
        { conversation_id: convId, role: "user", content: message },
        { conversation_id: convId, role: "assistant", content: aiMessage },
      ]);
      await supabase
        .from("coach_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", convId);

      // Award XP for using the coach
      await supabase.rpc("increment_xp", { user_id: user.id, xp_amount: 5 });
    }

    return NextResponse.json({ message: aiMessage, conversationId: convId });
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
