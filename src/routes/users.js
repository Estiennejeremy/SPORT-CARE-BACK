const express = require ('express')
const router = express.Router()
const user_model = require('../models/users')


//Test
//Getting all
router.get('/', async (req, res) => {
  try {
    const users = await user_model.findAll()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//Getting One
router.get ('/:id', (req, res) => {
  res.send('Hello Word')
})

//Creating One
router.post ('/', (req, res) => {
    
})

//Updating One
router.patch ('/', (req, res) => {
    
})

//Deleting One
router.delete ('/:id', (req, res) => {
    
})

module.exports = router
