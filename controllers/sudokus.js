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

  // const prevSudoku = await Sudoku.findOne({
  //   original,
  //   user: userId
  // })

  if (!original) {
    return response.status(400).json({
      error: 'original sudoku is missing'
    })
  }
  const updateSudoku = {
    original,
    state: {
      currentState,
      time,
      isSolved
    },
    user: user.id
  }

  const filter = { original, user: userId }

  try {
    const savedSudoku = await Sudoku.findOneAndUpdate(
      filter,
      {
        $set: updateSudoku,
        $setOnInsert: Sudoku._id
      },
      {
        new: true,
        upsert: true,
        rawResult: true
      })

    if (savedSudoku.lastErrorObject.updatedExisting) {
      console.log('updated sudoku', savedSudoku)
      response.status(200).json(savedSudoku)
    } else {
      await User.findByIdAndUpdate(
        { _id: userId },
        { $addToSet: { sudokus: savedSudoku.value.id } },
        { new: true }
      )
      console.log('created sudoku', savedSudoku)
      response.status(201).json(savedSudoku)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = sudokusRouter
