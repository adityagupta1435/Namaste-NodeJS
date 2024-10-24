const express = require("express");
const app = express();

app.get("/getUserData", (req, res) => {
  //Logic of DB Call and get User Data
  throw new Error("xyz");
  res.send("User Data Sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("Something went wrong!!");
  }
});

app.listen(3000, () => {
  console.log("Server is successfully listening on the port 3000");
});
