const mongoose = require("mongoose");
const config = require("./config");
const DB_URI = config.DB_URI;
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(DB_URI, { useNewUrlParser: true, useCreateIndex: true })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch(err => {
        console.error("Database connection error");
      });
  }
}
module.exports = new Database();
