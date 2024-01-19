const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    return mongoose
      .connect(process.env.CONSTRING)
      .then(() => {
        console.log("Database Connected successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = new Database();
