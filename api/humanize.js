import Groq from "groq-sdk";

const TEMPLATES = {
  simple: `Rewrite the text in clear, simple, everyday human language.
- Natural tone
- Easy to read
- Remove robotic phrasing
- Keep meaning accurate`,

  exam: `Rewrite the text in a clean, formal, school-exam tone.
- Structured
- Factual
- No slang
- Teacher-acceptable answers`,

  genz: `Rewrite the text in an unhinged Gen-Z and Gen-Alpha tone with MAX dark humour and playful roasts.
Rules:
- Sarcastic, chaotic inner-monologue energy 😭💀
- Drop light, self-aware roasts about the topic, the situation, life, and the struggle
- Use emojis sparingly but with purpose (😭🔥💀🤌🫠)
- Dark humour allowed, but:
  * NO violence
  * NO offensive groups
  * NO illegal themes
- Make the tone feel like a tired but genius teen explaining the topic at 3AM while questioning life
- Maintain correct facts — chaos is in delivery, not content
- No emoji spam
- Roast the topic , like: "Plants out here running solar panels while I can't run my life." 
- Roast yourself , like: "My brain is buffering but okay let's continue."
- Overall vibe = Smart, chaotic, funny, depressed-but-functional Gen-Z narrator`,

  teacher: `Rewrite the text in a very clean, academic, teacher-safe tone.
- Formal
- Polite
- Neat grammar
- No humor
- No slang
Perfect for school submissions.`
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { preset, userText } = req.body;

    if (!userText) {
      return res.status(400).json({ error: "No text provided" });
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = TEMPLATES[preset] || TEMPLATES.simple;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText }
      ],
      temperature: 0.4,
      max_tokens: 1500
    });

    const output = completion?.choices?.[0]?.message?.content || "";

    return res.status(200).json({ output });
  } catch (err) {
    console.error("HUMANIZE API ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
