const { Router } = require(`express`);
const logger = require("../../utils/logger");

const { authenticateToken, checkClientKey } = require("../../server/security");

const ActionController = require("../action/action.controller");
const acceptRouter = require("../accept/accept.routes");

const actionRouter = new Router();

const controller = new ActionController();

actionRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(
    `Access-Control-Allow-Headers`,
    `Origin, X-Requested-With, Content-Type, Accept`
  );
  res.header("Access-Control-Allow-Credentials", "true");

  next();
});

actionRouter.post("/add", checkClientKey, controller.createNewAction);
actionRouter.get("/all", authenticateToken, controller.getAllActions);
actionRouter.get("/client/:id", checkClientKey, controller.getClientActions);
actionRouter.get("/file/:name", controller.getSaveFile);
actionRouter.post("/auth", checkClientKey, controller.authorizeAction);

module.exports = actionRouter;
