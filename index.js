require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Sudoku API</h1>')
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
