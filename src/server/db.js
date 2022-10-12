const Pool = require("pg").Pool;

let dbConfig;
console.log("Mode", process.env.NODE_ENV);
if (process.env.NODE_ENV == "development") {
  console.log("Local database is used");
  dbConfig = {
    host: "localhost",
    port: 5432,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DB_PASSWORD,
  };
} else {
  console.log("Used database on heroku server");
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const pool = new Pool(dbConfig);

module.exports = pool;
