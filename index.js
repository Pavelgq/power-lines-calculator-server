const app = require('./src/server/run');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('Server started on port:', PORT);
})