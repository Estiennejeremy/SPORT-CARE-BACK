const express = require("express");
const router = express.Router();
const coachModel = require("../models/coachs.model");
const authentication = require("../middlewares/authentication");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  try {
    const coachs = await coachModel.find();
    res.json(coachs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting One
router.get(
  "/:id",
  [authentication.checkTokenMiddleware, getCoach],
  (req, res) => {
    res.json(res.coach);
  }
);

// Creating one
router.post("/", authentication.checkTokenMiddleware, async (req, res) => {
  const coach = new coachModel({
    userId: req.body.userId,
    description: req.body.description,
  });
  try {
    const newCoach = await coach.save();
    res.status(201).json(newCoach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware, getCoach],
  async (req, res) => {
    if (req.body.userID != null) {
      res.coach.userID = req.body.userID;
    }
    if (req.body.description != null) {
      res.coach.description = req.body.description;
    }

    try {
      const updatedCoach = await res.coach.save();
      res.json(updatedCoach);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

//Deleting One
router.delete(
  "/:id",
  [authentication.checkTokenMiddleware, getCoach],
  async (req, res) => {
    try {
      await res.coach.remove();
      res.json({ message: "Coach deleted." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getCoach(req, res, next) {
  let coach;
  try {
    coach = await coachModel.findById(req.params.id);
    if (coach == null) {
      return res.status(404).json({ message: "Cannot find coach" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.coach = coach;
  next();
}

module.exports = router;
