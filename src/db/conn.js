const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://vaibhaviscriptjet:office123456789@cluster0.ejx7x8y.mongodb.net/moviesDb?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connection successfull with database");
  })
  .catch((error) => {
    console.log(error);
  });
