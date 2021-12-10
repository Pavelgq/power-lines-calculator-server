const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../server/db');
require('dotenv').config();

const jwtsecret = process.env.JWTSECRET

class AdministratorController {
  /**
   * Создает нового администратора в бахе данных (доступ только у администратора)
   * @param {*} req 
   * @param {*} res 
   */
  async createAdministrator (req, res) {
    try {
      const {login, password, status} = req.body;

      
      const candidate = await db.query(`SELECT * FROM Administrator WHERE login = '${login}'`);
      if (candidate.rowCount) {
        return res.status(400).json({message: 'Пользователь с таким логином существует'});
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      const payload = {
        login,
        password: hashPassword
      }
      const token = jwt.sign(payload, jwtsecret);

      const newAdministrator = await db.query(`INSERT INTO Administrator (login, password, status) values ('${login}','${hashPassword}','${status}')`);
      return res.json({token, message: "Пользователь успешно зарегистрирован"});
    } catch (error) {
      console.error("admin create", error)
    }
  }
  
  async loginAdministrator (req, res) {
    try {
      const {login, password} = req.body;
      if (!password) {
        return res.status(400).json({message: 'Неверный пароль'});
      }

      const candidate = await db.query(`SELECT * FROM administrator WHERE login = '${login}'`);
      if (!candidate.rowCount) {
        return res.status(400).json({message: 'Пользователя с таким логином не существует'});
      }

      const user = candidate.rows[0];

      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return res.status(400).json({message: 'Неверный пароль'});
      }

      const payload = {
          login: user.login,
          password: user.password
        };
      const token = jwt.sign(payload, jwtsecret);
      return res.json({ 
        id: user.id,
        status: user.status, 
        user: user.login,
        token: 'JWT ' + token
      });
      
    } catch (error) {
      console.log('admin login: ', error);
    }
  }

  async getAdministrator (req, res) {
    try {
      const adminId = req.params.id;
      if (!adminId) {
        return res.status(404).json({message: 'Такого id не существует'}); 
      }
      const candidate = await db.query(`SELECT * FROM administrator WHERE id = '${adminId}'`);
      if (!candidate.rowCount) {
        return res.status(400).json({message: 'Пользователя с таким id не существует'});
      }
      const {password, ...params} = candidate.rows[0];
      return res.json(params)

    } catch (error) {
      console.error('admin get: ', error);
    }
  }

  async changeAdministrator (req, res) {
    try {
      const adminId = req.params.id;
      const newData = req.body;
      if (!adminId) {
        return res.status(404).json({message: 'Такого id не существует'}); 
      }
      const candidate = await db.query(`SELECT * FROM administrator WHERE id = '${adminId}'`);
      if (!candidate.rowCount) {
        return res.status(400).json({message: 'Пользователя с таким id не существует'});
      }
      const newLogin = newData.login || candidate.rows[0].login;
      const newStatus = newData.status || candidate.rows[0].status;

      const changeData = await db.query(`UPDATE administrator SET login = '${newLogin}', status = '${newStatus}' WHERE id = '${adminId}';`)
      return res.json({...changeData.rows[0], message: "Пользователь успешно изменен"});

    } catch (error) {
      console.error('admin put: ', error);
    }

  }

  async deleteAdministrator (req, res) {

  }
}

module.exports = AdministratorController;