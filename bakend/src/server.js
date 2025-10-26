const app = require('./app');
const initDatabase = require('./models/init');
const PORT = process.env.PORT;

initDatabase();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
