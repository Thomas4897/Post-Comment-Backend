const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    username: {
      type: String,
      unique: true,
      require: [true, "cannot leave empty"],
    },
    email: {
      type: String,
      unique: true,
      require: [true, "cannot leave empty"],
    },
    password: {
      type: String,
      require: [true, "cannot leave empty"],
    },
    postHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "post",
      },
    ],
    commentHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
