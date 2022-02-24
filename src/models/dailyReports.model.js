const mongoose = require("mongoose");
var Schema = mongoose.Schema;

//require('mongoose-double')(mongoose);
mongoose.set("debug", true);

const reportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 0,
  },
  cardiacRecordId: { type: Schema.Types.ObjectId, ref: "cardiacRecords" },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dailyFeelings: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
    default: 1,
  },
  size: {
    type: Number,
    required: false,
    default: null,
  },
  weight: {
    type: Number,
    required: false,
    default: null,
  },
  rmssd: {
    type: Number,
    required: false,
    default: null,
  },
  mhr: {
    type: Number,
    required: false,
    default: null,
  },
  bmi: {
    type: Number,
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("dailyReports", reportSchema);
