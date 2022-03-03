const jwt = require("jsonwebtoken");

//Middleware can be a function
//Happens between the request and the response

const jwtMiddleware = async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      const slicedToken = req.headers.authorization.slice(7);
      const decodedToken = jwt.verify(slicedToken, process.env.SECRET_KEY);

      res.locals.decodedToken = decodedToken;
      next();
    } else {
      throw {
        message: "You do not have permissions.",
      };
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  jwtMiddleware,
};
