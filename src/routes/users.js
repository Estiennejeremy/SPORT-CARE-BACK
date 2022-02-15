const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const checkNotAuthenticated = require("../../index");
const authentication = require("../middlewares/authentication");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting One
router.get(
  "/:id",
  [authentication.checkTokenMiddleware, getUser],
  (req, res) => {
    res.json(res.user);
  }
);

//Getting all athletes for a coach
router.get(
  "/coach/:coachId",
  [authentication.checkTokenMiddleware, getCoachAthletes],
  (req, res) => {
    try {
      res.json(res.athletes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware, getUser],
  async (req, res) => {
    if (req.body.firstName != null) {
      res.user.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
      res.user.lastName = req.body.lastName;
    }
    if (req.body.email != null) {
      res.user.email = req.body.email;
    }
    if (req.body.birthdate != null) {
      res.user.birthdate = req.body.birthdate;
    }
    if (req.body.address != null) {
      res.user.address = req.body.address;
    }
    if (req.body.role != null) {
      res.user.role = req.body.role;
    }
    if (req.body.civility != null) {
      res.user.civility = req.body.civility;
    }
    if (req.body.password != null) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      res.user.password = hashedPassword;
    }
    if (req.body.condition != null) {
      res.user.condition = req.body.condition;
    }
    if (req.body.coachId != null) {
      res.user.coachId = req.body.coachId;
    }

    try {
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

//Deleting One
router.delete(
  "/:id",
  [authentication.checkTokenMiddleware, getUser],
  async (req, res) => {
    try {
      await res.user.remove();
      res.json({ message: "User deleted." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getUser(req, res, next) {
  let user;
  try {
    user = await userModel.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

async function getCoachAthletes(req, res, next) {
  let athletes;
  try {
    athletes = await userModel.find({ coachId: req.params.coachId });
    if (athletes.length === 0) {
      return res.status(404).json({ message: "Cannot find athletes" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.athletes = athletes;
  next();
}

module.exports = router;
