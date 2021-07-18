const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const cors = require("cors");
const errorhandler = require("errorhandler");
require("dotenv").config();
const app = express();


const initializePassport = require("./passport-config");
initializePassport(passport);

app.get("/status", (req, res) => {
  res.status(200).end();
});
app.head("/status", (req, res) => {
  res.status(200).end();
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
//app.use(session({ secret: process.env.SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
const mongoDbUrl =
  "mongodb+srv://sportCare:IcIhPJsvM1z60GnJ@sportcaredb.cpguk.mongodb.net/SportCareDB?retryWrites=true&w=majority";
mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", (error) => console.log("Connected to database"));


const userModel = require("./src/models/users");

const usersRouter = require("./src/routes/users");
const reportsRouter = require("./src/routes/dailyReports");
const trainingsRouter = require("./src/routes/trainings");
const sportsRouter = require("./src/routes/sports");

app.use("/users", usersRouter);
app.use("/dailyReports", reportsRouter);
app.use("/trainings", trainingsRouter);
app.use("/sports", sportsRouter);


app.set("views-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
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


async function startServer() {
  app.listen(process.env.PORT, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is ready !`);
  });
}


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  next();
}


app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.firstName });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

/*
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
*/

app.post('/login', async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new userModel({
    email: req.body.email,
    password: hashedPassword,
  });
  passport.authenticate('local', function(err, user, info) {
    if (err) { res.status(400).json(err); }
    if (!user) { res.status(401).json(message: "user not find!"); }
    req.logIn(user, function(err) {
      if (err) { res.status(400).json(err); }
      res.status(201).json(true);
    });
  })(req, res, next);
});



app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

//Creating One
app.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new userModel({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    birthdate: req.body.birthdate,
    adress: req.body.adress,
    role: req.body.role,
    civility: req.body.civility,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

startServer();
