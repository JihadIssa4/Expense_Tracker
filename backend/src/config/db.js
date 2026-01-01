const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./expenses.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.run("PRAGMA foreign_keys = ON;", (err) => {
  if (err) {
    console.error("Failed to enable foreign keys", err);
  }
});

module.exports = db;
