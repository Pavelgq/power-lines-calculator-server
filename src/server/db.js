const Pool = require("pg").Pool;

let dbConfig;
console.log(process.env.DEV_MODE);
if (process.env.DEV_MODE) {
  dbConfig = require("../config/db-config");
} else {
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const pool = new Pool(dbConfig);

module.exports = pool;
