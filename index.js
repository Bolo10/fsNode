require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const PORT = process.env.PORT
const Person = require('./models/person');
const {errorHandler} = require('./middlewares/handleError')
const assignId= (req, res, next) =>{
  req.id = uuidv4()
  next()
} 
morgan.token('id', (req)=>req.id)
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(assignId)
app.use(morgan(':method :url :response-time :body'))
app.use(cors())

app.use(express.static('build'))
app.use(express.json())


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
app.get('/info', (req, res) => {
  const date = new Date()
  const length = persons.length

  res.send(`<h3>People has info for ${length} people</h3>
            <h3>${date}</h3>`)
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (req, res, next) => {
  const {name, number} = req.body

  if (!name || !number) {
    return res.status(400).json({ 
      error: 'content missing' 
    })
  }
  const person = new Person({
    name,
    number,
  })

  person.save().then(result =>{
    res.json(result)
  })
  .catch(error => {
    next(error)
  })

  
})

app.get('/api/persons',  async (req, res) => {
   await Person
    .find({})
    .then(persons => {res.json(persons)})
    

})




app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      return res.status(204).end()
    })
    
})

app.get('/api/persons/:id', (req, res, next) => {
  
  
  Person.findById(req.params.id)
    .then(person => res.json(person))
    .catch(error =>{
      console.log('emntra')
      next(error)
    })

  })


app.put('/api/persons/:id', (req, res, next) => {
    const {name, number} = req.body
    Person.findByIdAndUpdate(req.params.id, {name: name, number: number})
      .then(result => {
        return res.status(200).json(result)
      })
      
})

app.use(errorHandler)
    
app.listen(PORT, () => {
  console.log(`******************************`)
  console.log(`Server running on port ${PORT}`)
})