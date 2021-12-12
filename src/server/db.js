const Pool = require("pg").Pool;

let dbConfig;
console.log(process.env.DEV_MODE);
if (process.env.DEV_MODE) {
  console.log("local");
  dbConfig = {
    host: "localhost",
    port: 5432,
    database: "newdatabase",
    user: "pavelgordeev",
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
