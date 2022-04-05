import sqlite3 from 'sqlite3';
import createSchema from './createSchema';

export default async function getDB() {
  const verbose = sqlite3.verbose();
  const db = new verbose.Database('../db.sqlite');

  await createSchema(db);

  return db;
}
