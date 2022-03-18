const express = require("express");
const router = express.Router();
const messageModel = require("../models/messages.model");
const authentication = require("../middlewares/authentication");

//Getting all
router.get("/", authentication.checkTokenMiddleware, async (req, res) => {
  try {
    const messages = await messageModel.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting one
router.get(
  "/:id",
  [authentication.checkTokenMiddleware, getMessage],
  (req, res) => {
    try {
      res.json(res.message);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//Getting all messages for a user
router.get(
  "/user/:id",
  [authentication.checkTokenMiddleware, getUserMessages],
  (req, res) => {
    try {
      res.json(res.messages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//Getting all for a conversation
router.get(
  "/conversation/:conversationId",
  [authentication.checkTokenMiddleware, getConversationMessages],
  (req, res) => {
    try {
      res.json(res.messages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Creating one
router.post("/", authentication.checkTokenMiddleware, async (req, res) => {
  const message = new messageModel({
    userId: req.body.userId,
    conversationId: req.body.conversationId,
    message: req.body.message,
    date: req.body.date,
  });
  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating One
router.patch(
  "/:id",
  [authentication.checkTokenMiddleware, getMessage],
  async (req, res) => {
    if (req.body.message != null) {
      res.message.message = req.body.message;
    }

    try {
      const updatedMessage = await res.message.save();
      res.json(updatedMessage);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

//Deleting One
router.delete(
  "/:id",
  [authentication.checkTokenMiddleware, getMessage],
  async (req, res) => {
    try {
      await res.message.remove();
      res.json({ message: "Message deleted." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getMessage(req, res, next) {
  let message;
  try {
    message = await messageModel.findById(req.params.id);
    if (message == null) {
      return res.status(404).json({ message: "Cannot find message" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.message = message;
  next();
}

async function getUserMessages(req, res, next) {
  let messages;
  try {
    messages = await messageModel.find({ userId: req.params.id });
    if (messages == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.messages = messages;
  next();
}

async function getConversationMessages(req, res, next) {
  let messages;
  try {
    messages = await messageModel.find({
      conversationId: req.params.conversationId,
    });
    if (messages == null) {
      return res.status(404).json({ message: "Cannot find conversation" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.messages = messages;
  next();
}

module.exports = router;
