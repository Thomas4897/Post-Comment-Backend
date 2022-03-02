var express = require("express");
var router = express.Router();
const { route } = require("express/lib/application");

const {
  createUser,
  userLogin,
  updateProfile,
} = require("./controller/usersController");
const {
  checkIsEmpty,
  jwtMiddleware,
} = require("../../lib/authMiddleware/index");

const {
  validateLoginData,
  validateCreateData,
  validateUpdateData,
} = require("./lib/index");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/create-user", checkIsEmpty, validateCreateData, createUser);

router.post("/login", checkIsEmpty, validateLoginData, userLogin);

router.put(
  "/update-profile",
  jwtMiddleware,
  checkIsEmpty,
  validateUpdateData,
  updateProfile
);

module.exports = router;
