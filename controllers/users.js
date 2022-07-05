const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const userExtractor = require('../middleware/userExtractor')

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, password } = body

  const passwordHash = await bcrypt.hash(password, 10)

  console.log(username, password)
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

usersRouter.get('/', userExtractor, async (request, response, next) => {
  const { userId } = request

  try {
    const user = await User.find({ _id: userId }).populate('sudokus', {
      ref: 1,
      state: 1
    })
    response.json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
