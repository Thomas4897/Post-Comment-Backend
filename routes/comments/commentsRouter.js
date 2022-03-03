var express = require("express");
var router = express.Router();
const { checkIsEmpty, jwtMiddleware } = require("../../utils/index");

const {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
} = require("./controller/commentsController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("hello from the commentsRouter");
});

router.post("/create-comment", checkIsEmpty, jwtMiddleware, createComment);

router.get("/get-all-comments", jwtMiddleware, getAllComments);

router.put("/update-comment", checkIsEmpty, jwtMiddleware, updateComment); // CANNOT update owner

router.delete("/delete-comment", checkIsEmpty, jwtMiddleware, deleteComment);

module.exports = router;
