const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  //Creating a new instance of User model
  const user = new User({
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "virat@gmail.com",
    password: "Password@123",
    age: 25,
    gender: "Male",
  });

  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:", +err.message);
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
