import { Database } from 'sqlite3';

const initialDataSql = ``;

export default async function createInitialData(db: Database) {
  return new Promise((resolve, reject) => {
    db.exec(initialDataSql, (err) => {
      if (err) {
        console.log('Error creating initial data', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}
