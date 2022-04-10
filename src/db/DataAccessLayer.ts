import { Database } from 'sqlite3';

export default class DataAccessLayer {
  declare db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(
    tableName: string,
    properties: Record<string, string | number | boolean>
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const propNames = Object.keys(properties);
      const propValues = Object.values(properties);
      const sql = `INSERT INTO ${tableName}(${propNames.join(
        ','
      )}) VALUES (${propNames.map(() => '?').join(',')})`;
      this.db.run(sql, propValues, (err) => {
        if (err) {
          console.log(
            `Error creating data in ${tableName}`,
            err,
            sql,
            propValues
          );
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async read(
    tableName: string,
    filterProperties: Record<string, string | number | boolean> = {}
  ): Promise<Record<string, string | boolean | number>[]> {
    return new Promise((resolve, reject) => {
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
      this.db.all(sql, [], (err, result) => {
        if (err) {
          console.log(`Error fetchng data from ${tableName}`, err, sql);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async update(
    tableName: string,
    properties: Record<string, string | number | boolean>
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const values = Object.entries(properties).map(([propName, propValue]) => {
        return `${propName} = ${
          typeof propValue === 'string' ? `"${propValue}"` : propValue
        }`;
      });
      const sql = `UPDATE ${tableName} SET ${values.join(
        ','
      )} WHERE ${values.join(' AND ')}`;

      this.db.run(sql, [], (err) => {
        if (err) {
          console.log(`Error updating data in ${tableName}`, err, sql);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async delete() {}
}
