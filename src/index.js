require('dotenv').config()
require('./mongo')

const usersRouter = require('./controllers/users')
const sudokuRouter = require('./controllers/sudoku')
const loginRouter = require('./controllers/login')

const handleErrors = require('./middleware/handleErrors')
const notFound = require('./middleware/notFound')

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'server up and running' })
  console.log('Server succesfully responding to requests')
})

app.use('/api/login', loginRouter)
app.use('/api/sudoku', sudokuRouter)
app.use('/api/users', usersRouter)

app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT || 4000
const time = new Date().toLocaleTimeString([], { hourCycle: 'h24', hour: 'numeric', minute: 'numeric' })

app.listen(PORT, () => console.log(`Server running on port ${PORT} at ${time}`))
