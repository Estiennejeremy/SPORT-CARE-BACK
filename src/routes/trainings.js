const express = require ('express')
const router = express.Router()
const trainingModel = require('../models/trainings')


//Getting all
router.get('/', async (req, res) => {
  try {
    const trainings = await trainingModel.find()
    res.json(trainings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//Getting One
router.get ('/:id', getTraining, (req, res) => {
  res.json(res.training)
})

router.get ('/user/:id', getUserTrainings, (req, res) => {
  res.json(res.trainings)
})

// Creating one
router.post ('/', async (req, res) => {
  const training = new trainingModel ({
    UserId: req.body.UserId,
    Date: req.body.Date,
    Effort: req.body.Effort,
    Recap: req.body.Recap,
    Duration: req.body.Duration,
    sportID: req.body.sportID,
  })
  try {
    const newTraining = await training.save();
    res.status(201).json(newTraining);
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Updating One
router.patch ('/:id', getTraining, async (req, res) => {
  if (req.body.UserId != null) {
    res.training.UserId = req.body.UserId
  }
  if (req.body.Effort != null) {
    res.training.Effort = req.body.Effort
  }
  if (req.body.Recap != null) {
    res.training.Recap = req.body.Recap
  }
  if (req.body.Duration != null) {
    res.training.Duration = req.body.Duration
  }
  if (req.body.sportID != null) {
    res.training.sportID = req.body.sportID
  }

  try {
    const updatedTraining = await res.training.save()
    res.json(updatedTraining)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Deleting One
router.delete ('/:id', getTraining, async (req, res) => {
  try {
    await res.training.remove()
    res.json ({ message: 'Training deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


async function getTraining (req, res, next) {
  let training
  try {
    training = await trainingModel.findById(req.params.id)
    if (training == null) {
      return res.status(404).json({ message: 'Cannot find training'})
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.training = training
  next()
}


async function getUserTrainings (req, res, next) {
  let trainings
  try {
    trainings = await trainingModel.find({'id': req.params.UserId})
    if (trainings == null) {
      return res.status(404).json({ message: 'Cannot find user'})
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.trainings = trainings
  next()
}


module.exports = router
