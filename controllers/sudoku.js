const sudokuRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')
const Sudoku = require('../models/Sudoku')
const User = require('../models/User')
const fs = require('fs')
// const easy = require('../assets/easy.json')
// const medium = require('../assets/medium.json')
// const hard = require('../assets/hard.json')

sudokuRouter.post('/', userExtractor, async (request, response, next) => {
  const {
    ref,
    current,
    time = 0,
    isSolved = false
  } = request.body

  const { userId } = request
  const user = await User.findById(userId)

  // const prevSudoku = await Sudoku.findOne({
  //   original,
  //   user: userId
  // })

  if (!ref) {
    return response.status(400).json({
      error: 'sudoku ref is missing'
    })
  }
  const updateSudoku = {
    ref,
    state: {
      current,
      time,
      isSolved
    },
    user: user.id
  }

  const filter = { ref, user: userId }

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

// Probably can be done with just one endPoint checking if userId*
sudokuRouter.get('/:dif/:num', userExtractor, async (request, response, next) => {
  const { dif, num } = request.params

  if (request.unAuthed) {
    const sudoku = generateSudoku(dif, num)

    if (sudoku !== undefined) {
      sudoku.push({ ref: `${dif}-${num}`, time: 0 })
      response.json(sudoku)
      return
    }
    return
  }

  const { userId } = request
  const result = await Sudoku.findOne({ ref: `${dif}-${num}`, user: userId })
  if (!result) {
    const sudoku = generateSudoku(dif, num)

    if (sudoku !== undefined) {
      sudoku.push({ ref: `${dif}-${num}`, time: 0 })
      response.json(sudoku)
      return
    }
    return
  }

  const sudoku = generateSudoku(dif, num)

  if (result.state.current) {
    const sudokuToRet = sudoku.map((cell, index) => ({ ...cell, value: Number(result.state.current[index]) }))
    sudokuToRet.push({ ref: `${dif}-${num}`, time: result.state.time })

    response.json(sudokuToRet)
    return
  }
  console.log('por si acaso')
  sudoku.push({ ref: `${dif}-${num}`, time: 0 })
  response.json(sudoku)
})

const easy = require('../assets/easy.json')
const medium = require('../assets/medium.json')
const hard = require('../assets/hard.json')

function generateSudoku (dif, num) {
  const result = []
  const data = fs.readFileSync(`./assets/${nCollection[dif]}.json`, { encoding: 'utf-8', flag: 'rs+' })

  const sudoku = JSON.parse(data)[num]

  if (sudoku) {
    sudoku
      .split('')
      .forEach((value, index) => {
        const cell = new Cell(index, Number(value))
        const row = cell.row
        const col = cell.col
        result.push({ ...cell, row, col })
      })

    return result
  }
}

const nCollection = {
  e: 'easy',
  m: 'medium',
  h: 'hard'
}
const collection = {
  e: easy,
  m: medium,
  h: hard
}

class Cell {
  constructor (index, value) {
    this.index = index
    this.value = value
    this.changed = false
    this.isCorrect = true
    this.readOnly = Boolean(value)
  }

  get row () {
    return Math.floor(this.index / 9)
  }

  get col () {
    return Math.floor(this.index % 9)
  }
}

module.exports = sudokuRouter
