import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const file = path.join(process.cwd(), "proUsers.json");

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({}));
  }

  const db = JSON.parse(fs.readFileSync(file, "utf8"));
  const isPro = db[email] === true;

  return res.status(200).json({ active: isPro });
}
