const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const db = require("../../server/db");
const { generateKey, checkKey } = require("../../utils/accept-utils");
const { query } = require("../../utils/logger");
const moment = require("moment");
const generateDocx = require("../../server/doc");

const { groupByPeriod } = require("../../utils/filters");

const fields = {
  id: "number",
  client_id: "number",
  project_name: "string",
  type: "string",
  date: "number",
  path_to_data: "string",
  accept_key: "string",
  program_type: "string",
  params: "string",
};

const period = 1 * 60 * 60 * 1000;
class ActionControllers {
  async createNewAction(req, res) {
    try {
      const { type, data, project_name, program_type, params } = req.body;
      const { accept_key, client_id } = req;
      let dataPath = "";
      if (data) {
        dataPath = `${client_id}-${Date.now()}.json`;

        await fs.writeFile(
          path.join(__dirname, `../../../data/calc-data/${dataPath}`),
          JSON.stringify(data),
          function (err, result) {
            if (err) console.log("error", err);
          }
        );
      }
      const lastActionQuery = `SELECT * FROM action WHERE client_id=${client_id} and program_type=${program_type} and group_id=0 ORDER BY date DESC LIMIT 1`;
      const lastActionResult = await db.query(lastActionQuery);
      let lastActionId = 0;
      if (lastActionResult.rowCount) {
        if (moment().isSame(lastActionResult.rows[0].date, "day")) {
          if (lastActionResult.rows[0].group_id) {
            lastActionId = lastActionResult.rows[0].group_id;
          } else {
            lastActionId = lastActionResult.rows[0].id;
          }
        }
      }

      const queryString = `INSERT INTO action (client_id, type, path_to_data, accept_key, project_name, program_type, params, group_id) VALUES ('${client_id}', '${type}', '${dataPath}', '${accept_key}', '${project_name}', '${program_type}', '${JSON.stringify(
        params
      )}', '${lastActionId}') RETURNING *;`;

      console.log(queryString);

      const result = await db.query(queryString);

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
      const filters = req.query.filter || {};
      const sorting = req.query.sort || { date: "DESC" };
      // const searchValue = req.query.search || "";
      const timeFilter = req.query.period;

      let queryPeriod;
      switch (timeFilter) {
        case "all":
          queryPeriod = `date <= now()`;
          break;
        case "year":
          queryPeriod = `date <= now() AND date > now()-interval '1 year'`;
          break;
        case "quarter":
          queryPeriod = `date <= now() AND date > now()-interval '3 month'`;
          break;
        case "month":
          queryPeriod = `date <= now() AND date > now()-interval '1 month'`;
          break;
        case "week":
          queryPeriod = `date <= now() AND date > now()-interval '1 week'`;
          break;
        case "day":
          queryPeriod = `date <= now() AND date > now()-interval '1 day'`;
          break;

        default:
          break;
      }

      const clientId = filters.client_id || -1;
      delete filters.client_id;
      const programType = filters.program_type != 0 ? filters.program_type : -1;
      delete filters.program_type;
      let actions = {};

      const page = req.query.page || 1;
      const limit = req.query.limit;
      const offset = page * limit;
      let maxCount;

      const whereString = "WHERE";
      const andString = "AND";
      const orString = "OR";

      const mainFilters = [];
      if (clientId !== -1) {
        mainFilters.push(`client_id='${clientId}'`);
      }
      if (programType !== -1) {
        mainFilters.push(`program_type='${programType}'`);
      }
      mainFilters.push(`group_id=0`);

      const mainFiltersString = `${mainFilters.join(` ${andString} `)} ${
        mainFilters.length > 0 && Object.keys(filters).length > 0
          ? andString
          : ""
      }`;

      const conditionsFilter = Object.keys(filters)
        .map((f) => {
          if (fields[f] && fields[f] === "number") {
            return `${f} = '${filters[f]}'`;
          } else {
            return `${f} LIKE '%${filters[f]}%'`;
          }
        })
        .join(` ${orString} `);

      const newMainFilter = mainFiltersString
        ? `(${queryPeriod}) AND ${mainFiltersString}`
        : queryPeriod;

      const sortField = Object.keys(sorting)[0];

      const actionQuery = `SELECT * FROM action ${whereString} ${newMainFilter} (${conditionsFilter}) ORDER BY ${sortField} ${
        sorting[sortField]
      } LIMIT ${limit || "ALL"} OFFSET ${offset};`;
      console.log(actionQuery);
      actions = await db.query(actionQuery);
      maxCount = await db.query(
        `SELECT count(*) FROM action ${whereString} ${newMainFilter} (${conditionsFilter});`
      );
      const data = actions.rows;

      for (let i = 0; i < data.length; i++) {
        const groupQuery = `SELECT * FROM action WHERE group_id=${data[i].id} ORDER BY date`;
        const groupData = await db.query(groupQuery);
        data[i].group = groupData.rows;
      }

      const result = { data };
      result.total_items = maxCount.rows[0].count;
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

  async downloadTemplate(req, res, next) {
    try {
      const { data, template } = req.body;
      let pathStr;
      switch (template) {
        case 1:
          pathStr = "../../templates/pipe-template-all.docx";
          break;
        case 2:
          pathStr = "../../templates/pipe-template-all.docx";
          break;
        case 3:
          pathStr = "../../templates/pipe-template-all.docx";
          break;
        default:
          pathStr = "../../templates/pipe-template-all.docx";
          break;
      }

      await generateDocx(Object.freeze(data), pathStr);
      if (!data) {
        return res.status(400).json({ message: "Данные не корректны" });
      }
      let options = {
        root: path.join(__dirname, "../../../"),
        dotfiles: "deny",
        headers: {
          "x-timestamp": Date.now(),
          "x-sent": true,
        },
      };
      let fileName = "output.docx";

      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log("Sent:", fileName);
        }
      });
    } catch (error) {
      logger.error("client download template:", error);
      return res.status(400).json({ error });
    }
  }

  async authorizeAction(req, res) {}
}

module.exports = ActionControllers;
