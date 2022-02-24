const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/users.model");
const authentication = require("../middlewares/authentication");
const usersController = require("../controllers/users.controller");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  usersController.index(req, res).then(result => {
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
    usersController.show(req, res).then(result => {
      res.json(result);
    }).catch(err => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    })
  }
);

//Getting all athletes for a coach
router.get(
  "/coach/:coachId",
  [authentication.checkTokenMiddleware],
  (req, res) => {
   usersController.getCoachAthletes(req, res).then(result => {
      res.json(result);
    }).catch(err => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    })
  }
);

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware],
  async (req, res) => {
   usersController.update(req, res).then(result => {
      res.json(result);
    }).catch(err => {
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
    usersController.delete(req, res).then(result => {
      res.json(result);
    }).catch(err => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    })
  }
);

module.exports = router;
