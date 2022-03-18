const express = require("express");
const router = express.Router();
const conversationModel = require("../models/conversations.model");
const authentication = require("../middlewares/authentication");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  try {
    const conversations = await conversationModel.find();
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting one
router.get(
  "/:id",
  [authentication.checkTokenMiddleware, getConversation],
  (req, res) => {
    try {
      res.json(res.conversation);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//new conv
router.post("/", authentication.checkTokenMiddleware, async (req, res) => {
  const newConversation = new conversationModel({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user
router.get(
  "/user/:userId",
  authentication.checkTokenMiddleware,
  async (req, res) => {
    try {
      const conversation = await conversationModel.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// get conv includes two userId
router.get(
  "/users/:firstUserId/:secondUserId",
  authentication.checkTokenMiddleware,
  async (req, res) => {
    try {
      const conversation = await conversationModel.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

async function getConversation(req, res, next) {
  let conversation;
  try {
    conversation = await conversationModel.findById(req.params.id);
    if (conversation == null) {
      return res.status(404).json({ message: "Cannot find message" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.conversation = conversation;
  next();
}

module.exports = router;
