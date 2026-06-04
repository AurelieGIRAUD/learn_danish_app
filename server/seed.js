/**
 * Seeds the database with initial Danish learning content.
 * Run once after first deploy: npm run seed
 * Safe to re-run — skips existing entries.
 */

const { db, init } = require("./db");

const WEEK = "2026-W23";

const vocabulary = [
  { danish: "bevidst", english: "conscious / aware", category: "adjectives", exampleSentence: "Hun er meget bevidst om miljøet." },
  { danish: "tilsvarende", english: "corresponding / equivalent", category: "adjectives", exampleSentence: "Det er en tilsvarende situation." },
  { danish: "udfordring", english: "challenge", category: "nouns", exampleSentence: "Det er en stor udfordring at lære dansk." },
  { danish: "sammenhæng", english: "context / connection", category: "nouns", exampleSentence: "Du skal forstå sammenhængen." },
  { danish: "holdning", english: "attitude / opinion", category: "nouns", exampleSentence: "Hvad er din holdning til det?" },
  { danish: "indflydelse", english: "influence", category: "nouns", exampleSentence: "Forældrene har stor indflydelse på børnene." },
  { danish: "desuden", english: "furthermore / besides", category: "adverbs", exampleSentence: "Desuden er det billigere at cykle." },
  { danish: "efterhånden", english: "gradually / by now", category: "adverbs", exampleSentence: "Efterhånden forstår jeg mere dansk." },
  { danish: "alligevel", english: "anyway / still", category: "adverbs", exampleSentence: "Jeg prøver alligevel." },
  { danish: "til gengæld", english: "on the other hand / in return", category: "phrases", exampleSentence: "Til gengæld er det meget smukt." },
  { danish: "i øvrigt", english: "by the way / moreover", category: "phrases", exampleSentence: "I øvrigt er det ikke sandt." },
  { danish: "glæde", english: "joy / happiness", category: "emotions", exampleSentence: "Det giver mig stor glæde." },
  { danish: "utålmodig", english: "impatient", category: "emotions", exampleSentence: "Han bliver hurtigt utålmodig." },
  { danish: "skov", english: "forest / woods", category: "nature", exampleSentence: "Vi gik en tur i skoven." },
  { danish: "overveje", english: "to consider", category: "nouns", exampleSentence: "Jeg overvejer at flytte til Danmark." },
];

const verbs = [
  { infinitive: "arbejde", english: "to work", category: "regular", presentTense: "arbejder", pastTense: "arbejdede", pastParticiple: "arbejdet", exampleSentence: "Jeg arbejder hver dag." },
  { infinitive: "forstå", english: "to understand", category: "irregular", presentTense: "forstår", pastTense: "forstod", pastParticiple: "forstået", exampleSentence: "Forstår du hvad jeg siger?" },
  { infinitive: "fortælle", english: "to tell / to narrate", category: "irregular", presentTense: "fortæller", pastTense: "fortalte", pastParticiple: "fortalt", exampleSentence: "Hun fortalte en god historie." },
  { infinitive: "beslutte", english: "to decide", category: "regular", presentTense: "beslutter", pastTense: "besluttede", pastParticiple: "besluttet", exampleSentence: "Vi besluttede at tage til stranden." },
  { infinitive: "opnå", english: "to achieve", category: "irregular", presentTense: "opnår", pastTense: "opnåede", pastParticiple: "opnået", exampleSentence: "Hun opnåede sit mål." },
  { infinitive: "undervise", english: "to teach", category: "regular", presentTense: "underviser", pastTense: "underviste", pastParticiple: "undervist", exampleSentence: "Han underviser i matematik." },
  { infinitive: "udvikle", english: "to develop", category: "regular", presentTense: "udvikler", pastTense: "udviklede", pastParticiple: "udviklet", exampleSentence: "Teknologien udvikler sig hurtigt." },
  { infinitive: "synes", english: "to think / to feel (opinion)", category: "irregular", presentTense: "synes", pastTense: "syntes", pastParticiple: "syntes", exampleSentence: "Jeg synes det er rigtig godt." },
];

const reading = [
  {
    title: "Hygge — mere end et ord",
    content: `Hygge er et dansk ord, som er svært at oversætte til andre sprog. Det handler om en følelse af velvære, samvær og tryghed — ofte med stearinlys, varm kakao og gode venner.

Selvom hygge er mest kendt som et dansk fænomen, finder man lignende idéer i mange kulturer. Men danskerne har gjort det til en del af deres nationale identitet.

Forskning viser, at Danmark konsekvent rangerer som et af de lykkeligste lande i verden. Mange eksperter mener, at hygge-kulturen spiller en vigtig rolle i dette.

Hygge handler ikke om luksus eller dyre ting. Det handler om nærvær og om at skabe et rum, hvor alle føler sig velkomne og afslappede.

Prøv selv: sluk telefonen, tænd et lys, og vær til stede i øjeblikket. Måske opdager du din egen version af hygge.`,
    theme: "kultur",
    difficulty: "B2",
    questions: JSON.stringify([
      { question: "Hvad er hygge ifølge teksten?", options: ["En dyr livsstil", "En følelse af velvære og samvær", "Et gammelt dansk ritual", "En type mad"], answer: "En følelse af velvære og samvær", explanation: "Teksten beskriver hygge som en følelse af velvære, samvær og tryghed." },
      { question: "Hvordan rangerer Danmark internationalt?", options: ["Som et af de rigeste lande", "Som et af de lykkeligste lande", "Som et af de koldeste lande", "Som et af de mindste lande"], answer: "Som et af de lykkeligste lande", explanation: "Teksten siger at Danmark konsekvent rangerer som et af de lykkeligste lande." },
      { question: "Hvad er hygge IKKE ifølge teksten?", options: ["Nærvær", "Luksus og dyre ting", "At føle sig velkommen", "At være afslappet"], answer: "Luksus og dyre ting", explanation: "Teksten siger eksplicit at hygge ikke handler om luksus eller dyre ting." },
      { question: "Hvad foreslår teksten at man gør for at opleve hygge?", options: ["Købe dyre stearinlys", "Rejse til Danmark", "Slukke telefonen og være til stede", "Invitere mange mennesker"], answer: "Slukke telefonen og være til stede", explanation: "Teksten opfordrer til at slukke telefonen og være til stede i øjeblikket." },
    ]),
  },
  {
    title: "Cykling i Danmark",
    content: `Danmark er et af verdens mest cykelvenlige lande. I København cykler over 60% af alle pendlere til arbejde eller uddannelse, uanset vejret.

Cykelstierne er velbevaret og adskilt fra biltrafikken. Det gør det sikkert og behageligt at cykle, selv for børn og ældre.

Cykling er ikke kun godt for miljøet — det er også godt for helbredet. Studier viser, at danskere, der cykler regelmæssigt, lever længere og har færre stresssymptomer.

Byerne investerer løbende i nye cykelbroer og grønne ruter. Den berømte Cykelslangen i København er et eksempel på moderne cykelinfrastruktur.

For mange danskere er cyklen mere end et transportmiddel — det er en livsstil og et symbol på frihed og uafhængighed.`,
    theme: "hverdagsliv",
    difficulty: "B1",
    questions: JSON.stringify([
      { question: "Hvor mange pendlere cykler i København?", options: ["Over 40%", "Over 50%", "Over 60%", "Over 70%"], answer: "Over 60%", explanation: "Teksten siger at over 60% af alle pendlere cykler i København." },
      { question: "Hvad gør de danske cykelstier særlige?", options: ["De er meget brede", "De er adskilt fra biltrafikken", "De er gratis at bruge", "De er oplyste om natten"], answer: "De er adskilt fra biltrafikken", explanation: "Teksten nævner at cykelstierne er adskilt fra biltrafikken, hvilket gør det sikkert." },
      { question: "Hvad viser studier om danskere der cykler?", options: ["De tjener mere", "De sover bedre", "De lever længere", "De er gladere for deres job"], answer: "De lever længere", explanation: "Studier viser at danskere der cykler regelmæssigt lever længere." },
      { question: "Hvad er Cykelslangen?", options: ["Et cykelmærke", "En cykelrute i naturen", "Et eksempel på moderne cykelinfrastruktur", "En cykelfestival"], answer: "Et eksempel på moderne cykelinfrastruktur", explanation: "Teksten beskriver Cykelslangen som et eksempel på moderne cykelinfrastruktur." },
    ]),
  },
];

const sentences = [
  { prompt: "Beskriv din typiske morgenrutine på dansk.", theme: "dagligliv", grammarFocus: "nutid", exampleAnswer: "Jeg vågner klokken syv, spiser morgenmad og cykler derefter på arbejde.", hints: JSON.stringify(["Brug nutid (præsens)", "Inkluder mindst tre handlinger", "Brug tidsudtryk som 'derefter', 'så', 'til sidst'"]) },
  { prompt: "Hvad ville du gøre, hvis du vandt en million kroner?", theme: "dagligliv", grammarFocus: "konditionalis", exampleAnswer: "Hvis jeg vandt en million kroner, ville jeg rejse verden rundt og købe et hus ved havet.", hints: JSON.stringify(["Brug 'hvis + datid' + 'ville + infinitiv'", "Forklar dine valg", "Prøv at bruge 'desuden' eller 'derudover'"]) },
  { prompt: "Fortæl om et sted i naturen, som du holder af.", theme: "natur", grammarFocus: "datid", exampleAnswer: "Da jeg var barn, elskede jeg at gå i skoven bag vores hus. Det var roligt og fredeligt.", hints: JSON.stringify(["Brug datid (imperfektum)", "Beskriv stedet med adjektiver", "Forklar hvorfor du kan lide det"]) },
  { prompt: "Hvad synes du er den største udfordring ved at lære et nyt sprog?", theme: "kultur", grammarFocus: "meningsudtryk", exampleAnswer: "Jeg synes, at udtalen er den sværeste del, fordi dansk har mange lyde, der ikke findes på andre sprog.", hints: JSON.stringify(["Brug 'jeg synes' eller 'efter min mening'", "Giv en begrundelse med 'fordi'", "Brug et konkret eksempel"]) },
  { prompt: "Beskriv en dag, hvor alt gik galt.", theme: "følelser", grammarFocus: "datid", exampleAnswer: "En morgen mistede jeg min nøgle, gik glip af bussen og ankom for sent til et vigtigt møde.", hints: JSON.stringify(["Brug datid", "Brug bindeord som 'og', 'men', 'så'", "Udtryk dine følelser"]) },
];

async function main() {
  await init();
  let counts = { vocab: 0, verbs: 0, reading: 0, sentences: 0 };

  for (const w of vocabulary) {
    try {
      await db.execute({
        sql: `INSERT INTO vocabulary (danish, english, category, exampleSentence, addedWeek) VALUES (?, ?, ?, ?, ?)`,
        args: [w.danish, w.english, w.category, w.exampleSentence ?? null, WEEK],
      });
      counts.vocab++;
    } catch { /* skip duplicates */ }
  }

  for (const v of verbs) {
    try {
      await db.execute({
        sql: `INSERT INTO verbs (infinitive, english, category, presentTense, pastTense, pastParticiple, exampleSentence, addedWeek) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [v.infinitive, v.english, v.category, v.presentTense, v.pastTense, v.pastParticiple, v.exampleSentence ?? null, WEEK],
      });
      counts.verbs++;
    } catch { /* skip duplicates */ }
  }

  for (const r of reading) {
    const { rows } = await db.execute({ sql: "SELECT 1 FROM reading WHERE title = ?", args: [r.title] });
    if (rows.length === 0) {
      await db.execute({
        sql: `INSERT INTO reading (title, content, theme, difficulty, questions, addedWeek) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [r.title, r.content, r.theme, r.difficulty, r.questions, WEEK],
      });
      counts.reading++;
    }
  }

  for (const s of sentences) {
    const { rows } = await db.execute({ sql: "SELECT 1 FROM sentences WHERE prompt = ?", args: [s.prompt] });
    if (rows.length === 0) {
      await db.execute({
        sql: `INSERT INTO sentences (prompt, theme, grammarFocus, exampleAnswer, hints, addedWeek) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [s.prompt, s.theme, s.grammarFocus, s.exampleAnswer, s.hints, WEEK],
      });
      counts.sentences++;
    }
  }

  console.log(`✅ Seed complete — vocab: ${counts.vocab}, verbs: ${counts.verbs}, reading: ${counts.reading}, sentences: ${counts.sentences}`);
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
