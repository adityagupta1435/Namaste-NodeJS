const express = require("express");

const app = express();

app.get("/ab?c", (req, res) => {
  res.send({
    firstname: "Aditya",
    lastname: "Gupta",
  });
});

app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({
    firstname: "Aditya",
    lastname: "Gupta",
  });
});
app.listen(3000, () => {
  console.log("Server is successfully listening on the port 3000");
});
