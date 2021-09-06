//load mongoose
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create Schema
const URL_Shortener_Schema = new Schema({
  inputURL: {
    type: String,
    required: true
  },
  outputURL: {
    type: String,
    required: false
  }
})

//output model
module.exports = mongoose.model('URL_Shortener', URL_Shortener_Schema)