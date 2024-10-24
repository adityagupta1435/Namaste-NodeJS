//For Doubt Resolving
const express = require("express");
const app = express();

app.use("/user", (req, res) => {
  console.log("User route");
  res.send("User Data Fetched");
});
app.use("/user/login", (req, res) => {
  console.log("User Login route");
  res.send("User logged in Successfully");
});

app.listen(4000, () => {
  console.log("Server is listening to port 4000");
});
