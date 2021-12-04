const Pool = require('pg').Pool;

const dbConfig = require('../config/db-config')

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

const pool = new Pool(dbConfig);

// (async () => {
//   const client = await pool.connect()
//   try {
//     const res = await pool.query(`select * from users`);
//     console.log(res.rows[0])
//   } finally {
//     client.release()
//   }
// })().catch(e => console.log(e.stack))


module.exports = pool;