import { Database } from "bun:sqlite";
import { homedir } from "os";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";
import type { DiaryEntry, DiaryStats } from "./types";

const DB_DIR = join(homedir(), ".solaris");
const DB_PATH = join(DB_DIR, "diary.db");

let db: Database | null = null;

export function initDatabase(): Database {
  if (db) return db;

  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);

  db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      content TEXT NOT NULL,
      mood TEXT,
      context TEXT
    )
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_entries_timestamp ON entries(timestamp DESC)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_entries_mood ON entries(mood)
  `);

  return db;
}

export function writeEntry(
  content: string,
  mood?: string,
  context?: string
): DiaryEntry {
  const database = initDatabase();
  const stmt = database.query(`
    INSERT INTO entries (content, mood, context)
    VALUES (?, ?, ?)
    RETURNING *
  `);

  const entry = stmt.get(content, mood ?? null, context ?? null) as DiaryEntry;

  return entry;
}

export function readEntries(limit: number, moodFilter?: string): DiaryEntry[] {
  const database = initDatabase();

  if (moodFilter) {
    const stmt = database.query(`
      SELECT * FROM entries
      WHERE mood = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return stmt.all(moodFilter, limit) as DiaryEntry[];
  }

  const stmt = database.query(`
    SELECT * FROM entries
    ORDER BY timestamp DESC
    LIMIT ?
  `);
  return stmt.all(limit) as DiaryEntry[];
}

export function getStats(): DiaryStats {
  const database = initDatabase();

  const totalResult = database
    .query("SELECT COUNT(*) as count FROM entries")
    .get() as { count: number };

  const moodRows = database
    .query(
      `
    SELECT mood, COUNT(*) as count
    FROM entries
    WHERE mood IS NOT NULL
    GROUP BY mood
  `
    )
    .all() as { mood: string; count: number }[];

  const moodDistribution: Record<string, number> = {};
  for (const row of moodRows) {
    moodDistribution[row.mood] = row.count;
  }

  const firstEntry = database
    .query("SELECT timestamp FROM entries ORDER BY timestamp ASC LIMIT 1")
    .get() as { timestamp: string } | undefined;

  const lastEntry = database
    .query("SELECT timestamp FROM entries ORDER BY timestamp DESC LIMIT 1")
    .get() as { timestamp: string } | undefined;

  return {
    totalEntries: totalResult.count,
    moodDistribution,
    firstEntry: firstEntry?.timestamp ?? null,
    lastEntry: lastEntry?.timestamp ?? null,
  };
}
