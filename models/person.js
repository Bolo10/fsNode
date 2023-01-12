const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const url = process.env.MONGODB_URI
//const autoIncrement = require('mongoose-plugin-autoinc')
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    //id_person: Number,
    name: String,
    number: String
  
  }, { collection: 'persons' })
  personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
//personSchema.plugin(autoIncrement.plugin, { model: 'Person', field: 'id_person' });
module.exports = mongoose.model('Person', personSchema)