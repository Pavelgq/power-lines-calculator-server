const { Router } = require(`express`);
const logger = require("../../utils/logger");

const { authenticateToken, checkClientKey } = require("../../server/security");

const AcceptController = require("../accept/accept.controller");

const acceptRouter = new Router();

const controller = new AcceptController();

acceptRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(
    `Access-Control-Allow-Headers`,
    `Origin, X-Requested-With, Content-Type, Accept`
  );
  res.header("Access-Control-Allow-Credentials", "true");

  next();
});

acceptRouter.get("/profile", checkClientKey, controller.profileKeyAccept);
acceptRouter.get("/check/:key", controller.checkKeyAccept);
acceptRouter.post("/:id", authenticateToken, controller.createKeyAccept);
acceptRouter.get("/:id", authenticateToken, controller.getKeyAccept);
acceptRouter.put("/:id", authenticateToken, controller.changeKeyAccept);
acceptRouter.delete("/:id", authenticateToken, controller.deleteKeyAccept);

module.exports = acceptRouter;
