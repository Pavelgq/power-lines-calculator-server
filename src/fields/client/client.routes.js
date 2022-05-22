const { Router } = require(`express`);
const logger = require("../../utils/logger");

const pool = require("../../server/db");
const { authenticateToken } = require("../../server/security");
const ClientController = require("./client.controller");

const clientRouter = new Router();

const controller = new ClientController();

clientRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(
    `Access-Control-Allow-Headers`,
    `Origin, X-Requested-With, Content-Type, Accept`
  );
  res.header("Access-Control-Allow-Credentials", "true");

  next();
});

clientRouter.post("/create", authenticateToken, controller.createUser);
clientRouter.get("/all", authenticateToken, controller.getUsers);
clientRouter.get("/:id", authenticateToken, controller.getOneUser);
clientRouter.put("/:id", authenticateToken, controller.updateUser);
clientRouter.delete("/:id", authenticateToken, controller.deleteUser);
clientRouter.post("/request/add", controller.createRequest);
clientRouter.put("/request/:id", authenticateToken, controller.acceptRequest);
clientRouter.delete(
  "/request/:id",
  authenticateToken,
  controller.rejectRequest
);

module.exports = clientRouter;
