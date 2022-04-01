const cardiacModel = require("../models/cardiacRecords.model");
const reportModel = require("../models/dailyReports.model");
const IaClient = require("../services/ia-client");

var cardiacRecordsController = {
  index: async function (req, res) {
    return cardiacModel.find().populate("dailyReportId").exec();
  },
  show: async function (req, res) {
    return cardiacModel.findById(req.params.id).exec();
  },
  delete: async function (req, res) {
    return cardiacModel.findByIdAndRemove(req.params.id).exec();
  },
  create: async function (req, res) {
    const allRm = [];
    let status = null;
    const allModels = reportModel.find();
    const fiveLastRmssd = (await allModels)
      .filter((model) => model.rmssd)
      .slice(Math.max(allModels.length - 5, 0));
    rmssd = await IaClient.getRmssd(req.body.hrData);
    if (fiveLastRmssd.length >= 4) {
      for (const item of fiveLastRmssd) {
        allRm.push(item.rmssd);
      }

      console.log(rmssd.data.data)
      allRm.push(rmssd.data.data);
      status = await IaClient.getState(allRm);
    }
    const average = (await req.body.hrData).reduce(
      (acc, cur) => acc + cur.heartrate,
      0
    ) / req.body.hrData.length;
    console.log(average, "COUCOCUOCUCOCUUCOCU");

    let hrData = [];
    req.body.hrData.map((item) => {
      hrData.push(item.heartrate);
    })


    const cardiacRecord = new cardiacModel({
      dailyReportId: req.body.dailyReportId,
      rmssd: rmssd.data.data,
      heartRate: average,
      hrData: hrData,
      currentStatus: status.data,
    });
    return cardiacRecord.save();
  },
  update: async function (req, res) {
    return cardiacModel
      .findByIdAndUpdate(
        req.params.id,
        {
          dailyReportId: req.body.dailyReportId,
          rmssd: req.body.rmssd,
          heartRate: req.body.heartRate,
          hrData: req.body.hrData,
          currentStatus: req.body.status,
        },
        { new: true }
      )
      .exec();
  },
  getReportCardiacRecords: async function (req, res, next) {
    return cardiacModel.find({
      dailyReportId: req.params.id,
    });
  },
};

module.exports = cardiacRecordsController;
