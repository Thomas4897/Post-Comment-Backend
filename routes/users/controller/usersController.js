const User = require("../model/User");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Validate User Info -> Moved to lib folder

    // Hashing/Encrypting Password;
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    // Creating a New User Object;
    let newUser = new User({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
    });

    // Use .save() to save new user object to DB
    let savedUser = await newUser.save();

    res.status(200).json({
      message: "New user has been saved",
      payload: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: errorHandler(error),
    });
  }
};

module.exports = {
  createUser,
};
