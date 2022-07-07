const Pool = require("pg").Pool;

let dbConfig;
if (process.env.DEV_MODE == 1) {
  console.log("local");
  dbConfig = {
    host: "localhost",
    port: 5432,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DB_PASSWORD,
  };
} else {
  console.log("heroku");
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const pool = new Pool(dbConfig);

module.exports = pool;
