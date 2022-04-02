const express = require("express");
const router = express.Router();
const trainingModel = require("../models/trainings.model");
const authentication = require("../middlewares/authentication");
const trainingController = require("../controllers/trainings.controller");

//Getting all
router.get("/", [authentication.checkTokenMiddleware], async (req, res) => {
  trainingController
    .index(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
});

//Getting One
router.get("/:id", [authentication.checkTokenMiddleware], (req, res) => {
  trainingController
    .show(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
});

router.get("/last/:id", [authentication.checkTokenMiddleware], (req, res) => {
  trainingController
    .getUserLasTrainings(req, res)
    .then((result) => {
      console.log(result,'COUCOUUUU');
      res.json(result);
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
});


router.get(
  "/user/:userId",
  [authentication.checkTokenMiddleware],
  (req, res) => {
    trainingController
      .getUserTrainings(req, res)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err.stack);
        res.status(500).json({ message: err.message });
      });
  }
);

// Creating one
router.post("/", [authentication.checkTokenMiddleware], async (req, res) => {
  trainingController
    .create(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
});

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware],
  async (req, res) => {
    trainingController
      .update(req, res)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
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
    trainingController
      .delete(req, res)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err.stack);
        res.status(500).json({ message: err.message });
      });
  }
);

module.exports = router;
