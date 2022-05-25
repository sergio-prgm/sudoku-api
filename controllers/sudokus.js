const sudokusRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')
const Sudoku = require('../models/Sudoku')
const User = require('../models/User')

sudokusRouter.post('/', userExtractor, async (request, response, next) => {
  const {
    original,
    currentState = original,
    time = 0,
    isSolved = false
  } = request.body

  const { userId } = request
  const user = await User.findById(userId)

  const prevSudoku = await Sudoku.findOne({
    original,
    user: userId
  })

  if (!original) {
    return response.status(400).json({
      error: 'original sudoku is missing'
    })
  }
  const newSudoku = new Sudoku({
    original,
    state: {
      currentState,
      time,
      isSolved
    },
    user: user._id
  })

  if (prevSudoku) {
    response.json('sudoku already in use')
    // hacer que actualice (o buscar método que guarde o actualice mágicamente)
  } else {
    try {
      const savedSudoku = await newSudoku.save()
      user.sudokus = user.sudokus.concat(savedSudoku._id)
      await user.save()
      response.json(savedSudoku)
    } catch (error) {
      next(error)
    }
  }
})

module.exports = sudokusRouter
