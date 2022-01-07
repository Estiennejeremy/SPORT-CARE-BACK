const express = require("express");
const router = express.Router();
const cardiacModel = require("../models/cardiacRecords");
const IaClient = require("../services/ia-client");
const reportModel = require("../models/dailyReports");

//Getting all
router.get("/", async (req, res) => {
  try {
    const cardiacRecords = await cardiacModel.find();
    res.json(cardiacRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting One
router.get("/:id", getCardiacRecord, async (req, res) => {
  try {
    res.json(res.cardiacRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting all for a report
router.get("/dailyReport/:id", getReportCardiacRecords, (req, res) => {
  try {
    res.json(res.cardiacRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one
router.post("/", async (req, res) => {
  const  allRm = []
  let status = null;
  const allModels = reportModel.find();
  const fiveLastRmssd = (await allModels).filter(model => model.rmssd).slice(Math.max(allModels.length - 5, 0))
  console.log(fiveLastRmssd)
  rmssd = await IaClient.getRmssd(req.body.hrData);
  if(fiveLastRmssd.length >= 4) {
   
    for(const item of fiveLastRmssd) {
      allRm.push(item.rmssd);
    }
    allRm.push(rmssd)
   status = await IaClient.getState(allRm)
  }
  const average = req.body.hrData.reduce((a, b) => a + b) / req.body.hrData.length;
  const cardiacRecord = new cardiacModel({
    dailyReportId: req.body.dailyReportId,
    rmssd: rmssd,
    heartRate: average,
    hrData: req.body.hrData,
    currentStatus: status
  });
  try {
    const newCardiacRecord = await cardiacRecord.save();
    gares.status(201).json(newCardiacRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating One
router.patch("/:id", getCardiacRecord, async (req, res) => {
  if (req.body.rmssd != null) {
    res.cardiacRecord.rmssd = req.body.rmssd;
  }
  if (req.body.heartRate != null) {
    res.cardiacRecord.heartRate = req.body.heartRate;
  }
  if (req.body.hrData != null) {
    res.cardiacRecord.hrData = req.body.hrData;
  }

  try {
    const updatedCardiacRecord = await res.cardiacRecord.save();
    res.json(updatedCardiacRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Deleting One
router.delete("/:id", getCardiacRecord, async (req, res) => {
  try {
    await res.cardiacRecord.remove();
    res.json({ message: "Cardiac record deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCardiacRecord(req, res, next) {
  let cardiacRecord;
  try {
    cardiacRecord = await cardiacModel.findById(req.params.id);
    if (cardiacRecord == null) {
      return res.status(404).json({ message: "Cannot find cardiac record" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.cardiacRecord = cardiacRecord;
  next();
}

async function getReportCardiacRecords(req, res, next) {
  let cardiacRecords;
  try {
    cardiacRecords = await cardiacModel.find({
      userId: req.params.dailyReportId,
    });
    if (cardiacRecords == null) {
      return res.status(404).json({ message: "Cannot find daily report" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.cardiacRecords = cardiacRecords;
  next();
}



module.exports = router;
