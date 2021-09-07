//Require packages in the project
const express = require('express')
const mongoose = require('mongoose')
const exhbs = require('express-handlebars')
const URL_Shortener = require('./models/URL-Shortener')

//Setting: express
const app = express()
const PORT = 3000

//Setting: template engine
app.engine('hbs', exhbs({
  defaultLayout: 'main',
  extname: 'hbs'
}))
app.set('view engine', 'hbs')
//Setting: body-parser
app.use(express.urlencoded({ extended: true}))

//Setting: database
mongoose.connect('mongodb://localhost/URL-Shortener', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('Mongodb error')
})
db.once('open', () => {
  console.log('Mongodb is connected!')
})

// function [generate random char]
function pickChar(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function generateRandomChar() {
  //define things users want
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'

  //create array to store things users picked up
  //split轉換成array
  let collection = []
  collection = collection.concat(lowerCaseLetters.split(''))
  collection = collection.concat(upperCaseLetters.split(''))
  collection = collection.concat(numbers.split(''))

  //start generating password
  let password = ''
  for (let i = 1; i <= 5; i++) {
    password += pickChar(collection)
  }

  //return the generated password
  return password
}
// function [generate random char]

//Routes: index page
app.get('/', (req, res) => {
  res.render('index')
})

//Routes: catch index data
app.post('/', (req, res) => {
  const inputURL = req.body.URL
  const shortenCode = generateRandomChar()
  const outputURL = `http://localhost:${PORT}/${shortenCode}`
  URL_Shortener.create({
    inputURL,
    shortenCode,
  })
    .then(() => res.render('index', { outputURL, inputURL}))
    .catch(error => console.log(error))
})

//Routes: shorten page
app.get('/:shortenCode', (req, res) => {
  const shortenCode = req.params.shortenCode
  URL_Shortener.findOne({ shortenCode })
    .lean()
    .then(URL => res.redirect(URL.inputURL))
    .catch(error => console.log(error))
})

//Activate and listen on the Express server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})