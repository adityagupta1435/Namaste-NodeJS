const express = require("express");

const app = express();

// Route '/' is like a wildcard route. Anything that matches after the '/'. Below route handler will manage it.
// app.use("/", (req, res) => {
//   res.send("Default");
// });

// This will only handle GET call to /user
app.get("/users", (req, res) => {
  res.send({
    firstname: "Aditya",
    lastname: "Gupta",
  });
});

app.post("/users", (req, res) => {
  //Saving data to DB
  res.send("Data Successfully saved to the database");
});

//this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("Test Call");
});

// app.use("/", (req, res) => {
//   res.send("Default");
// });

app.listen(3000, () => {
  console.log("Server is successfully listening on the port 3000");
});
