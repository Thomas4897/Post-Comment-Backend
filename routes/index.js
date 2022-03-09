var express = require("express");
var router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("./posts/controller/postsController");
const {
  aboutPage,
  postFormPage,
  loginFormPage,
  signupFormPage,
  commentFormPage,
  currentUserPage,
} = require("./pages/viewController");
const { route } = require("express/lib/application");

const array = [1, 2, 3, 4, 5];
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home", { title: "Express", data: array });
});

router.get("/show-all-posts", getAllPosts);

router.get("/get-one-post-by-id/:postId", getPostById);

router.get("/about", aboutPage);

router.get("/post-form", postFormPage);

router.get("/login-form", loginFormPage);

router.get("/signup-form", signupFormPage);

router.get("/comment-form", commentFormPage);

router.get("/current-user", currentUserPage);

module.exports = router;
