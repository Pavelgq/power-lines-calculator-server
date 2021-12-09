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
      const {login, password, role} = req.body;

      
      const candidate = await db.query(`SELECT * FROM Administrator WHERE login = '${login}'`);
      console.log(candidate);
      if (candidate.rowCount) {
        return res.status(400).json({message: 'Пользователь с таким логином существует'});
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      const payload = {
        login,
        password: hashPassword
      }
      const token = jwt.sign(payload, jwtsecret);

      const newAdministrator = await db.query(`INSERT INTO Administrator (login, password, role) values ('${login}','${hashPassword}','${role}')`);
      return res.json({token, message: "Пользователь успешно зарегистрирован"});
    } catch (error) {
      console.log("admin create", error)
    }
  }
  
  async loginAdministrator (req, res) {
    console.log('dsfsfs ')
    try {
      const {login, password} = req.body;

      const candidate = await db.query(`SELECT * FROM Administrator WHERE login = '${login}'`);
      console.log(candidate);
      if (!candidate.rowCount) {
        return res.status(400).json({message: 'Пользователя с таким логином не существует'});
      }

      const user = candidate.rows[0];

      const match = await bcrypt.compare(password, user.password);
      console.log(password, user.password)
      if (match) {
        const payload = {
          login: user.login,
          password: user.password
        };
        const token = jwt.sign(payload, jwtsecret);
        return res.json({ 
          role: user.role, 
          user: user.login,
          token: 'JWT ' + token
        });
      } else {
        return res.status(400).json({message: 'Неверный пароль'});
      }
      
    } catch (error) {
      console.log('admin login: ', error);
    }
  }

  async getAdministrator (req, res) {

  }

  async changeAdministrator (req, res) {

  }

  async deleteAdministrator (req, res) {

  }
}

module.exports = AdministratorController;