const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const Message = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  text: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 300,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

Message.virtual("date_short").get(function () {
  return DateTime.fromJSDate(this.date).toHTTP();
});

module.exports = mongoose.model("message", Message);
