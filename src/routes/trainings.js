const express = require("express");
const router = express.Router();
const trainingModel = require("../models/trainings");

//Getting all
router.get("/", async (req, res) => {
  try {
    const trainings = await trainingModel.find();
    res.json(trainings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting One
router.get("/:id", getTraining, (req, res) => {
  res.json(res.training);
});

router.get("/user/:id", getUserTrainings, (req, res) => {
  res.json(res.trainings);
});

// Creating one
router.post("/", async (req, res) => {
  const training = new trainingModel({
    userId: req.body.userId,
    date: req.body.date,
    effort: req.body.effort,
    recap: req.body.recap,
    duration: req.body.duration,
    sportID: req.body.sportID,
  });
  try {
    const newTraining = await training.save();
    res.status(201).json(newTraining);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating One
router.patch("/:id", getTraining, async (req, res) => {
  if (req.body.userId != null) {
    res.training.userId = req.body.userId;
  }
  if (req.body.effort != null) {
    res.training.effort = req.body.effort;
  }
  if (req.body.recap != null) {
    res.training.recap = req.body.recap;
  }
  if (req.body.duration != null) {
    res.training.duration = req.body.duration;
  }
  if (req.body.sportID != null) {
    res.training.sportID = req.body.sportID;
  }

  try {
    const updatedTraining = await res.training.save();
    res.json(updatedTraining);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Deleting One
router.delete("/:id", getTraining, async (req, res) => {
  try {
    await res.training.remove();
    res.json({ message: "Training deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getTraining(req, res, next) {
  let training;
  try {
    training = await trainingModel.findById(req.params.id);
    if (training == null) {
      return res.status(404).json({ message: "Cannot find training" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.training = training;
  next();
}

async function getUserTrainings(req, res, next) {
  let trainings;
  try {
    trainings = await trainingModel.find({ id: req.params.userId });
    if (trainings == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.trainings = trainings;
  next();
}

module.exports = router;
