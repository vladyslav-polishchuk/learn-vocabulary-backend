import { Database } from 'sqlite3';

export interface DbRecord extends Record<string, string | number | boolean> {
  id?: number;
}

const valueByType = (value: string | number | boolean) => {
  return typeof value === 'string' ? `"${value}"` : value;
};

export default class DataAccessLayer {
  declare db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(tableName: string, item: DbRecord): Promise<unknown> {
    const values = Object.values(item);
    const propNames = Object.keys(item).join(',');
    const valuesTemplate = Array(values.length).fill('?').join(',');
    const sql = `INSERT INTO ${tableName}(${propNames}) VALUES (${valuesTemplate})`;

    return this.#run(sql, values);
  }

  async read(
    tableName: string,
    filterProperties: DbRecord = {},
    orderBy: Record<string, 'asc' | 'desc'> = {}
  ): Promise<Record<string, string | boolean | number>[]> {
    const criteriaList = Object.entries(filterProperties)
      .map(
        ([criteriaName, criteriaValue]) =>
          `${criteriaName} = ${valueByType(criteriaValue)}`
      )
      .join(' AND ');
    const filterCriteria = criteriaList ? `WHERE ${criteriaList}` : '';
    const orderByProperties = Object.entries(orderBy)
      .map(([key, value]) => {
        return `${key} ${value}`;
      })
      .join(',');
    const orderByCriteria = orderByProperties.length
      ? `ORDER BY ${orderByProperties}`
      : '';
    const sql = `SELECT * from ${tableName} ${filterCriteria} ${orderByCriteria}`;

    return this.#run(sql, [], 'all');
  }

  async update(
    tableName: string,
    item: DbRecord,
    uniqueKey: string = 'id'
  ): Promise<boolean> {
    const values = Object.entries(item)
      .filter(([propName]) => propName !== uniqueKey)
      .map(
        ([propName, propValue]) => `${propName} = ${valueByType(propValue)}`
      );
    const id = item[uniqueKey];
    const sql = `UPDATE ${tableName} SET ${values.join(',')} WHERE id = ${id}`;

    return this.#run(sql);
  }

  async delete(tableName: string) {}

  async transaction(callback: () => Promise<unknown>) {
    this.db.run('BEGIN TRANSACTION');

    let result = null;
    try {
      result = await callback();

      this.db.run('COMMIT');
    } catch (e) {
      console.log('Transaction error', e);

      this.db.run('ROLLBACK');
    }

    return result;
  }

  async #run<T>(
    sql: string,
    params: unknown[] = [],
    command: 'run' | 'all' = 'run'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db[command](sql, params, (err: Error, result: T) => {
        if (err) {
          console.log(err, sql, params, command);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
