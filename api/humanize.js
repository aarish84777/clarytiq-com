import Groq from "groq-sdk";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { preset, text } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Missing GROQ API key" });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text provided" });
    }

    // PROMPTS
    const presetPrompts = {
      simple: "Rewrite the text in clean, natural human language.",
      exam: "Rewrite the text in CBSE exam-style answers, simple and formal.",
      genz: "Rewrite the text in fun, Gen-Z friendly tone (not cringe).",
      teacher: "Rewrite the text in formal, neat teacher-safe language."
    };

    const instruction = presetPrompts[preset] || presetPrompts.simple;

    // Initialize GROQ Client
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: text }
      ],
      temperature: 0.4
    });

    const output = completion.choices[0].message.content.trim();

    return res.status(200).json({ output });

  } catch (err) {
    console.error("GROQ Server Error:", err);
    return res.status(500).json({ error: "Server crashed" });
  }
}
