const { createClient } = require("@libsql/client");
const path = require("path");
const fs = require("fs");

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, "data")
  : path.join(__dirname, "../data");

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = createClient({ url: `file:${path.join(DATA_DIR, "danish.db")}` });

async function init() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      danish TEXT NOT NULL,
      english TEXT NOT NULL,
      category TEXT NOT NULL,
      exampleSentence TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      nextReview TEXT,
      addedWeek TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS verbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      infinitive TEXT NOT NULL UNIQUE,
      english TEXT NOT NULL,
      category TEXT NOT NULL,
      presentTense TEXT NOT NULL,
      pastTense TEXT NOT NULL,
      pastParticiple TEXT NOT NULL,
      exampleSentence TEXT,
      addedWeek TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS reading (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      theme TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      questions TEXT NOT NULL,
      addedWeek TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS sentences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT NOT NULL,
      theme TEXT NOT NULL,
      grammarFocus TEXT NOT NULL,
      exampleAnswer TEXT NOT NULL,
      hints TEXT NOT NULL DEFAULT '[]',
      addedWeek TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      section TEXT NOT NULL,
      score REAL NOT NULL,
      totalQuestions INTEGER NOT NULL,
      correctAnswers INTEGER NOT NULL,
      durationSeconds INTEGER,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS wordbank (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wordId INTEGER NOT NULL,
      addedAt TEXT NOT NULL,
      personalNote TEXT
    );
  `);
}

module.exports = { db, init };
