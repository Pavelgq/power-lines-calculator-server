const logger = require("../../utils/logger");
const db = require("../../server/db");
const { checkAccept } = require("../../utils/other");
const { all } = require("express/lib/application");

class ClientController {
  async createUser(req, res) {
    try {
      const {
        first_name,
        last_name,
        company,
        office_position,
        phone_number,
        email,
      } = req.body;

      const result = await db.query(
        `INSERT INTO client (first_name, last_name, company, office_position, phone_number, email) VALUES ('${first_name}','${last_name}','${company}','${office_position}','${phone_number}','${email}') RETURNING *;`
      );

      res.json({
        data: result.rows[0],
        message: "Пользователь успешно создан",
      });
    } catch (error) {
      logger.error("client create:", error);
      return res.status(400).json({ error });
    }
  }
  async getUsers(req, res) {
    try {
      const allUsers = await db.query(
        `SELECT client.*, accept.client_key, accept.update, accept.valid_until, ROW_NUMBER () OVER (ORDER BY client.creation_date) as ordinal FROM client LEFT JOIN accept ON accept.client_id = client.id;`
      );
      console.log(allUsers);
      const result = allUsers.rows.map((u) => {
        if (checkAccept(u.valid_until)) {
          u.isAccept = true;
        } else {
          u.isAccept = false;
        }

        return u;
      });
      return res.json(result);
    } catch (error) {
      logger.error("client get all:", error);
      return res.status(400).json({ error });
    }
  }

  async getOneUser(req, res) {
    try {
      const clientId = req.params.id;
      const client = await db.query(
        `SELECT client.*, accept.client_key, accept.update, accept.valid_until FROM client LEFT JOIN accept ON accept.client_id = client.id WHERE id = '${clientId}'`
      );
      if (!client.rowCount) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      return res.json(client.rows[0]);
    } catch (error) {
      logger.error("client get one:", error);
      return res.status(400).json({ error });
    }
  }
  async updateUser(req, res) {
    try {
      const clientId = req.params.id;
      const clientData = await db.query(
        `SELECT * FROM client WHERE id = '${clientId}'`
      );
      if (!clientData.rowCount) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      const newClientData = req.body;

      const payload = { ...clientData, ...newClientData };

      await db.query(
        `UPDATE client SET first_name = '${payload.first_name}', last_name = '${payload.last_name}', company = '${payload.company}', office_position = '${payload.office_position}', phone_number = '${payload.phone_number}', email = '${payload.email}' WHERE id = '${clientId}';`
      );
      return res.json({ message: "Данные пользователя изменены успешно" });
    } catch (error) {
      logger.error("client update:", error);
      return res.status(400).json({ error });
    }
  }
  async deleteUser(req, res) {
    try {
      const clientId = req.params.id;
      const clientKey = await db.query(
        `SELECT * FROM accept WHERE client_id = '${clientId}'`
      );
      if (clientKey.rowCount) {
        await db.query(`DELETE FROM accept WHERE client_id = '${clientId}'`);
      }
      const clientData = await db.query(
        `SELECT * FROM client WHERE id = '${clientId}'`
      );
      if (!clientData.rowCount) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      await db.query(`DELETE FROM client WHERE id = '${clientId}'`);
      return res.json({ message: "Пользователь успешно удален" });
    } catch (error) {
      logger.error("client delete:", error);
      return res.status(400).json({ error });
    }
  }

  async createRequest(req, res) {
    try {
      const {
        first_name,
        last_name,
        company,
        office_position,
        phone_number,
        email,
      } = req.body;

      const result = await db.query(
        `INSERT INTO client (first_name, last_name, company, office_position, phone_number, email, request) VALUES ('${first_name}','${last_name}','${company}','${office_position}','${phone_number}','${email}', 'true') RETURNING *;`
      );

      res.json({
        data: result.rows[0],
        message: "Запрос успешно создан",
      });
    } catch (error) {
      logger.error("client request create:", error);
      return res.status(400).json({ error });
    }
  }

  async acceptRequest(req, res) {
    try {
      const clientId = req.params.id;
      const clientData = await db.query(
        `SELECT * FROM client WHERE id = '${clientId}'`
      );
      if (!clientData.rowCount) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      console.log(clientData);
      await db.query(
        `UPDATE client SET request = 'false' WHERE id = '${clientId}';`
      );
      return res.json({ message: "Запрос успешно принят" });
    } catch (error) {
      logger.error("client request accept:", error);
      return res.status(400).json({ error });
    }
  }

  async rejectRequest(req, res) {
    try {
      deleteUser(req, res);
    } catch (error) {
      logger.error("client request delete:", error);
      return res.status(400).json({ error });
    }
  }
}

module.exports = ClientController;
