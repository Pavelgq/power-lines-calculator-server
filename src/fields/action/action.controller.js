const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const db = require("../../server/db");
const { generateKey, checkKey } = require("../../utils/accept-utils");

class ActionControllers {
  async createNewAction(req, res) {
    try {
      const { client_id, type, data, project_name } = req.body;
      const { accept_key } = req;
      console.log(client_id, type, data, project_name);
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
      }
      const result = await db.query(
        `INSERT INTO action (client_id, type, path_to_data, accept_key, project_name) VALUES ('${client_id}', '${type}', '${dataPath}', '${accept_key}', '${project_name}') RETURNING *;`
      );

      return res.json({
        data: result.rows[0],
        message: "Действие пользователя сохранено",
      });
    } catch (error) {
      logger.error("action add: ", error);
      return res.status(400).json({ error });
    }
  }

  async getAllActions(req, res) {
    try {
      const clientId = req.query.client_id || -1;
      let actions = {};

      if (clientId !== -1) {
        actions = await db.query(
          `SELECT * FROM action WHERE client_id = ${clientId};`
        );
      } else {
        actions = await db.query(`SELECT * FROM action;`);
      }
      const data = actions.rows;
      const page = req.query.page || 1;
      const limit = req.query.limit || data.length;
      const startIndex = page * limit;
      const endIndex = page * limit + limit;
      const length = data.length;
      const result = { data: data.slice(startIndex, endIndex) };
      result.total_items = length;
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
      const startIndex = page * limit;
      const endIndex = page * limit + limit;
      const actions = await db.query(
        `SELECT * FROM action WHERE client_id = '${clientId}';`
      );
      const data = actions.rows;
      const length = data.length;
      const result = { data: data.slice(startIndex, endIndex) };
      result.total_items = length;
      res.status(200).json(result);
    } catch (error) {
      logger.error("action get one: ", error);
      return res.status(400).json({ error });
    }
  }

  async getSaveFile(req, res, next) {
    try {
      let options = {
        root: path.join(__dirname, "../../../data/calc-data"),
        dotfiles: "deny",
        headers: {
          "x-timestamp": Date.now(),
          "x-sent": true,
        },
      };
      let fileName = req.params.name;
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log("Sent:", fileName);
        }
      });
    } catch (error) {
      logger.error("action safe file: ", error);
      return res.status(400).json({ error });
    }
  }
  async authorizeAction(req, res) {}
}

module.exports = ActionControllers;
