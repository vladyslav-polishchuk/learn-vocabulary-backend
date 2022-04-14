import { Database } from 'sqlite3';

export interface DbRecord extends Record<string, string | number | boolean> {
  id?: number;
}

export default class DataAccessLayer {
  declare db: Database;

  constructor(db: Database) {
    this.db = db;
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

  async create(
    tableName: string,
    items: DbRecord | DbRecord[]
  ): Promise<unknown> {
    const rowsToInsert = Array.isArray(items) ? items : [items];
    const chunks = [];
    const chunkSize = 50;
    for (let i = 0; i < rowsToInsert.length; i += chunkSize) {
      chunks.push(rowsToInsert.slice(i, i + chunkSize));
    }
    const promises = chunks.map((rows) => {
      let params: unknown[] = [];
      const propNames = Object.keys(rows[0]);
      const propValues = rows
        .map((properties) => {
          params = params.concat(...Object.values(properties));

          return `(${propNames.map(() => '?').join(',')})`;
        })
        .join(',');
      const sql = `INSERT INTO ${tableName}(${propNames.join(
        ','
      )}) VALUES ${propValues}`;

      return this.#run(sql, params);
    });

    return Promise.all(promises as Promise<boolean>[]);
  }

  async read(
    tableName: string,
    filterProperties: DbRecord = {}
  ): Promise<Record<string, string | boolean | number>[]> {
    const criteriaList = Object.entries(filterProperties)
      .map(([criteriaName, criteriaValue]) => {
        const typedCriteriaValue =
          typeof criteriaValue === 'string'
            ? `"${criteriaValue}"`
            : criteriaValue;

        return `${criteriaName} = ${typedCriteriaValue}`;
      })
      .join(' AND ');
    const filterCriteria = criteriaList ? `WHERE ${criteriaList}` : '';
    const sql = `SELECT * from ${tableName} ${filterCriteria}`;

    return this.#run(sql, [], 'all');
  }

  async update(tableName: string, properties: DbRecord): Promise<boolean> {
    const values = Object.entries(properties)
      .filter(([propName]) => propName !== 'id')
      .map(([propName, propValue]) => {
        return `${propName} = ${
          typeof propValue === 'string' ? `"${propValue}"` : propValue
        }`;
      });
    const sql = `UPDATE ${tableName} SET ${values.join(',')} WHERE id = ${
      properties.id
    }`;

    return this.#run(sql);
  }

  async delete() {}
}
