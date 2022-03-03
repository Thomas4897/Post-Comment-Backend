const {
  isAlpha,
  isEmail,
  isAlphanumeric,
  isStrongPassword,
} = require("validator");

function validateCreateUserData(req, res, next) {
  let errObj = {};
  let body = req.body;

  if (!isAlpha(body.firstName)) {
    errObj.firstName =
      "First name should only contain letters and not contain special characters or numbers.";
  }

  if (!isAlpha(body.lastName)) {
    errObj.lastName =
      "Last name should only contain letters and not contain special characters or numbers.";
  }

  if (!isEmail(body.email)) {
    errObj.email = "Email should contain '@' and valid '.' address.";
  }

  if (!isAlphanumeric(body.username)) {
    errObj.username =
      "Username should only contain letters and numbers not contain special characters or spaces.";
  }

  if (!isStrongPassword(body.password)) {
    errObj.password =
      "Password should contain 1 uppercase letter, 1 lowercase letter, 1 special character and 1 number.";
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
  validateCreateUserData,
};
