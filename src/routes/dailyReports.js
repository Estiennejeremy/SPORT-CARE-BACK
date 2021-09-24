const express = require ('express')
const router = express.Router()
const reportModel = require('../models/dailyReports')


//Getting all
router.get('/', async (req, res) => {
  try {
    const reports = await reportModel.find()
    res.json(reports)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//Getting One
router.get ('/:id', getReport, (req, res) => {
  res.json(res.report)
})

router.get ('/user/:id', getUserReports, (req, res) => {
  res.json(res.reports)
})

// Creating one
router.post ('/', async (req, res) => {
  const report = new reportModel ({
    UserId: req.body.UserId,
    DailyFeelings: req.body.DailyFeelings,
    Size: req.body.Size,
    Weight: req.body.Weight,
    Rmssd: req.body.Rmssd,
    Mhr: req.body.Mhr,
    Bmi: req.body.Bmi,
  })
  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Updating One
router.patch ('/:id', getReport, async (req, res) => {
  if (req.body.UserId != null) {
    res.report.UserId = req.body.UserId
  }
  if (req.body.DailyFeelings != null) {
    res.report.DailyFeelings = req.body.DailyFeelings
  }
  if (req.body.Size != null) {
    res.report.Size = req.body.Size
  }
  if (req.body.Weight != null) {
    res.report.Weight = req.body.Weight
  }
  if (req.body.Rmssd != null) {
    res.report.Rmssd = req.body.Rmssd
  }
  if (req.body.Mhr != null) {
    res.report.Mhr = req.body.Mhr
  }
  if (req.body.Bmi != null) {
    res.report.Bmi = req.body.Bmi
  }

  try {
    const updatedReport = await res.report.save()
    res.json(updatedReport)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Deleting One
router.delete ('/:id', getReport, async (req, res) => {
  try {
    await res.report.remove()
    res.json ({ message: 'Report deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


async function getReport (req, res, next) {
  let report
  try {
    report = await reportModel.findById(req.params.id)
    if (report == null) {
      return res.status(404).json({ message: 'Cannot find report'})
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.report = report
  next()
}


async function getUserReports (req, res, next) {
  let reports
  try {
    reports = await reportModel.find({'userId': req.params.UserId})
    if (reports == null) {
      return res.status(404).json({ message: 'Cannot find user'})
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.reports = reports
  next()
}


module.exports = router
