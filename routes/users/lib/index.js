const { validateCreateUserData } = require("./validateCreateUserData");
const { validateLoginData } = require("./validateLoginData");
const { validateUpdateUserData } = require("./validateUpdateUserData");

module.exports = {
  validateCreateUserData,
  validateLoginData,
  validateUpdateUserData,
};
