const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');

const app = express();

dotenv.config();

app.use(express.urlencoded({
  limit: "50mb",
  extended: true
}));

app.use(express.json({limit: "50mb"}));

app.use(express.json());

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  next();
});



//routes
const labelsRouter = require("./routes/labels");
app.use("/api",labelsRouter);

const classesRouter = require("./routes/classes");
app.use("/api",classesRouter);

const labelingRouter = require("./routes/labeling");
app.use("/api",labelingRouter);

const reviewRouter = require("./routes/review");
app.use("/api",reviewRouter);

const usersRouter = require("./routes/users");
app.use("/api",usersRouter);

const authRouter = require("./routes/auth");
app.use("/api",authRouter);

app.listen(4000, ()=>{
    console.log("server is listening to port 4000");
});



