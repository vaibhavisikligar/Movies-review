const express = require("express");
const cors = require("cors");
require("./db/conn");
const app = express();
const moviesRouter = require("./routers/moviesRouter");
const userRouter = require("./routers/userRouter");
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use("/api", moviesRouter);
app.use("/api", userRouter);
app.use("/api/movies/upload", express.static("public/img/movies"));
app.use("/api/signUp/upload", express.static("public/img/user"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(port, () => {
  console.log(`connection set at port no ${port}`);
});
