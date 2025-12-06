import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { preset, text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No input text provided" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `Rewrite the following text in the style: ${preset}.
    Text: ${text}`;

    const completion = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",  
      messages: [
        { role: "system", content: "You rewrite student notes cleanly." },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 500,
    });

    const output = completion.choices[0].message.content.trim();

    return res.status(200).json({ output });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server crashed" });
  }
}
