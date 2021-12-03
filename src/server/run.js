const express = require('express');
const cors = require('cors');
const logger = require('../utils/logger');

const pool = require('./db');

const userRoutes = require(`../fields/user/user.routes`);

const app = express();

app.use(express.static(`static`));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors());

app.use(`/api/v1/user`, userRoutes);

app.get('/', (req, res) => {
  res.send('HELLO + WORLD')
})

const PORT = process.env.PORT || 8080;

module.exports = {
  run() {
    app.listen(PORT, () => {
      logger.info(`Server running at ${PORT}/`);
    });
  },
  app
};