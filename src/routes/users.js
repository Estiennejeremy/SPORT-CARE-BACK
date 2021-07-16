const express = require ('express')
const router = express.Router()
const bcrypt = require("bcrypt");
const user_model = require('../models/users')
//const report_model = require('../models/daily_report')


//Getting all
router.get('/', async (req, res) => {
  try {
    const users = await user_model.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


//Getting One
router.get ('/:id', getUser, (req, res) => {
  res.json(res.user)
})


//router.get ('register')

//Creating One
/*
router.post ('/register', checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.Password, 10)
  const user = new user_model ({
    Last_name: req.body.Last_name,
    First_name: req.body.First_name,
    Birthdate: req.body.Birthdate,
    Adress: req.body.Adress,
    Role: req.body.Role,
    Civility: req.body.Civility,
    Email: req.body.Email,
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
router.post ('/login', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.Password, 10)
  const user = new user_model ({
    Login: req.body.Email,
    Password: hashedPassword
  })
  try {
    //Check if user exist un password il true
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})




//Updating One
router.patch ('/:id', getUser, async (req, res) => {
  if (req.body.First_name != null) {
    res.user.First_name = req.body.First_name
  }
  if (req.body.Last_name != null) {
    res.user.Last_name = req.body.Last_name
  }
  if (req.body.Mail != null) {
    res.user.Email = req.body.Mail
  }
  if (req.body.Birthdate != null) {
    res.user.Birthdate = req.body.Birthdate
  }
  if (req.body.Adresse != null) {
    res.user.Adresse = req.body.Adresse
  }
  if (req.body.Role != null) {
    res.user.Role = req.body.Role
  }
  if (req.body.Civility != null) {
    res.user.Civility = req.body.Civility
  }
  if (req.body.Password != null) {
    res.user.Password = req.body.Password
  }

  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Deleting One
router.delete ('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json ({ message: 'User deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getUser (req, res, next) {
  let user
  try {
    user = await user_model.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user'})
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.user = user
  next()
}


module.exports = router
