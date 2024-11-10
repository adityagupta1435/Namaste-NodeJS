const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Correct Password:" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 99,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL:" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
