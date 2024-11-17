const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

//Sign up Api
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of the data
    validateSignUpData(req);
    const {
      firstName,
      lastName,
      password,
      emailId,
      skills,
      about,
      photoUrl,
      gender,
    } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    //Creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
      skills,
      about,
      photoUrl,
      gender,
    });

    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }

    //Validate Password
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //Create JWT Token
      const token = await user.getJWT();

      //Add the token to cookie abd send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfull!!!");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = authRouter;
