const express = require ('express')
const router = express.Router()
const user_model = require('../models/users')


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

//Creating One
router.post ('/', async (req, res) => {
  const user = new user_model ({
    Last_name: req.body.Last_name,
    First_name: req.body.First_name,
    Birthdate: req.body.Birthdate,
    Adress: req.body.Adress,
    Role: req.body.Role,
    Civility: req.body.Civility,
    Mail: req.body.Mail,
    Password: req.body.Password
  })
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
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
    res.user.Mail = req.body.Mail
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
