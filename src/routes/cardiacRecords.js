const express = require("express");
const router = express.Router();
const cardiacModel = require("../models/cardiacRecords");

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
    res.json(res.cardiacRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one
router.post("/", async (req, res) => {
  console.log("ici ")
  const cardiacRecord = new cardiacModel({
    dailyReportId: req.body.dailyReportId,
    rmssd: req.body.rmssd,
    heartRate: req.body.heartRate,
    hrData: req.body.hrData,
  });
  try {
    const newCardiacRecord = await cardiacRecord.save();
    res.status(201).json(newCardiacRecord);
  } catch (err) {
    console.log(err.stack);
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
  var _cardiacRecords;
  try {
    _cardiacRecords = await cardiacModel.find({
      dailyReportId: req.params.id,
    });
    if (_cardiacRecords == null) {
      return res.status(404).json({ message: "Cannot find daily report" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.cardiacRecords = _cardiacRecords;
  next();
}

module.exports = router;
