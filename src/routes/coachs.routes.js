const express = require("express");
const router = express.Router();
const coachModel = require("../models/coachs.model");
const authentication = require("../middlewares/authentication");
const coachController = require("../controllers/coachs.controller");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  coachController.index(req, res).then((coachs) => {
    res.json(coachs);
  }).catch((err) => {
    console.log(err.stack);
    res.status(500).json({ message: err.message });
  });
});

//Getting One
router.get(
  "/:id",
  [authentication.checkTokenMiddleware],
  (req, res) => {
    coachController.show(req, res).then((coach) => {
      res.json(coach);
    }).catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
  });

// Creating one
router.post("/", authentication.checkTokenMiddleware, async (req, res) => {
  coachController.create(req, res).then((coach) => {
    res.json(coach);
  }).catch((err) => {
    console.log(err.stack);
    res.status(400).json({ message: err.message });
  });
});

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware,],
  async (req, res) => {
    coachController.update(req, res).then((coach) => {
      res.json(coach);
    }).catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
  }
);

//Deleting One
router.delete(
  "/:id",
  [authentication.checkTokenMiddleware],
  async (req, res) => {
    coachController.delete(req, res).then((coach) => {
      res.json(coach);
    }).catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
  }
);

module.exports = router;
