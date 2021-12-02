const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('HELLO + WORLD')
})


module.exports = app;