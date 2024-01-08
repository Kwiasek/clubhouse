const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  fname: { type: String, required: true, minLength: 2, maxLength: 10 },
  lname: { type: String, required: true, minLength: 2, maxLength: 15 },
  username: { type: String, required: true, minLength: 3, maxLength: 15 },
  password: { type: String, required: true, minLength: 6, maxLength: 30 },
});

module.exports = mongoose.model("user", User);
