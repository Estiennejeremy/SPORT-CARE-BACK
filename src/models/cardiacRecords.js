const mongoose = require("mongoose");
//require('mongoose-double')(mongoose);
mongoose.set("debug", true);

const cardiacSchema = new mongoose.Schema({
  dailyReportId: {
    type: String,
    required: true,
    default: 0,
  },
  rmssd: {
    type: Number,
    min: 1,
    max: 150,
    required: false,
    default: null,
  },
  heartRate: {
    type: Number,
    min: 30,
    max: 200,
    required: false,
    default: null,
  },
  hrData: {
    type: [Number],
    required: false,
    default: null,
  },
  currentStatus: {
    type: [Number],
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("cardiacRecords", cardiacSchema);
