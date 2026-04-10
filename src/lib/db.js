import Database from "better-sqlite3";
import path from "path";
import { CLUBS, TRIALS, MATCHES, CONTACTS, INBOX } from "@/store/data";

const DB_PATH = process.env.DB_PATH
  || (process.env.NODE_ENV === "production" ? "/tmp/fotballjeger.db" : path.join(process.cwd(), "fotballjeger.db"));

let _db = null;

export function getDb() {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  initTables(_db);
  return _db;
}

function initTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clubs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      distance REAL,
      badge TEXT,
      badge_type TEXT,
      tags TEXT,
      path_score INTEGER,
      youth_gap INTEGER,
      coach_alert TEXT,
      insight TEXT,
      goldmine INTEGER DEFAULT 0,
      avoid INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS trials (
      id TEXT PRIMARY KEY,
      month TEXT,
      day TEXT,
      name TEXT NOT NULL,
      sub TEXT,
      applied INTEGER DEFAULT 0,
      source TEXT
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      opp TEXT NOT NULL,
      date TEXT,
      pos TEXT,
      mins INTEGER,
      goals INTEGER DEFAULT 0,
      assists INTEGER DEFAULT 0,
      result TEXT,
      score TEXT,
      rating REAL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      initials TEXT,
      av_color TEXT,
      name TEXT NOT NULL,
      role TEXT,
      club TEXT,
      last_contact TEXT,
      strength INTEGER DEFAULT 0,
      type TEXT,
      tags TEXT,
      connection TEXT,
      insight TEXT,
      somalia_link INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS inbox (
      id TEXT PRIMARY KEY,
      club TEXT,
      preview TEXT,
      status TEXT,
      date TEXT,
      full_text TEXT,
      gmail_id TEXT,
      is_gmail INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS gmail_tokens (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      access_token TEXT,
      refresh_token TEXT,
      expiry_date INTEGER
    );

    CREATE TABLE IF NOT EXISTS simulations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_level TEXT,
      target_age INTEGER,
      results TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed if empty
  const count = db.prepare("SELECT COUNT(*) as c FROM clubs").get();
  if (count.c === 0) {
    const insertClub = db.prepare(`INSERT OR IGNORE INTO clubs VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
    for (const c of CLUBS) {
      insertClub.run(c.id, c.name, c.distance, c.badge, c.badgeType, JSON.stringify(c.tags), c.pathScore, c.youthGap, c.coachAlert ? JSON.stringify(c.coachAlert) : null, c.insight, c.goldmine ? 1 : 0, c.avoid ? 1 : 0);
    }

    const insertTrial = db.prepare(`INSERT OR IGNORE INTO trials VALUES (?,?,?,?,?,?,?)`);
    for (const t of TRIALS) {
      insertTrial.run(t.id, t.month, t.day, t.name, t.sub, t.applied ? 1 : 0, t.source);
    }

    const insertMatch = db.prepare(`INSERT OR IGNORE INTO matches VALUES (?,?,?,?,?,?,?,?,?,?)`);
    for (const m of MATCHES) {
      insertMatch.run(m.id, m.opp, m.date, m.pos, m.mins, m.goals, m.assists, m.result, m.score, m.rating);
    }

    const insertContact = db.prepare(`INSERT OR IGNORE INTO contacts VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
    for (const c of CONTACTS) {
      insertContact.run(c.id, c.initials, c.avColor, c.name, c.role, c.club, c.lastContact, c.strength, c.type, JSON.stringify(c.tags), c.connection, c.insight, c.somaliaLink ? 1 : 0);
    }

    const insertInbox = db.prepare(`INSERT OR IGNORE INTO inbox VALUES (?,?,?,?,?,?,?,?)`);
    for (const i of INBOX) {
      insertInbox.run(i.id, i.club, i.preview, i.status, i.date, i.full, null, 0);
    }
  }
}

// Query helpers
export function getAllClubs() {
  const rows = getDb().prepare("SELECT * FROM clubs ORDER BY path_score DESC").all();
  return rows.map(r => ({
    ...r,
    tags: JSON.parse(r.tags || "[]"),
    coachAlert: r.coach_alert ? JSON.parse(r.coach_alert) : null,
    pathScore: r.path_score,
    youthGap: r.youth_gap,
    badgeType: r.badge_type,
    goldmine: !!r.goldmine,
    avoid: !!r.avoid,
  }));
}

export function getAllTrials() {
  return getDb().prepare("SELECT * FROM trials ORDER BY month, day").all().map(r => ({
    ...r, applied: !!r.applied,
  }));
}

export function getAllMatches() {
  return getDb().prepare("SELECT * FROM matches ORDER BY rowid DESC").all();
}

export function addMatch(match) {
  getDb().prepare(`INSERT INTO matches VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
    match.id, match.opp, match.date, match.pos, match.mins, match.goals, match.assists, match.result, match.score, match.rating
  );
}

export function getAllContacts() {
  return getDb().prepare("SELECT * FROM contacts").all().map(r => ({
    ...r,
    tags: JSON.parse(r.tags || "[]"),
    avColor: r.av_color,
    lastContact: r.last_contact,
    somaliaLink: !!r.somalia_link,
  }));
}

export function getAllInbox() {
  return getDb().prepare("SELECT * FROM inbox ORDER BY rowid DESC").all().map(r => ({
    ...r,
    full: r.full_text,
    isGmail: !!r.is_gmail,
    gmailId: r.gmail_id,
  }));
}

export function saveGmailTokens(tokens) {
  getDb().prepare(`INSERT OR REPLACE INTO gmail_tokens (id, access_token, refresh_token, expiry_date) VALUES (1, ?, ?, ?)`)
    .run(tokens.access_token, tokens.refresh_token, tokens.expiry_date);
}

export function getGmailTokens() {
  return getDb().prepare("SELECT * FROM gmail_tokens WHERE id = 1").get();
}

export function saveSim(targetLevel, targetAge, results) {
  getDb().prepare(`INSERT INTO simulations (target_level, target_age, results) VALUES (?, ?, ?)`)
    .run(targetLevel, targetAge, JSON.stringify(results));
}
