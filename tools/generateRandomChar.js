function pickChar(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

module.exports = function () {
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