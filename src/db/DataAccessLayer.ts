import { Database } from 'sqlite3';

export default class DataAccessLayer {
  declare db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create() {}

  async read(table: string) {}

  async update() {}

  async delete() {}
}
