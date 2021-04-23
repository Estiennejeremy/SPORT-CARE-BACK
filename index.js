const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorhandler = require('errorhandler');
const app = express();
require('dotenv').config();

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

const usersRouter = require('./src/routes/users')
app.use('/users', usersRouter)

async function startServer() {    
  app.listen(process.env.PORT, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is ready !`);
  });
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

startServer();