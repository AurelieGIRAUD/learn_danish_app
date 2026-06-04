/**
 * Weekly content generator — run via Railway cron or manually: npm run generate
 * Adds new vocabulary, verbs, reading texts and sentence exercises via Claude.
 * Never deletes existing content.
 */

const Anthropic = require("@anthropic-ai/sdk");
const { db, init } = require("./db");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const WEEK = new Date().toISOString().slice(0, 10);

async function ask(prompt) {
  const msg = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });
  const text = msg.content[0].text.trim();
  return text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function existingDanish() {
  const { rows } = await db.execute("SELECT danish FROM vocabulary");
  return rows.map((r) => r.danish);
}

async function existingInfinitives() {
  const { rows } = await db.execute("SELECT infinitive FROM verbs");
  return rows.map((r) => r.infinitive);
}

async function existingReadingTitles() {
  const { rows } = await db.execute("SELECT title FROM reading");
  return rows.map((r) => r.title);
}

async function existingPrompts() {
  const { rows } = await db.execute("SELECT prompt FROM sentences");
  return rows.map((r) => r.prompt);
}

// ── Vocabulary ────────────────────────────────────────────────────────────────

async function generateVocabulary() {
  const existing = await existingDanish();
  const prompt = `You are a Danish language teacher. Generate 15 new Danish vocabulary words at B2 level.
Do NOT include any of these already-known words: ${existing.slice(-100).join(", ")}.

Return a JSON array only, no explanation. Each object:
{
  "danish": "string",
  "english": "string",
  "category": "one of: adjectives | nouns | adverbs | phrases | emotions | nature | work | travel | food | culture",
  "exampleSentence": "a simple example sentence in Danish using the word"
}`;

  const words = JSON.parse(await ask(prompt));
  let added = 0;
  for (const w of words) {
    try {
      await db.execute({
        sql: `INSERT INTO vocabulary (danish, english, category, exampleSentence, addedWeek)
              VALUES (?, ?, ?, ?, ?)`,
        args: [w.danish, w.english, w.category, w.exampleSentence ?? null, WEEK],
      });
      added++;
    } catch {
      // skip duplicates
    }
  }
  console.log(`✓ Vocabulary: +${added} words`);
}

// ── Verbs ─────────────────────────────────────────────────────────────────────

async function generateVerbs() {
  const existing = await existingInfinitives();
  const prompt = `You are a Danish language teacher. Generate 8 Danish verbs at B2 level.
Do NOT include any of these already-known verbs: ${existing.slice(-80).join(", ")}.

Return a JSON array only, no explanation. Each object:
{
  "infinitive": "string (without 'at')",
  "english": "string",
  "category": "one of: regular | irregular | modal | reflexive",
  "presentTense": "string (jeg-form, e.g. 'arbejder')",
  "pastTense": "string (e.g. 'arbejdede')",
  "pastParticiple": "string (e.g. 'arbejdet')",
  "exampleSentence": "a sentence in Danish using this verb"
}`;

  const verbs = JSON.parse(await ask(prompt));
  let added = 0;
  for (const v of verbs) {
    try {
      await db.execute({
        sql: `INSERT INTO verbs (infinitive, english, category, presentTense, pastTense, pastParticiple, exampleSentence, addedWeek)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [v.infinitive, v.english, v.category, v.presentTense, v.pastTense, v.pastParticiple, v.exampleSentence ?? null, WEEK],
      });
      added++;
    } catch {
      // skip duplicates (UNIQUE on infinitive)
    }
  }
  console.log(`✓ Verbs: +${added} verbs`);
}

// ── Reading ───────────────────────────────────────────────────────────────────

async function generateReading() {
  const existing = await existingReadingTitles();
  const prompt = `You are a Danish language teacher. Write 2 short reading texts in Danish at B2 level.
Do NOT use topics already covered: ${existing.slice(-20).join(", ")}.

Return a JSON array only, no explanation. Each object:
{
  "title": "string",
  "content": "4-6 paragraphs in Danish, separated by newlines",
  "theme": "one of: samfund | natur | kultur | hverdagsliv | historie | teknologi | sundhed | økonomi",
  "difficulty": "one of: B1 | B2 | C1",
  "questions": JSON-encoded string of an array of 4 comprehension questions, each:
    { "question": "string in Danish", "options": ["A", "B", "C", "D"], "answer": "the correct option text", "explanation": "brief explanation in Danish" }
}

IMPORTANT: the "questions" field must be a JSON-encoded string (call JSON.stringify on the array).`;

  const texts = JSON.parse(await ask(prompt));
  let added = 0;
  for (const t of texts) {
    const questions = typeof t.questions === "string" ? t.questions : JSON.stringify(t.questions);
    await db.execute({
      sql: `INSERT INTO reading (title, content, theme, difficulty, questions, addedWeek)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [t.title, t.content, t.theme, t.difficulty, questions, WEEK],
    });
    added++;
  }
  console.log(`✓ Reading: +${added} texts`);
}

// ── Sentences ─────────────────────────────────────────────────────────────────

async function generateSentences() {
  const existing = await existingPrompts();
  const prompt = `You are a Danish language teacher. Create 10 sentence-building exercises at B2 level.
Do NOT repeat these existing prompts: ${existing.slice(-30).join(" | ")}.

Return a JSON array only, no explanation. Each object:
{
  "prompt": "a situation or question in Danish that the student must respond to in full sentences",
  "theme": "one of: dagligliv | rejse | arbejde | følelser | natur | kultur | sundhed | samfund",
  "grammarFocus": "e.g. 'datid', 'konjunktiv', 'passiv', 'biord', 'konditionalis'",
  "exampleAnswer": "a model answer sentence in Danish",
  "hints": JSON-encoded string of an array of 2-3 hint strings in Danish
}

IMPORTANT: the "hints" field must be a JSON-encoded string (call JSON.stringify on the array).`;

  const exercises = JSON.parse(await ask(prompt));
  let added = 0;
  for (const e of exercises) {
    const hints = typeof e.hints === "string" ? e.hints : JSON.stringify(e.hints);
    await db.execute({
      sql: `INSERT INTO sentences (prompt, theme, grammarFocus, exampleAnswer, hints, addedWeek)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [e.prompt, e.theme, e.grammarFocus, e.exampleAnswer, hints, WEEK],
    });
    added++;
  }
  console.log(`✓ Sentences: +${added} exercises`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set");
    process.exit(1);
  }

  await init();
  console.log(`\n🇩🇰 Generating weekly content for week of ${WEEK}...\n`);

  try {
    await generateVocabulary();
    await generateVerbs();
    await generateReading();
    await generateSentences();
    console.log("\n✅ Done. New content is live.");
  } catch (err) {
    console.error("Generation failed:", err.message);
    process.exit(1);
  }
}

main();
