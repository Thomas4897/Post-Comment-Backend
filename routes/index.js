var express = require("express");
var router = express.Router();

/* GET home page. */
const array = [1, 2, 3, 4, 5];
router.get("/", function (req, res, next) {
  res.render("home", { title: "Express", data: array });
});

module.exports = router;
