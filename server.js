const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const FILE = path.join(__dirname, "movie_choices.txt");

app.post("/save-movie", (req, res) => {
  const movie = String(req.body.movie || "").trim();
  if (!movie) return res.status(400).json({ ok: false, error: "No movie provided" });

  const iso = new Date().toISOString();
  const local = new Date().toLocaleString();
  const line = `${iso}\t${local}\t${movie}\n`;

  fs.appendFile(FILE, line, (err) => {
    if (err) return res.status(500).json({ ok: false, error: "Failed to write file" });
    res.json({ ok: true });
  });
});

app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log("Running at http://localhost:3000");
  console.log("Movie answers will be saved to movie_choices.txt");
});

