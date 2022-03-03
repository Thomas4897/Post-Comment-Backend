var express = require("express");
var router = express.Router();
// const { route } = require("express/lib/application");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("hello from the commentsRouter");
});

module.exports = router;
