import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "credits.json");

export default function handler(req, res) {
  const { userId } = req.query;

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "{}");
  }

  const db = JSON.parse(fs.readFileSync(dbPath));

  res.json(db[userId] || null);
}
