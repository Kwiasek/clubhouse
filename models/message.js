const mongoose = require("mongoose");
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
    default: new Date.now(),
  },
});
