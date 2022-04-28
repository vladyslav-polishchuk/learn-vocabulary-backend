import { Database } from 'sqlite3';

const setupSql = `
  CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT,
    token TEXT
	);
  CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
		value TEXT,
		count INTEGER
	);
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
		hash TEXT,
		name TEXT,
		share BOOLEAN,
		user INTEGER
	);
  CREATE TABLE IF NOT EXISTS learned_words (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user INTEGER,
		word INTEGER
	);
`;

export default async function createSchema(db: Database) {
  return new Promise((resolve, reject) => {
    db.exec(setupSql, (err) => {
      if (err) {
        console.log('Error running setup sql', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}
