export default async function handler(req, res) {
  try {
    const { preset, text } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text provided" });
    }

    const presetPrompts = {
      simple: "Rewrite the text in clean, natural, human language.",
      exam: "Rewrite the text in CBSE exam-style proper answers.",
      genz: "Rewrite the text in Gen-Z tone: fun but clear (not cringe).",
      teacher: "Rewrite the text in formal, neat, teacher-safe language."
    };

    const systemPrompt = presetPrompts[preset] || presetPrompts.simple;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        temperature: 0.7
      })
    });

    const data = await aiRes.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "AI returned no output" });
    }

    res.status(200).json({
      text: data.choices[0].message.content.trim()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
