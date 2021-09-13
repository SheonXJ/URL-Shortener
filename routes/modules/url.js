// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
//引用 model URL-Shortener
const URL_Shortener = require('../../models/URL-Shortener')
//引用 generateRandomChar function
const generateRandomChar = require('../../tools/generateRandomChar')
//引用 checkURL function
const checkURL = require('../../tools/checkURL')

//Routes: catch index shorten data
router.post('/', (req, res) => {
  const inputURL = req.body.URL
  let statusURL = ''
  //check: 'inputURL' is valid or not
  if (!checkURL(inputURL)) {
    statusURL = 'invalid'
    return res.render('index', { statusURL })
  }
  URL_Shortener.findOne({ inputURL }).lean().then(URL => {
    //check: does not exist same 'inputURL' data
    if (!URL) {
      let shortenCode = generateRandomChar()
      const outputURL = `${req.protocol}://${req.get('host')}/${shortenCode}`
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
      const outputURL = `${req.protocol}://${req.get('host')}/${URL.shortenCode}`
      statusURL = 'already'
      res.render('index', { outputURL, statusURL })
    }
  })
    .catch(error => console.log(error))
})

//Routes: shorten page
router.get('/:shortenCode', (req, res) => {
  const shortenCode = req.params.shortenCode
  URL_Shortener.findOne({ shortenCode })
    .lean()
    .then(URL => res.redirect(URL.inputURL))
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router