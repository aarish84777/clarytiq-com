import Groq from "groq-sdk";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  console.log("HANDLER HIT");

  if (req.method !== "POST") {
    console.log("405 METHOD");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("BODY RAW:", req.body);

  const { preset, userText } = req.body || {};

  console.log("Parsed:", preset, userText);

  if (!userText || userText.trim() === "") {
    console.log("EMPTY INPUT");
    return res.status(400).json({ error: "Empty input" });
  }

  try {
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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

  } catch (err) {
    console.log("SERVER ERROR", err);
    return res.status(500).json({ error: err.message });
  }
}
