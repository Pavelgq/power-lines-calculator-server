export class UserController {

  async createUser(res, req) {
    try {
      //проверка токена
      const { first_name, last_name, company, accept_code } = req.body;
      await pool.query(`INSERT INTO users (first_name, last_name, company, accept_code) VALUES ('${first_name}','${last_name}','${company}','${accept_code}');`);
      res.send('success');
    }
    catch (error) {
      logger.info('error:', error)
    }
  };
  async getUsers(res, req) {

  };
  async getOneUser(res, req) {

  };
  async updateUser(res, req) {

  };
  async deleteUser(res, req) {

  };
  

}