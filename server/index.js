const express = require("express");
const path = require("path");
const { db, init } = require("./db");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// ── Vocabulary ────────────────────────────────────────────────────────────────

app.get("/api/vocabulary", async (req, res) => {
  const { rows } = await db.execute("SELECT * FROM vocabulary ORDER BY id");
  res.json(rows);
});

app.patch("/api/vocabulary/:id/status", async (req, res) => {
  const { status, nextReview } = req.body;
  await db.execute({
    sql: "UPDATE vocabulary SET status = ?, nextReview = ? WHERE id = ?",
    args: [status, nextReview ?? null, req.params.id],
  });
  res.json({ ok: true });
});

// ── Verbs ─────────────────────────────────────────────────────────────────────

app.get("/api/verbs", async (req, res) => {
  const { rows } = await db.execute("SELECT * FROM verbs ORDER BY id");
  res.json(rows);
});

// ── Reading ───────────────────────────────────────────────────────────────────

app.get("/api/reading", async (req, res) => {
  const { rows } = await db.execute("SELECT * FROM reading ORDER BY id");
  res.json(rows);
});

// ── Sentences ─────────────────────────────────────────────────────────────────

app.get("/api/sentences", async (req, res) => {
  const { rows } = await db.execute("SELECT * FROM sentences ORDER BY id");
  res.json(rows);
});

// ── Sessions ──────────────────────────────────────────────────────────────────

app.get("/api/sessions", async (req, res) => {
  const { rows } = await db.execute(
    "SELECT * FROM sessions ORDER BY date DESC, id DESC"
  );
  res.json(rows);
});

app.post("/api/sessions", async (req, res) => {
  const { date, section, score, totalQuestions, correctAnswers, durationSeconds, notes } = req.body;
  const result = await db.execute({
    sql: `INSERT INTO sessions (date, section, score, totalQuestions, correctAnswers, durationSeconds, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [date, section, score, totalQuestions, correctAnswers, durationSeconds ?? null, notes ?? null],
  });
  res.json({ id: Number(result.lastInsertRowid) });
});

// ── Wordbank ──────────────────────────────────────────────────────────────────

app.get("/api/wordbank", async (req, res) => {
  const { rows } = await db.execute(`
    SELECT wb.id, wb.wordId, wb.addedAt, wb.personalNote,
           v.danish, v.english, v.category
    FROM wordbank wb
    JOIN vocabulary v ON v.id = wb.wordId
    ORDER BY wb.addedAt DESC
  `);
  res.json(
    rows.map(({ id, wordId, addedAt, personalNote, danish, english, category }) => ({
      id,
      wordId,
      addedAt,
      personalNote,
      word: { id: wordId, danish, english, category },
    }))
  );
});

app.post("/api/wordbank", async (req, res) => {
  const { wordId, addedAt, personalNote } = req.body;
  const result = await db.execute({
    sql: "INSERT INTO wordbank (wordId, addedAt, personalNote) VALUES (?, ?, ?)",
    args: [wordId, addedAt, personalNote ?? null],
  });
  res.json({ id: Number(result.lastInsertRowid) });
});

app.delete("/api/wordbank/:id", async (req, res) => {
  await db.execute({ sql: "DELETE FROM wordbank WHERE id = ?", args: [req.params.id] });
  res.json({ ok: true });
});

// ── Catch-all → SPA ───────────────────────────────────────────────────────────

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

init()
  .then(() => app.listen(PORT, () => console.log(`Dansk Lær running on port ${PORT}`)))
  .catch((err) => { console.error("DB init failed:", err); process.exit(1); });
