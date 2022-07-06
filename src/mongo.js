const mongoose = require('mongoose')

// mongoose.connect('mongodb://mongo')
mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('*** Connected succesfully to db ***')
  })
  .catch((error) => {
    console.error('!!! Unable to connect to db !!!', error)
  })

process.on('uncaughtException', error => {
  console.log(error)
  mongoose.disconnect()
})
