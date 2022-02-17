const express = require("express");
const router = express.Router();
const reportModel = require("../models/dailyReports.model");
const authentication = require("../middlewares/authentication");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  try {
    const reports = await reportModel.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting all for a user
router.get(
  "/user/:userId",
  [authentication.checkTokenMiddleware, getUserReports],
  (req, res) => {
    try {
      res.json(res.reports);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//Getting One
router.get(
  "/:id",
  [authentication.checkTokenMiddleware, getReport],
  (req, res) => {
    res.json(res.report);
  }
);

//Get one with date
router.get("/date/:userId", getReportWithDate, (req, res) => {
  res.json(res.report);
});

//getReportLast5Days
router.get("/dateMinus5/:userId", getReportLast5Days, (req, res) => {
  res.json(res.report);
});

// Creating one
router.post("/", authentication.checkTokenMiddleware, async (req, res) => {
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

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware, getReport],
  async (req, res) => {
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
  }
);

//Deleting One
router.delete(
  "/:id",
  [authentication.checkTokenMiddleware, getReport],
  async (req, res) => {
    try {
      await res.report.remove();
      res.json({ message: "Report deleted." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//Getting last report for a user
router.get("/last/:userId", getUserLastReport, (req, res) => {
  try {
    res.json(res.reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUserLastReport(req, res, next) {
  let reports;
  try {
    reports = await reportModel.find({ userId: req.params.userId });
    if (reports == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.reports = reports[reports.length - 1];
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
