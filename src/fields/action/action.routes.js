const {
  Router
} = require(`express`);
const logger = require('../../utils/logger');

const pool = require('../../server/db');

const actionRouter = new Router();

actionRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  res.header('Access-Control-Allow-Credentials', 'true')

  next();
});



module.exports = actionRouter;