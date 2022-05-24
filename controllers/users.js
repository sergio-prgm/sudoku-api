const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, password } = body

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json(error)
  }
})

//
usersRouter.get('/:id', async (request, response) => {
  const { id } = request.params

  const user = await User.find({ _id: id }).populate('sudokus', {
    original: 1,
    state: 1
  })
  response.json(user)
})

module.exports = usersRouter
