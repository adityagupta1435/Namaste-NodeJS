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

const validateEditProfileData = function (req) {
  const alloweEditFields = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];

  const { age, skills } = req.body;

  if (age > 99 || age < 3) {
    throw new Error("Invalid age!");
  }

  if (skills.length > 10) {
    throw new Error("Exceeds skills length");
  }

  const isEditAllowed = Object.keys(req.body).every((field) =>
    alloweEditFields.includes(field)
  );

  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
