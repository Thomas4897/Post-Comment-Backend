const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { errorHandler } = require("../../../utils/errorHandler");

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

// Create user login function
const userLogin = async (req, res) => {
  try {
    // Deconstructor method
    const { email, password } = req.body;

    // Mongoose .findOne()
    const foundUser = await User.findOne({ email: email });

    if (foundUser === null) {
      throw {
        message: "Email not found",
      };
    }

    const comparedPassword = await bcrypt.compare(password, foundUser.password);

    if (!comparedPassword) {
      throw {
        message: "Email and Password do not match",
      };
    }

    const jwtToken = jwt.sign(
      {
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        username: foundUser.username,
      },
      process.env.SECRET_KEY,
      { expiresIn: "12h" }
    );

    if (foundUser) {
      return res.status(200).json({ payload: jwtToken });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  userLogin,
};
