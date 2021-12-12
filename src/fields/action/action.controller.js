const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const db = require("../../server/db");
const { generateKey, checkKey } = require("../../utils/accept-utils");

class ActionControllers {
  async createNewAction(req, res) {
    try {
      const { client_id, type, data } = req.body;
      console.log(req.body);
      let dataPath = "";
      if (data) {
        dataPath = `${client_id}-${Date.now()}.json`;
        console.log(dataPath);
        await fs.writeFile(
          dataPath,
          JSON.stringify(data),
          function (err, result) {
            if (err) console.log("error", err);
          }
        );

        await db.query(
          `INSERT INTO action (client_id, type, path_to_data) VALUES ('${client_id}', '${type}', '${dataPath}');`
        );

        return res.json({ message: "Действие пользователя сохранено" });
      }
    } catch (error) {
      logger.error("action add: ", error);
      return res.status(400).json({ error });
    }
  }

  async getAllActions(req, res) {
    try {
      const page = req.query.page;
      const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const actions = await db.query(`SELECT * FROM action;`);
      const data = actions.rows;
      const result = data.slice(startIndex, endIndex);
      res.status(200).json(result);
    } catch (error) {
      logger.error("action get all: ", error);
      return res.status(400).json({ error });
    }
  }

  async getClientActions(req, res) {
    try {
      const clientId = req.params.id;
      const page = req.query.page;
      const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const actions = await db.query(
        `SELECT * FROM action WHERE client_id = '${clientId}';`
      );
      const data = actions.rows;
      const result = data.slice(startIndex, endIndex);
      res.status(200).json(result);
    } catch (error) {
      logger.error("action get one: ", error);
      return res.status(400).json({ error });
    }
  }

  async getSaveFile(req, res, next) {
    console.log("afsdfdsa");
    var options = {
      root: path.join(__dirname, "../../../data/calc-data"),
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };
    console.log(options);
    var fileName = req.params.name;
    console.log(fileName);
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent:", fileName);
      }
    });
  }

  async authorizeAction(req, res) {}
}

module.exports = ActionControllers;
