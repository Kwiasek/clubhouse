const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  fname: { type: String, required: true, minLength: 2 },
  lname: { type: String, required: true, minLength: 2 },
  username: { type: String, required: true, minLength: 3 },
  password: { type: String, required: true, minLength: 6 },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("user", User);
