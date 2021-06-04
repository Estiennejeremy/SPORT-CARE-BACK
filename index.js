if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override')
const passport = require('passport');
const bcrypt = require ('bcrypt');
const flash = require ('express-flash')
const cors = require('cors');
const errorhandler = require('errorhandler');
require('dotenv').config();
const app = express();
const usersRouter = require('./src/routes/users');
const user_model = require('./src/models/users');

const initializePassport = require ('./passport-config')
initializePassport (
  passport,
)

app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(express.json())
//app.use(session({ secret: process.env.SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error)=> console.error(error))
db.once('open', (error)=> console.log('Connected to database'))

app.use ('/users', usersRouter)
app.set('views-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use (flash())
app.use (session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use (passport.initialize())
app.use (passport.session())
app.use (methodOverride('_method'))



async function startServer() {    
  app.listen(process.env.PORT, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is ready !`);
  });
}


function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect ('/login')
}

function checkNotAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect ('/')
  }
  next()
}


/*
app.get('/', (req, res) => {
  //res.send('Hello World! ')
  res.render('index.ejs', { name : req.user.First_name })
})
*/

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.First_name })
})


app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})



app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

//Creating One
app.post ('/register', checkNotAuthenticated, async (req, res) => {
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


startServer();