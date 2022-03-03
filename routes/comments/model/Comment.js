const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    postId: { type: mongoose.Schema.ObjectId, ref: "post" },
    comment: { type: String },
    commentOwner: { type: mongoose.Schema.ObjectId, ref: "user" },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("comment", commentSchema);
