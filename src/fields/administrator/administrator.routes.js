const {
  Router
} = require(`express`);
const logger = require('../../utils/logger');

const pool = require('../../server/db');
const authenticateToken = require('../../server/security');
const AdministratorController = require('../administrator/administrator.controller');

const administratorRouter = new Router();

const controller = new AdministratorController;

administratorRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  res.header('Access-Control-Allow-Credentials', 'true')

  next();
});

administratorRouter.post('/create', authenticateToken, controller.createAdministrator);

administratorRouter.post('/login', authenticateToken, controller.loginAdministrator);
administratorRouter.get('/:id', authenticateToken, controller.getAdministrator);
administratorRouter.put('/:id', authenticateToken, controller.changeAdministrator);
// administratorRouter.delete('/:id', authenticateToken, AdministratorController.deleteAdministrator);


module.exports = administratorRouter;