const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/users");

//Getting all
router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    console.log(users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting One
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

//Getting all atheletes for a coach
router.get("/coach/:id", getUser, (req, res) => {
  try {
    res.json(res.athletes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }   
});

//Creating One
/*
router.post ('/register', checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.Password, 10)
  const user = new userModel ({
    Last_name: req.body.Last_name,
    First_name: req.body.First_name,
    Birthdate: req.body.Birthdate,
    address: req.body.address,
    Role: req.body.Role,
    Civility: req.body.Civility,
    email: req.body.email,
    Password: hashedPassword
  })
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
*/

//Connection
router.post("/login", async (req, res) => {
  console.log(req.body);
  // const hashedPassword = await bcrypt.hash(req.body.password, 10);
  // const user = new user_model({
  //   login: req.body.email,
  //   password: hashedPassword,
  // });
  // try {
  //   //Check if user exist un password il true
  // } catch (err) {
  //   res.status(400).json({ message: err.message });
  // }
});

//Updating One
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.firstName != null) {
    res.user.firstName = req.body.firstName;
  }
  if (req.body.lastName != null) {
    res.user.lastName = req.body.lastName;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.birthdate != null) {
    res.user.birthdate = req.body.birthdate;
  }
  if (req.body.address != null) {
    res.user.address = req.body.address;
  }
  if (req.body.role != null) {
    res.user.role = req.body.role;
  }
  if (req.body.civility != null) {
    res.user.civility = req.body.civility;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.condition != null) {
    res.user.condition = req.body.condition;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Deleting One
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "User deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await userModel.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

async function getCoachAthletes (req, res, next) {
  let athletes
  try {
    athletes = await userModel.find({'coachId': req.params.coachId})
    if (reports == null) {
      return res.status(404).json({ message: 'Cannot find athletes'})
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.athletes = athletes
  next()
}

module.exports = router;
