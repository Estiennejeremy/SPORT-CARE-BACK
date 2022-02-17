const mongoose = require("mongoose");
mongoose.set('debug', true);

const conversationSchema = new mongoose.Schema ({
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversations", conversationSchema);