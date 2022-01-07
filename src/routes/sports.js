const express = require("express");
const router = express.Router();
const sportModel = require("../models/sports");
const authentication = require("../middlewares/authentication");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  try {
    const sports = await sportModel.find();
    res.json(sports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting One
router.get(
  "/:id",
  [authentication.checkTokenMiddleware, getSport],
  (req, res) => {
    res.json(res.sport);
  }
);

// Creating one
router.post("/", authentication.checkTokenMiddleware, async (req, res) => {
  const sport = new sportModel({
    name: req.body.name,
  });
  try {
    const newSport = await sport.save();
    res.status(201).json(newSport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware, getSport],
  async (req, res) => {
    if (req.body.name != null) {
      res.sport.name = req.body.name;
    }

    try {
      const updatedSport = await res.sport.save();
      res.json(updatedSport);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

//Deleting One
router.delete(
  "/:id",
  [authentication.checkTokenMiddleware, getSport],
  async (req, res) => {
    try {
      await res.sport.remove();
      res.json({ message: "Sport deleted." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getSport(req, res, next) {
  let sport;
  try {
    sport = await sportModel.findById(req.params.id);
    if (sport == null) {
      return res.status(404).json({ message: "Cannot find sport" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.sport = sport;
  next();
}

module.exports = router;
