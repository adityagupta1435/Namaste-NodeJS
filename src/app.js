const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //Create JWT Token
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");

      //Add the token to cookie abd send the response back to the user
      res.cookie("token", token);
      res.send("Login Successfull!!!");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    const { _id } = await jwt.verify(token, "DEV@Tinder$790");

    const user = await User.find({ _id: _id });

    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});
//Get User by Email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (user) {
      res.send(user);
    } else {
      res.status(400).send("User not found!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Delete API
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!!");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Feed API - GET / feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Patch API
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "password",
      "skills",
      "gender",
      "age",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10!");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });

    res.send("User updated Successfully!!");
  } catch (err) {
    console.log(err);
    res.status(400).send("Updation failed!");
  }
});

//Find by email and then update
// app.patch("/user", async (req, res) => {
//   const emailId = req.body.emailId;
//   const data = req.body;
//   try {
//     const user = await User.findOneAndUpdate({ emailId: emailId }, data);
//     res.send("User updated Successfully!!");
//   } catch (err) {
//     res.status(400).send("Something went wrong!");
//   }
// });

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
