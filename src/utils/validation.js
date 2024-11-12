const validator = require("validator");

const validateSignUpData = function (req) {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("No Firstname or Lastname provided");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email ID!");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong Password!");
  }
};

module.exports = {
  validateSignUpData,
};
