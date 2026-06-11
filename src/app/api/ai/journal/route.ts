import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content, mood, confidence } = await request.json();

    const prompt = `You are an empathetic growth coach reading a user's journal entry.

Journal Entry:
"${content}"

Mood: ${mood}/10
Confidence: ${confidence}/10

Write a brief, warm, insightful reflection (3-4 sentences) that:
1. Acknowledges what they shared with genuine empathy
2. Highlights a specific growth insight or pattern you notice
3. Offers one powerful question or reframe to deepen their reflection
4. Ends with an encouraging note specific to what they wrote

Keep it conversational and human — like a trusted mentor, not a therapist. Max 100 words.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 200,
    });

    const reflection = completion.choices[0].message.content || "";

    // Save journal entry
    const { data: entry } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        content,
        mood,
        confidence,
        ai_reflection: reflection,
      })
      .select()
      .single();

    // Award XP
    await supabase.rpc("increment_xp", { user_id: user.id, xp_amount: 15 });

    return NextResponse.json({ reflection, entryId: entry?.id });
  } catch (error) {
    console.error("Journal API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
