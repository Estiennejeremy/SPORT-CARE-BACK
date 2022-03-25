const express = require("express");
const router = express.Router();
const reportModel = require("../models/dailyReports.model");
const authentication = require("../middlewares/authentication");
const dailyReportsController = require("../controllers/dailyReports.controller");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  dailyReportsController
    .index(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
});

//Getting all for a user
router.get(
  "/user/:userId",
  [authentication.checkTokenMiddleware],
  (req, res) => {
    dailyReportsController
      .getUserReports(req, res)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err.stack);
        res.status(500).json({ message: err.message });
      });
  }
);

//Getting One
router.get("/:id", [authentication.checkTokenMiddleware], (req, res) => {
  dailyReportsController
    .show(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
});

//Get one with date
router.get(
  "/date/:userId",
  [authentication.checkTokenMiddleware],
  (req, res) => {
    dailyReportsController
      .getReportWithDate(req, res)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err.stack);
        res.status(500).json({ message: err.message });
      });
  }
);

//getReportLast5Days
router.get("/dateMinus5/:userId", (req, res) => {
  dailyReportsController
    .getReportLast5Days(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
});

// Creating one
router.post("/", authentication.checkTokenMiddleware, async (req, res) => {
  dailyReportsController
    .create(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(400).json({ message: err.message });
    });
});

//getIMConTimeSpan
router.post(
  "/stats",
  [authentication.checkTokenMiddleware],
  async (req, res) => {
    dailyReportsController
      .getStatsonTimeSpan(req, res)
      .then((result) => {
        console.log("FUCKING RESULT", result);
        res.json(result);
      })
      .catch((err) => {
        console.log(err.stack);
        res.status(500).json({ message: err.message });
      });
  }
);

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware],
  async (req, res) => {
    dailyReportsController
      .update(req, res)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
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
    dailyReportsController
      .delete(req, res)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err.stack);
        res.status(400).json({ message: err.message });
      });
  }
);

//Getting last report for a user
router.get("/last/:userId", (req, res) => {
  dailyReportsController
    .getUserLastReport(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.message)
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
