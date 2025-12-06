// api/humanize.js

import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { preset, userText } = req.body;

    if (!userText || userText.trim() === "") {
      return res.status(400).json({ error: "Empty input" });
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Use a safe, currently supported model
    const model = "llama-3.3-70b-versatile";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            `You are a notes humanizer AI. Take raw, robotic text and convert it into clear, simple, exam-ready human language based on preset: ${preset}.`,
        },
        {
          role: "user",
          content: userText,
        },
      ],
      temperature: 0.7,
    });

    const output = completion.choices[0].message.content;

    return res.status(200).json({ output });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}