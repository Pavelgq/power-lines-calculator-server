const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["token"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_ADMIN_SECRET, (err, user) => {
    if (err) {
      logger.error(err);
      return res.sendStatus(403);
    }
    console.log("check token:", user);
    req.user = user;
    next();
  });
}

function checkClientKey(req, res, next) {
  const clientTokenHeader = req.headers["accept-token"];
  if (!clientTokenHeader) {
    return res.sendStatus(401);
  }

  jwt.verify(
    clientTokenHeader,
    process.env.JWT_CLIENT_SECRET,
    (err, accept_key) => {
      if (err) {
        logger.error(err);
        return res.sendStatus(403);
      }
      console.log("check accept:", accept_key);
      req.accept_key = accept_key;

      next();
    }
  );
}

//TODO: Проверка после парсинга ключа на совпадение с ключами в базе

module.exports = {
  authenticateToken,
  checkClientKey,
};
