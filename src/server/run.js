const express = require("express");
const cors = require("cors");
const logger = require("../utils/logger");
require("dotenv").config();

const pool = require("./db");

const clientRouter = require(`../fields/client/client.routes`);
const administratorRoutes = require(`../fields/administrator/administrator.routes`);
const acceptRoutes = require(`../fields/accept/accept.routes`);
const actionRoutes = require(`../fields/action/action.routes`);

const app = express();

app.use(express.static(`static`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(`/api/v1/client`, clientRouter);
app.use(`/api/v1/admin`, administratorRoutes);
app.use(`/api/v1/accept`, acceptRoutes);
app.use(`/api/v1/action`, actionRoutes);

app.get("/", (req, res) => {
  res.send("Power Lines Calculators Server");
});

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

const PORT = process.env.PORT || 8080;

module.exports = {
  run() {
    app.listen(PORT, () => {
      logger.info(`Server running at ${PORT}/`);
    });
  },
  app,
};

// TODO: Везде добавить сообщение ответ при ошибке
