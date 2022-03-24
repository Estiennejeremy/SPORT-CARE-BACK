const express = require("express");
const { Double } = require("mongodb");
const router = express.Router();
const reportModel = require("../models/dailyReports");

//Getting all
router.get("/", async (req, res) => {
  try {
    const reports = await reportModel.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting all for a user
router.get("/user/:userId", getUserReports, (req, res) => {
  try {
    res.json(res.reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting One
router.get("/:id", getReport, (req, res) => {
  res.json(res.report);
});

//Get one with date
router.get("/date/:userId", getReportWithDate, (req, res) => {
  res.json(res.report);
});

//getReportLast5Days
router.get("/dateMinus5/:userId", getReportLast5Days, (req, res) => {
  res.json(res.report);
});

// Creating one
router.post("/", async (req, res) => {
  const report = new reportModel({
    userId: req.body.userId,
    dailyFeelings: req.body.dailyFeelings,
    size: req.body.size,
    weight: req.body.weight,
    rmssd: req.body.rmssd,
    mhr: req.body.mhr,
    bmi: req.body.bmi,
  });
  console.log(`report`, report);
  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//getIMConTimeSpan
router.post("/stats", getStatsonTimeSpan, async (req, res) => {
  res.json(res.datas);
});

//Updating One
router.patch("/:id", getReport, async (req, res) => {
  if (req.body.userId != null) {
    res.report.userId = req.body.userId;
  }
  if (req.body.dailyFeelings != null) {
    res.report.dailyFeelings = req.body.dailyFeelings;
  }
  if (req.body.size != null) {
    res.report.size = req.body.size;
  }
  if (req.body.weight != null) {
    res.report.weight = req.body.weight;
  }
  if (req.body.rmssd != null) {
    res.report.rmssd = req.body.rmssd;
  }
  if (req.body.mhr != null) {
    res.report.mhr = req.body.mhr;
  }
  if (req.body.bmi != null) {
    res.report.bmi = req.body.bmi;
  }

  try {
    const updatedReport = await res.report.save();
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Deleting One
router.delete("/:id", getReport, async (req, res) => {
  try {
    await res.report.remove();
    res.json({ message: "Report deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


async function getStatsonTimeSpan(req, res, next) {
  let _reports;
  let _data = {
    IMC : Number,
    FCM : Number,
    RMSSD : Double,
    date : Date,
  };
  let _datas = [];
  var currentDate = new Date();
  let dmin = new Date();
  let dmax = new Date();

  try {
    switch (req.body.timeSpan) {
      case "week":
        dmin.setDate(currentDate.getDate() - 7 - (currentDate.getDay() - 1));
        dmin.setHours(0);
        dmin.setMinutes(0);
        dmin.setSeconds(0);
        console.log(dmin);

        _reports = await reportModel.find({
          "userId": {
            "$eq": req.body.userId
          },
          "date": {
            "$gt": dmin,
            "$lt": dmin.setDate(dmin.getDate() + 7)
          }
        })
        break;
      case "month":
        dmin = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        dmax = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);
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
    else{
      _reports.forEach((report) => {
        console.log(report)
        _data = {
          IMC : (report.weight / ((report.size / 100) * (report.size / 100))).toFixed(0),
          FCM: report.mhr,
          RMSSD : report.rmssd,
          date : report.date.getDate(),
        }
        console.log(_data)
        _datas.push(_data)
      })
    }
    console.log(_datas)

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.datas = _datas;
  next();
}

async function getReport(req, res, next) {
  let report;
  try {
    report = await reportModel.findById(req.params.id);
    if (report == null) {
      return res.status(404).json({ message: "Cannot find report" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.report = report;
  next();
}

async function getReportLast5Days(req, res, next) {
  let reports
  try {
    var dmin = new Date();
    dmin.setDate(dmin.getDate() - 6);
    dmin.setHours(0);
    dmin.setMinutes(0);
    dmin.setSeconds(0);

    var dmax = new Date().setDate(dmin.getDate() + 5);

    reports = await reportModel.find({
      "userId": {
        "$eq": req.params.userId
      },
      "date": {
        "$gt": dmin,
        "$lt": dmax
      }
    })

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.report = reports.sort((a, b) => a.date - b.date);
  next();
}

async function getReportWithDate(req, res, next) {
  let _report
  try {
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);

    _report = await reportModel.find({
      "userId": {
        "$eq": req.params.userId
      },
      "date": {
        "$gt": d
      }
    })

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.report = _report;
  next();
}

async function getUserReports(req, res, next) {
  let reports;
  try {
    reports = await reportModel.find({ userId: req.params.userId });
    if (reports == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.reports = reports;
  next();
}

module.exports = router;
