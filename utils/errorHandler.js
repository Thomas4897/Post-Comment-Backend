// make a function that takes in our error coming in from our userController
// mic of mongodb error and

// err.code
// err.keyValue
// err.ketPattern

const parsedError = (err) => {
  let objectKeys = Object.keys(err.keyValue);
  let objectValues = Object.values(err.keyValue);

  console.log("keys:", objectKeys);
  console.log("values:", objectValues);

  return `${objectKeys[0]} ${objectValues[0]} is already in use`;
};

const errorHandler = (err) => {
  let message = "";

  if (err.code) {
    switch (err.code) {
      case 11000:
        message = parsedError(err);
        break;
      default:
        message = "Something is wrong, contact support";
    }
  }
  return message;
};

module.exports = {
  errorHandler,
};
