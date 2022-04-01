const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');

require("dotenv").config();
const jwt = require("jsonwebtoken");
var morgan = require('morgan')
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const authController = require("./src/controllers/auth.controller");

const mongoDbUrl =
  "mongodb+srv://sportCare:IcIhPJsvM1z60GnJ@sportcaredb.cpguk.mongodb.net/SportCareDB?retryWrites=true&w=majority";

mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var app = express();
app.use(morgan('dev'))

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const usersRouter = require("./src/routes/users.routes");
const coachsRouter = require("./src/routes/coachs.routes");
const reportsRouter = require("./src/routes/dailyReports.routes");
const cardiacRouter = require("./src/routes/cardiacRecords.routes");
const trainingsRouter = require("./src/routes/trainings.routes");
const sportsRouter = require("./src/routes/sports.routes");
const conversationsRouter = require("./src/routes/conversations.routes");
const messagesRouter = require("./src/routes/messages.routes");
const authentication = require("./src/middlewares/authentication");

app.use("/users", usersRouter);
app.use("/coachs", coachsRouter);
app.use("/dailyReports", reportsRouter);
app.use("/cardiacRecords", cardiacRouter);
app.use("/trainings", trainingsRouter);
app.use("/sports", sportsRouter);
app.use("/conversations", conversationsRouter);
app.use("/messages", messagesRouter);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));


app.post("/login", async (req, res, next) => {
  authController.login(req, res);
});

app.post("/logout", authentication.checkTokenMiddleware, async (req, res) => {
  authController.logout(req, res);
});


app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

//Creating One
app.post("/register", async (req, res) => {
  authController.register(req, res);
});

app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err })});


module.exports = app;
