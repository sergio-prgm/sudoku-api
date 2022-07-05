const { Schema, model } = require('mongoose')

const sudokuSchema = new Schema(
  {
    ref: {
      type: String,
      required: true
    },
    state: {
      current: String,
      isSolved: Boolean,
      time: Number
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
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
