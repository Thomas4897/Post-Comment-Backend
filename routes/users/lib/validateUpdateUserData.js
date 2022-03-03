const { isAlpha, isAlphanumeric, isStrongPassword } = require("validator");

function validateUpdateUserData(req, res, next) {
  let errObj = {};
  let body = req.body;
  const { firstName, lastName, username, password, confirmPassword } = req.body;

  if (!isAlpha(firstName)) {
    errObj.firstName =
      "First name should only contain letters and not contain special characters or numbers.";
  }

  if (!isAlpha(lastName)) {
    errObj.lastName =
      "Last name should only contain letters and not contain special characters or numbers.";
  }

  if (!isAlphanumeric(username)) {
    errObj.username =
      "Username should only contain letters and numbers not contain special characters or spaces.";
  }

  if (!isStrongPassword(password)) {
    errObj.password =
      "Password should contain 1 uppercase letter, 1 lowercase letter, 1 special character and 1 number.";
  }

  if (password !== confirmPassword) {
    errObj.confirmPassword = "Password and confirm password do not match.";
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
  validateUpdateUserData,
};
