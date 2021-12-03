const Pool = require('pg').Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  const client = await pool.connect()
  try {
    const res = await pool.query(`select * from users`);
    console.log(res.rows[0])
  } finally {
    client.release()
  }
})().catch(e => console.log(e.stack))


module.exports = pool;