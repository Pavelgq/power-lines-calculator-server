const {
  Router
} = require(`express`);
const logger = require('../../utils/logger');

const userRouter = new Router();

userRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  res.header('Access-Control-Allow-Credentials', 'true')

  next();
});

/**
 * Show all user (id, firstName, lastName)
 */
userRouter.get('/all', async (req, res) => {
  try {
    const result = await runQuery('select id, firstName, lastName from users')
    res.json(result.recordset);
  }
  catch (error) {
    logger.info('error:', error)
  }
});

module.exports = userRouter;