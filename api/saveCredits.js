import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "credits.json");

export default function handler(req, res) {
  const { userId, credits } = req.body;

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "{}");
  }

  const db = JSON.parse(fs.readFileSync(dbPath));

  db[userId] = credits;

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.json({ ok: true });
}
