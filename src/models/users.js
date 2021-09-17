const mongoose = require("mongoose");
mongoose.set("debug", true);

const userSchema = new mongoose.Schema({
  lastName: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  birthdate: {
    type: Date,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  role: {
    type: Boolean,
    required: true,
    default: false,
  },
  userDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  civility: {
    type: Number,
    min: 0,
    max: 1,
    required: false,
    default: 0,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  coachId: {
    type: String,
    required: false,
  },
  condition: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
