const logger = require("../../utils/logger");
const db = require("../../server/db");

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

      await db.query(
        `INSERT INTO client (first_name, last_name, company, office_position, phone_number, email) VALUES ('${first_name}','${last_name}','${company}','${office_position}','${phone_number}','${email}');`
      );
      res.json({ message: "Пользователь успешно создан" });
    } catch (error) {
      logger.error("client create:", error);
    }
  }
  async getUsers(req, res) {
    try {
      const allUsers = await db.query(`SELECT * FROM client`);
      return res.json(allUsers.rows);
    } catch (error) {
      logger.error("client get all:", error);
    }
  }
  async getOneUser(req, res) {
    try {
      const clientId = req.params.id;
      const client = await db.query(
        `SELECT * FROM client WHERE id = '${clientId}'`
      );
      if (!client.rowCount) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      return res.json(client.rows[0]);
    } catch (error) {
      logger.error("client get one:", error);
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
      const newUserData = req.body;

      const payload = { ...clientData, ...newUserData };

      await db.query(
        `UPDATE client SET first_name = '${payload.first_name}', last_name = '${payload.last_name}', company = '${payload.company}', office_position = '${payload.office_position}', phone_number = '${payload.phone_number}', email = '${payload.email}' WHERE id = '${clientId}';`
      );
      return res.json({ message: "Данные пользователя изменены успешно" });
    } catch (error) {
      logger.error("client update:", error);
    }
  }
  async deleteUser(req, res) {
    try {
      const clientId = req.params.id;
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
    }
  }
}

module.exports = ClientController;
