const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const cors = require("cors");
const logger = require("../utils/logger");
require("dotenv").config();

const pool = require("./db");

const clientRouter = require(`../fields/client/client.routes`);
const administratorRoutes = require(`../fields/administrator/administrator.routes`);
const acceptRoutes = require(`../fields/accept/accept.routes`);
const actionRoutes = require(`../fields/action/action.routes`);

var options = {
  key: fs.readFileSync("./src/config/cert.pem"),
  cert: fs.readFileSync("./src/config/cert.pem"),
};

const app = express();

app.use(express.static(`static`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(`/api/v1/client`, clientRouter);
app.use(`/api/v1/admin`, administratorRoutes);
app.use(`/api/v1/accept`, acceptRoutes);
app.use(`/api/v1/action`, actionRoutes);

app.get("/", async (req, res) => {
  const connect = await pool.query("SELECT * from administrator");
  console.log(connect);
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
    // if (process.env.NODE_ENV === "developer") {
    app.listen(PORT, () => {
      logger.info(`Http server running at ${PORT}`);
    });
    // } else {
    //   https.createServer(options, app).listen(PORT, function () {
    //     console.log(`Https server running at ${PORT}`);
    //   });
    // }
  },
  app,
};
