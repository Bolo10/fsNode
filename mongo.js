const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const personSchema = new mongoose.Schema({

  name: String,
  number: String

})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  console.log(process.argv)
  process.exit(1)
}



  const password = process.argv[2]

//const url =  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`
const url =
  `mongodb+srv://adminvoucher:${password}@voucher.9bpcw.mongodb.net/test`

mongoose.connect(url)

const nombreIn = process.argv[3]
const phoneIn = process.argv[4]
const person = new Person({

  name: nombreIn,
  number: phoneIn
})
if(process.argv.length === 5){
person.save().then(result => {

  console.log(`added ${result.name} number ${result.number} to phonebook!`)
  mongoose.connection.close()
})
process.exit(1)
}


if(process.argv.length === 3){
  Person
  .find({})
  .then(persons=> {
    console.log('phonebook:')
    persons.forEach(person => {
      
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
}
