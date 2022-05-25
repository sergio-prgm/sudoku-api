require('dotenv').config()
require('./mongo')

const usersRouter = require('./controllers/users')
const sudokusRouter = require('./controllers/sudokus')
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
app.use('/api/sudokus', sudokusRouter)
app.use('/api/users', usersRouter)

app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
