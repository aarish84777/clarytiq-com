export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const { preset, text } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ Missing API key!");
      return res.status(500).json({ error: "Server config error" });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text provided" });
    }

    // PRESET PROMPTS
    const presets = {
      simple: "Rewrite the text in clean natural simple language.",
      exam: "Rewrite the text in CBSE exam-ready formal answer style.",
      genz: "Rewrite the text in fun, clear, Gen-Z friendly language.",
      teacher: "Rewrite the text in neat, formal, teacher-safe language."
    };

    const systemPrompt = presets[preset] || presets.simple;

    // ----- OPENAI CALL -----
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();

    // debug log
    console.log("🔍 OpenAI raw:", data);

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "AI returned no choices" });
    }

    const output = data.choices[0].message.content.trim();

    return res.status(200).json({ output });

  } catch (err) {
    console.error("🔥 SERVER CRASH:", err);
    return res.status(500).json({ error: "Server crashed" });
  }
}
