const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("../middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user/data", userAuth, (req, res) => {
  res.send("User Data Sent");
});

app.post("/user/login", (req, res) => {
  res.send("User logged in Successfully");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data Sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted a user");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on the port 3000");
});
