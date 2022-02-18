const express = require("express");
const router = express.Router();
const sportModel = require("../models/sports.model");
const authentication = require("../middlewares/authentication");
const sportsController = require("../controllers/sports.controller");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  sportsController.index(req, res).then(result => {
    res.json(result);
  }).catch(err => {
    console.log(err.stack);
    res.status(500).json({ message: err.message });
  })
});

//Getting One
router.get(
  "/:id",
  [authentication.checkTokenMiddleware],
  (req, res) => {
    sportsController.show(req, res).then(result => {
      res.json(result);
    }).catch(err => {
      console.log(err.stack);
      res.status(400).json({ message: err.message });
    })
  }
);

// Creating one
router.post("/", authentication.checkTokenMiddleware, async (req, res) => {
  sportsController.create(req, res).then(result => {
    res.json(result);
  }).catch(err => {
    console.log(err.stack);
    res.status(400).json({ message: err.message });
  })
});

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware],
  async (req, res) => {
    sportsController.update(req, res).then(result => {
      res.json(result);
    }
    ).catch(err => {
      console.log(err.stack);
      res.status(400).json({ message: err.message });
    });
  }
);

//Deleting One
router.delete(
  "/:id",
  [authentication.checkTokenMiddleware],
  async (req, res) => {
    sportsController.delete(req, res).then(result => {
      res.json(result);
    }).catch(err => {
      console.log(err.stack);
      res.status(400).json({ message: err.message });
    });
  }
);

module.exports = router;
