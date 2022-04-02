const reportModel = require("../models/dailyReports.model");
const { Double } = require("mongodb");

var dailyReportsController = {
  index: function (req, res) {
    return reportModel.find().populate("cardiacRecordId").exec();
  },
  show: function (req, res) {
    return reportModel
      .findById(req.params.id)
      .populate("dailyRecords")
      .populate("cardiacRecordId")
      .exec();
  },
  patch: async function (req, res) {
    report = await reportModel.findById(req.params.id);
    if (req.body.userId != null) {
      report.userId = req.body.userId;
    }
    if (req.body.dailyFeelings != null) {
      report.dailyFeelings = req.body.dailyFeelings;
    }
    if (req.body.size != null) {
      report.size = req.body.size;
    }
    if (req.body.weight != null) {
      report.weight = req.body.weight;
    }
    if (req.body.rmssd != null) {
      report.rmssd = req.body.rmssd;
    }
    if (req.body.mhr != null) {
      report.mhr = req.body.mhr;
    }
    if (req.body.bmi != null) {
      report.bmi = req.body.bmi;
    }

    try {
      const updatedReport = await report.save();
      res.json(updatedReport);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  create: function (req, res) {
    const report = new reportModel({
      userId: req.body.userId,
      cardiacRecordId: req.body.cardiacRecordId,
      dailyFeelings: req.body.dailyFeelings,
      size: req.body.size,
      date: Date.now(),
      weight: req.body.weight,
      rmssd: req.body.rmssd,
      mhr: req.body.mhr,
      bmi: req.body.bmi,
    });
    return report.save();
  },
  update: function (req, res) {
    return reportModel
      .findByIdAndUpdate(
        req.params.id,
        {
          cardiacRecordId: req.body.cardiacRecordId,
          userId: req.body.userId,
          dailyFeelings: req.body.dailyFeelings,
          size: req.body.size,
          weight: req.body.weight,
          rmssd: req.body.rmssd,
          mhr: req.body.mhr,
          bmi: req.body.bmi,
        },
        { new: true }
      )
      .exec();
  },
  delete: function (req, res) {
    return reportModel.findByIdAndRemove(req.params.id).exec();
  },
  getReportWithDate: function (req, res) {
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);

    return reportModel
      .find({
        userId: {
          $eq: req.params.userId,
        },
        date: {
          $gt: d,
        },
      })
      .populate("dailyRecords")
      .exec();
  },
  getUserReports: function (req, res) {
    return reportModel
      .find({
        userId: {
          $eq: req.params.userId,
        },
      })
      .populate("cardiacRecordId")
      .exec();
  },
  getReportLast5Days: async function (req, res) {
    let reports;

    var dmin = new Date();
    dmin.setDate(dmin.getDate() - 6);
    dmin.setHours(0);
    dmin.setMinutes(0);
    dmin.setSeconds(0);

    var dmax = new Date().setDate(dmin.getDate() + 5);

    reports = await reportModel
      .find({
        userId: {
          $eq: req.params.userId,
        },
        date: {
          $gt: dmin,
          $lt: dmax,
        },
      })
      .populate("cardiacRecordId")
      .exec();
    if (reports.length > 0) {
      return reports.sort((a, b) => a.date - b.date);
    }
    return null;
  },
  getUserLastReport: async function (req, res) {
    reports = await reportModel
      .find({ userId: req.params.userId })
      .populate("cardiacRecordId")
      .exec();
    if (reports.length > 0) {
      return reports[reports.length - 1];
    }
  },
  getStatsonTimeSpan: async function (req, res) {
    console.log("get stats fct")
    let _reports;
    let _data = {
      IMC: Number,
      FCM: Number,
      RMSSD: Double,
      date: Date,
    };
    let _datas = [];
    var currentDate = new Date();
    let dmin = new Date();
    let dmax = new Date();

    try {
      switch (req.body.timeSpan) {
        case "week":
          console.log("try to get week stats");
          dmin.setDate(currentDate.getDate() - 7 - (currentDate.getDay() - 1));
          dmin.setHours(0);
          dmin.setMinutes(0);
          dmin.setSeconds(0);
          dmax = dmax.setDate(dmin.getDate() + 6)

          _reports = await reportModel.find({
            "userId": {
              "$eq": req.body.userId
            },
            "date": {
              "$gt": dmin,
              "$lt": dmax
            }
          })
          break;
        case "month":
          dmin = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
          dmax = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          console.log(dmin);
          console.log(dmax);

          _reports = await reportModel.find({
            "userId": {
              "$eq": req.body.userId
            },
            "date": {
              "$gt": dmin,
              "$lt": dmax
            }
          })
          break;
      }
      console.log(_reports)
      if (_reports == null) {
        return res.status(404).json({ message: "Cannot find report" });
      }
      else {
        _reports.
          forEach((report) => {
            console.log(report)
            _data = {
              IMC: (report.weight / ((report.size / 100) * (report.size / 100))).toFixed(0),
              FCM: report.mhr,
              RMSSD: report.rmssd,
              date: report.date.getDate(),
            }
            console.log(_data)
            _datas.push(_data)
          })
      }
      _datas = _datas.sort((a, b) => a.date - b.date)
      console.log(_datas)

    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    return _datas;
  },
};
module.exports = dailyReportsController;
