const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    //route handler
    next();
    res.send("Route Handler 1");
  },
  (req, res) => {
    res.send("Route Handler 2");
  },
  (req, res) => {
    res.send("Route Handler 2");
  }
);
app.listen(3000, () => {
  console.log("Server is successfully listening on the port 3000");
});
