const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    passwordHash: String,
    sudokus: [{
      type: Schema.Types.ObjectId,
      ref: 'Sudoku'
    }]
  },
  {
    versionKey: false
  }
)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id

    delete returnedObject.passwordHash
  }
})

const User = model('User', userSchema)

module.exports = User
