const { Schema, model } = require('mongoose')

const sudokuSchema = new Schema(
  {
    original: {
      type: String,
      required: true
    },
    state: {
      currentState: String,
      isSolved: Boolean
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

sudokuSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
  }
})

const Sudoku = model('Sudoku', sudokuSchema)

module.exports = Sudoku
