const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const cardiacRecordsController = require("../controllers/cardiacRecords.controller");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  cardiacRecordsController.index(req, res).then((cardiacRecords) => {
    res.json(cardiacRecords);
  }).catch((err) => {
    console.log(err.stack);
    res.status(500).json({ message: err.message });
  });
});

//Getting One
router.get(
  "/:id",
  [authentication.checkTokenMiddleware],
  async (req, res) => {
    cardiacRecordsController.show(req, res).then((cardiacRecord) => {
      res.json(cardiacRecord);
    }).catch((err) => {
      console.log(err.stack);

      res.status(500).json({ message: err.message });
    });
  }
);

//Getting all for a report
router.get(
  "/dailyReport/:id",
  [authentication.checkTokenMiddleware],
  (req, res) => {
    cardiacRecordsController.getReportCardiacRecords(req, res).then((cardiacRecords) => {
      res.json(cardiacRecords);
    }).catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
  }
);

// Creating one
router.post("/", authentication.checkTokenMiddleware, async (req, res) => {
  cardiacRecordsController.create(req, res).then((cardiacRecord) => {
    res.json(cardiacRecord);
  }).catch((err) => {
    console.log(err.stack);
    res.status(400).json({ message: err.message });
  });
});

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware],
  async (req, res) => {
    cardiacRecordsController.update(req, res).then((cardiacRecord) => {
      res.json(cardiacRecord);
    }).catch((err) => {
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
    cardiacRecordsController.delete(req, res).then((cardiacRecord) => {
      res.json(cardiacRecord);
    }).catch((err) => {
      res.status(400).json({ message: err.message });
    });
  }
);

module.exports = router;
;
