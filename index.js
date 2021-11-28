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
const jwt = require("jsonwebtoken");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

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
const coachsRouter = require("./src/routes/coachs");
const reportsRouter = require("./src/routes/dailyReports");
const cardiacRouter = require("./src/routes/cardiacRecords");
const trainingsRouter = require("./src/routes/trainings");
const sportsRouter = require("./src/routes/sports");
const conversationsRouter = require("./src/routes/conversations");
const messagesRouter = require("./src/routes/messages");

app.use("/users", usersRouter);
app.use("/coachs", coachsRouter);
app.use("/dailyReports", reportsRouter);
app.use("/cardiacRecords", cardiacRouter);
app.use("/trainings", trainingsRouter);
app.use("/sports", sportsRouter);
app.use("/conversations", conversationsRouter);
app.use("/messages", messagesRouter);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

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

module.exports = checkNotAuthenticated;

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.firstName });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");

  if (req.body.hasOwnProperty("email") && req.body.hasOwnProperty("password")) {
    const email = req.body.email;
    const password = req.body.password;
    user = await userModel.findOne({ email });
    // If user email exists in DB, ...
    if (user) {
      // And, if is valid password,
      if (bcrypt.compareSync(password, user.password)) {
        // We create a new brand jwt token
        const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
          expiresIn: "24h",
        });

        const {
          role,
          civility,
          _id,
          lastName,
          firstName,
          email,
          password,
          userDate,
          condition,
        } = user;

        res.status(200).send({
          role,
          civility,
          _id,
          lastName,
          firstName,
          email,
          password,
          userDate,
          condition,
          token,
        });
      } else {
        res.status(400).end(JSON.stringify({ message: "Wrong password" }));
      }
    } else {
      res.status(400).end(JSON.stringify({ message: "Wrong email" }));
    }
  } else {
    res.status(400).end(JSON.stringify({ message: "Invalid request" }));
  }
});

app.post("/logout", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.headers.hasOwnProperty("jwt")) {
    jwt.verify(req.headers.jwt, "RANDOM_TOKEN_SECRET", async (err, decoded) => {
      if (err) {
        res.status(400).end(JSON.stringify({ message: "Token expired" }));
        return;
      }
      if (decoded.userId.length === 24) {
        _id = decoded.userId;

        const user = await userModel.findOne({ _id });

        if (user) {
          const token = jwt.sign({ userId: _id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "1ms",
          });
          res.status(200).send({ jwt: token });
        } else {
          throw error;
        }
      } else {
        res.status(400).end(JSON.stringify({ message: "Wrong token" }));
      }
    });
  }
});

app.get("/s");

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//TO delete
const conditions = ["good", "critical", "satisfactory"];

//Creating One
app.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new userModel({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    birthdate: req.body.birthdate,
    userDate: new Date(),
    address: req.body.address,
    role: req.body.role,
    civility: req.body.civility,
    email: req.body.email,
    coachId: req.body.coachId,
    password: hashedPassword,
    condition: "good",
  });
  try {
    const newUser = await user.save();
    if (newUser) {
      const token = jwt.sign({ userId: newUser._id }, "RANDOM_TOKEN_SECRET", {
        expiresIn: "24h",
      });

      const {
        role,
        civility,
        _id,
        lastName,
        firstName,
        email,
        password,
        userDate,
        condition,
      } = newUser;

      res.status(200).send({
        role,
        civility,
        _id,
        lastName,
        firstName,
        email,
        password,
        userDate,
        condition,
        token,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

startServer();
