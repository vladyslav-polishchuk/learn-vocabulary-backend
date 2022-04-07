import sqlite3 from 'sqlite3';
import createInitialData from './createData';
import createSchema from './createSchema';
import DataAccessLayer from './DataAccessLayer';

export default async function getDB(): Promise<DataAccessLayer> {
  const db = new sqlite3.Database('./db.sqlite');

  await createSchema(db);
  await createInitialData(db);

  return new DataAccessLayer(db);
}
