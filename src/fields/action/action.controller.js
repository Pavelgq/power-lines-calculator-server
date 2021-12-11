const fs = require("fs");
// const path = require("path");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const db = require("../../server/db");
const { generateKey, checkKey } = require("../../utils/accept-utils");

const path = "./data/calc-data";

class ActionControllers {
  async createNewAction(req, res) {
    try {
      const { client_id, type, data } = req.body;
      console.log(req.body);
      let dataPath = "";
      if (data) {
        dataPath = `${path}/${client_id}-${Date.now()}.json`;
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

  async getClientActions(req, res) {}

  async getAllActions(req, res) {}

  async authorizeAction(req, res) {}
}

module.exports = ActionControllers;
