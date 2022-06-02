const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const db = require("../../server/db");
const { generateKey, checkKeyDate } = require("../../utils/accept-utils");
const { checkAccept } = require("../../utils/other");

const jwtsecret = process.env.JWT_CLIENT_SECRET;

class AcceptController {
  async checkKeyAccept(req, res) {
    try {
      const key = req.params.key;

      const keys = await db.query(
        `SELECT * FROM accept WHERE client_key = '${key}'`
      );
      if (!keys.rowCount) {
        return res.json({ message: "Ключ не действителен" });
      }
      if (!checkAccept(keys.rows[0].valid_until)) {
        await db.query(
          `UPDATE client SET request = 'true' WHERE id = '${keys.rows[0].client_id}';`
        );
        return res.json({
          message:
            'Срок действия ключа закончен. С вами свяжется сотрудник и выдаст новый. Если ваши контактные данные изменились, заполните форму "получить код активации".',
        });
      }

      const payload = {
        key,
        clientId: keys.rows[0].client_id,
      };
      const token = jwt.sign(payload, jwtsecret);
      return res.json({ acceptToken: token, id: keys.rows[0].client_id });
    } catch (error) {
      logger.error("accept check: ", error);
      return res.status(400).json({ error });
    }
  }

  async createKeyAccept(req, res) {
    try {
      const clientId = req.params.id;
      const { validDate } = req.body;

      const client = await db.query(
        `SELECT * FROM client WHERE id = '${clientId}'`
      );
      if (!client.rowCount) {
        return res.json({ message: "Пользователя с таким id не существует" });
      }
      const key = await db.query(
        `SELECT * FROM accept WHERE client_id = '${clientId}'`
      );
      if (key.rowCount && checkKeyDate(key.rows[0].valid_until)) {
        return res.json({ message: "У пользователя уже есть ключ" });
      }
      const newKey = generateKey(validDate, clientId);
      if (!key.rowCount) {
        await db.query(
          `INSERT INTO accept (client_id, client_key, valid_until) values ('${clientId}', '${newKey}', '${validDate}');`
        );
      } else {
        await db.query(
          `UPDATE accept SET client_key = '${newKey}', valid_until = '${validDate}', update = now() WHERE client_id = '${clientId}';`
        );
      }

      return res.json({
        key: newKey,
        message: `Новый ключ для ${client.rows[0].first_name} ${client.rows[0].last_name} добавлен в базу`,
      });
    } catch (error) {
      logger.error("accept add: ", error);
      return res.status(400).json({ error });
    }
  }

  async getKeyAccept(req, res) {
    try {
      const clientId = req.params.id;
      const client = await db.query(
        `SELECT * FROM accept WHERE client_id = '${clientId}'`
      );
      if (!client.rowCount) {
        return res.json({ message: "Пользователя с таким id не существует" });
      }
      return res.json({ key: client.rows[0].client_key });
    } catch (error) {
      logger.error("accept get: ", error);
      return res.status(400).json({ error });
    }
  }

  async changeKeyAccept(req, res) {
    try {
      const clientId = req.params.id;
      const { validDate } = req.body;
      const clientData = await db.query(
        `SELECT * FROM accept WHERE client_id = '${clientId}'`
      );

      if (!clientData.rowCount) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      const newKey = generateKey(validDate);

      await db.query(
        `UPDATE accept SET client_key = '${newKey}', valid_until = '${validDate}', update = now() WHERE client_id = '${clientId}';`
      );
      return res.json({ message: "Ключ успешно изменен" });
    } catch (error) {
      logger.error("accept change: ", error);
      return res.status(400).json({ error });
    }
  }

  async deleteKeyAccept(req, res) {
    try {
      const clientId = req.params.id;
      const acceptData = await db.query(
        `SELECT * FROM accept WHERE client_id = '${clientId}'`
      );
      if (!acceptData.rowCount) {
        return res.status(400).json({ message: "Ключ не найден" });
      }
      await db.query(`DELETE FROM accept WHERE client_id = '${clientId}'`);
      return res.json({ message: "Ключ успешно удален" });
    } catch (error) {
      logger.error("accept delete: ", error);
      return res.status(400).json({ error });
    }
  }
}

module.exports = AcceptController;
