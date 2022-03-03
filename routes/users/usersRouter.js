var express = require("express");
var router = express.Router();
const { route } = require("express/lib/application");

const {
  createUser,
  userLogin,
  updateProfile,
} = require("./controller/usersController");
const { checkIsEmpty, jwtMiddleware } = require("../../utils");

const {
  validateLoginData,
  validateCreateUserData,
  validateUpdateUserData,
} = require("./lib/index");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/create-user", checkIsEmpty, validateCreateUserData, createUser);

router.post("/login", checkIsEmpty, validateLoginData, userLogin);

router.put(
  "/update-profile",
  jwtMiddleware,
  checkIsEmpty,
  validateUpdateUserData,
  updateProfile
);

module.exports = router;
