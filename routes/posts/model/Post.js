const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
  {
    title: { type: String },
    post: { type: String },
    commentHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "comment",
      },
    ],
    postOwner: { type: mongoose.Schema.ObjectId, ref: "user" },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("post", orderSchema);
