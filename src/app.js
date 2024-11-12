const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

//Sign up Api
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    console.log("Send Connection Request");
    res.send("Connection Request Sent!");
  } catch (err) {
    res.status(400).send("ERROR: ", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on the port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!! ", err);
  });
