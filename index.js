const express = require('express')
const app = express()
const morgan = require('morgan')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Arto Hellas2",
    number: "040-123456",
  },
  {
    id: 3,
    name: "Arto Hellas3",
    number: "040-123456",
  },
]
const assignId= (req, res, next) =>{
  req.id = uuidv4()
  next()
} 
morgan.token('id', (req)=>req.id)
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(assignId)
app.use(morgan(':method :url :response-time :body'))
app.use(cors())
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

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body

  if (!name || !number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  const unique = persons.some(person => person.name === name)
  if(unique){
    return response.status(400).json({ 
      error: `name ${name} already exist and must be unique` 
    })
  }
  const person = {
    name,
    number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT ||  3001
app.listen(PORT, () => {
  console.log(`******************************`)
  console.log(`Server running on port ${PORT}`)
})