import Groq from "groq-sdk";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { preset, userText } = req.body || {};

    console.log("BODY RECEIVED:", req.body);

    if (!userText || userText.trim() === "") {
      return res.status(400).json({ error: "Empty input" });
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const model = "llama-3.3-70b-versatile";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `Humanize text in preset: ${preset}.`,
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
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
