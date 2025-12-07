import Groq from "groq-sdk";

const TEMPLATES = {
  simple: `Rewrite the text in clean, simple, everyday human language. 
- Remove robotic tone
- Shorten long sentences
- Keep meaning accurate
- Make it natural and easy to read.`,

  exam: `Rewrite the text in a formal, school-exam tone. 
- Clear
- Structured
- No slang
- Direct and factual
Your job is to make it look like an answer a teacher would accept.`,

  genz: `Rewrite the text in a light, Gen-Z friendly tone.
Rules:
- Fun but NOT cringe
- Slight humor allowed
- Keep clarity
- No TikTok-core language
- No excessive emojis
Sound like a smart teen explaining something chill.`,

  teacher: `Rewrite the text in a very clean, academic, teacher-safe tone.
- Formal
- Polite
- Textbook-like
- Zero slang
- Very clear sentence structure
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
