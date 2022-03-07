var express = require("express");
var router = express.Router();
const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
} = require("./posts/controller/postsController");
const { aboutPage, postFormPage } = require("./pages/viewController");

const array = [1, 2, 3, 4, 5];
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home", { title: "Express", data: array });
});

router.get("/show-all-posts", getAllPosts);

router.get("/about", aboutPage);

router.get("/post-form", postFormPage);

module.exports = router;
