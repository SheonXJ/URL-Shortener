//Require packages in the project
const express = require('express')
const mongoose = require('mongoose')
const exhbs = require('express-handlebars')
const URL_Shortener = require('./models/URL-Shortener')
const generateRandomChar = require('./tools/generateRandomChar')
const checkURL = require('./tools/checkURL')

//Setting: express
const app = express()
const PORT = 3000

//Setting: template engine
app.engine('hbs', exhbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')
//Setting: body-parser
app.use(express.urlencoded({ extended: true}))
//Setting: static files
app.use(express.static('public'))

//Setting: database
mongoose.connect('mongodb://localhost/URL-Shortener', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('Mongodb error')
})
db.once('open', () => {
  console.log('Mongodb is connected!')
})

//Routes: index page
app.get('/', (req, res) => {
  res.render('index')
})

//Routes: catch index shorten data
app.post('/', (req, res) => {
  const inputURL = req.body.URL
  let statusURL = ''
  //check: 'inputURL' is valid or not
  if (!checkURL(inputURL)) {
    statusURL = 'invalid'
    return res.render('index', { statusURL })
  }
  URL_Shortener.findOne({inputURL}).lean().then(URL => {
    //check: does not exist same 'inputURL' data
    if (!URL) {
      let shortenCode = generateRandomChar()
      const outputURL = `http://localhost:${PORT}/${shortenCode}`
      URL_Shortener.find()
        .lean()
        .then(URLs => {
          //check: does not exist same 'shortenCode' data
          while (URLs.find(URL => URL.shortenCode === shortenCode)) {
            shortenCode = generateRandomChar()
          }
          URL_Shortener.create({ inputURL, shortenCode })
            .then(() => {
              statusURL = 'valid'
              res.render('index', { outputURL, statusURL })
            })
        })
    } else {
      const outputURL = `http://localhost:${PORT}/${URL.shortenCode}`
      statusURL = 'already'
      res.render('index', { outputURL, statusURL})
    }
  })
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