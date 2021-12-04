const {
  Router
} = require(`express`);
const logger = require('../../utils/logger');

const pool = require('../../server/db');

const userRouter = new Router();

userRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  res.header('Access-Control-Allow-Credentials', 'true')

  next();
});

/**
 * Show all users
 */
userRouter.get('/all', async (req, res) => {
  try {
    const result = await pool.query('select * from users;');
    res.json(result.rows);
  }
  catch (error) {
    logger.info('error:', error)
  }
});

/**
 * Add userdata
 */
userRouter.post('/add', async (req, res) => {
  try {
    const { id, first_name, last_name, company, accept_code } = req.body;
    await pool.query(`INSERT INTO users (first_name, last_name, company, accept_code) VALUES ('${first_name}','${last_name}','${company}','${accept_code}');`);
    res.send('success');
  }
  catch (error) {
    logger.info('error:', error)
  }
});

/**
 * Check accept code
 */
userRouter.post('/check', async (req, res) => {
  try {
    const { accept_code } = req.body;
    const result = await pool.query(`select *, accept_code from users where accept_code = '${accept_code}';`);
    res.json(result.rows);
    res.send('success');
  }
  catch (error) {
    logger.info('error:', error)
  }
});

module.exports = userRouter;