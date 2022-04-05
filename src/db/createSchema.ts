import { Database } from 'sqlite3';

const initSQLQuery = `
	CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT
	)
`;

export default async function createSchema(db: Database) {
  return new Promise((resolve, reject) => {
    db.run(initSQLQuery, [], function (err) {
      if (err) {
        console.log('Error running setup sql');
        console.log(err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}
