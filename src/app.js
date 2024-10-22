const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Namaste from the server");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on the port 3000");
});
