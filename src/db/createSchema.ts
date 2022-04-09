import { Database } from 'sqlite3';

const tables = [
  `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT
	);`,
  `CREATE TABLE IF NOT EXISTS words (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		text TEXT,
		frequency INTEGER
	);`,
  `CREATE TABLE IF NOT EXISTS processed_books (
		hash TEXT PRIMARY KEY,
		name TEXT,
		share BOOLEAN,
		user INTEGER
	);`,
  `CREATE TABLE IF NOT EXISTS learned_words (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user INTEGER,
		word INTEGER
	);`,
];

export default async function createSchema(db: Database) {
  const createTablePromises = tables.map(
    (createTableSql) =>
      new Promise((resolve, reject) => {
        db.run(createTableSql, [], (err) => {
          if (err) {
            console.log('Error running setup sql');
            console.log(err);
            reject(err);
          } else {
            resolve(true);
          }
        });
      })
  );

  return Promise.all(createTablePromises);
}
