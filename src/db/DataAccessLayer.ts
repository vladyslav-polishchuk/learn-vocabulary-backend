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
      const sqlTemplate = `INSERT INTO ${tableName}(${propNames.join(
        ','
      )}) VALUES (${propNames.map(() => '?').join(',')})`;
      this.db.run(sqlTemplate, propValues, (err) => {
        if (err) {
          console.log(`Error fetchng data from ${tableName}`, err);
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
      const criteriaList = Object.entries(filterProperties).map(
        ([criteriaName, criteriaValue]) => {
          const typedCriteriaValue =
            typeof criteriaValue === 'string'
              ? `'${criteriaValue}'`
              : criteriaValue;

          return `${criteriaName} = ${typedCriteriaValue}`;
        }
      );
      const filterCriteria = `WHERE ${criteriaList.join('AND')}`;

      this.db.all(
        `SELECT * from ${tableName} ${filterCriteria}`,
        [],
        (err, result) => {
          if (err) {
            console.log(`Error fetchng data from ${tableName}`, err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  async update() {}

  async delete() {}
}
