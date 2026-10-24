'use strict';
const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

function createDatabase(filename = ':memory:') {
  if (filename !== ':memory:') fs.mkdirSync(path.dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec([
    'PRAGMA foreign_keys=ON;',
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);',
    'CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);',
    'CREATE TABLE IF NOT EXISTS rooms (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, building TEXT NOT NULL, capacity INTEGER NOT NULL CHECK(capacity > 0), facilities TEXT NOT NULL DEFAULT "");',
    'CREATE TABLE IF NOT EXISTS reservations (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id), room_id INTEGER NOT NULL REFERENCES rooms(id), start_time TEXT NOT NULL, end_time TEXT NOT NULL, status TEXT NOT NULL DEFAULT "confirmed");'
  ].join('\n'));
  if (db.prepare('SELECT COUNT(*) AS n FROM rooms').get().n === 0) {
    const add = db.prepare('INSERT INTO rooms (name, building, capacity, facilities) VALUES (?, ?, ?, ?)');
    [['Quiet Room A','Library',4,'Wi-Fi, whiteboard'],['Discussion Room B','CS Block',8,'Wi-Fi, display'],['Focus Room C','Library',2,'Power outlets'],['Team Room D','Academic Block',6,'Whiteboard, display']].forEach(row => add.run(...row));
  }
  return db;
}
module.exports = { createDatabase };
