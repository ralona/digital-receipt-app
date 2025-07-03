import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Create database directory if it doesn't exist
const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "receipts.db");

// Initialize SQLite database
export const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better performance
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

// Create tables if they don't exist
export function initializeDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Create receipts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL,
      payer_name TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      signature_url TEXT,
      pdf_url TEXT,
      drive_file_id TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Database initialized successfully");
}

// Initialize the database on import
initializeDatabase();