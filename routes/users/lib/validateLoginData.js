const { isEmail } = require("validator");

function validateLoginData(req, res, next) {
  let errObj = {};
  const { email } = req.body;

  if (!isEmail(email)) {
    errObj.email = "Email should contain '@' and valid '.' address.";
  }

  // Creates and array of Object keys;
  let checkObj = Object.keys(errObj);

  if (checkObj.length > 0) {
    return res.status(500).json({
      message: "Error",
      error: errObj,
    });
  } else {
    next();
  }
}

module.exports = {
  validateLoginData,
};
