var express = require("express");
var router = express.Router();
const { route } = require("express/lib/application");

const { createUser, userLogin } = require("./controller/usersController");
const {
  checkIsEmpty,
  // jwtMiddleware,
} = require("../../lib/authMiddleware/index");

const { validateLoginData } = require("./lib/validateLoginData");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/create-user", checkIsEmpty, createUser);
router.post("/login", checkIsEmpty, validateLoginData, userLogin);

module.exports = router;
