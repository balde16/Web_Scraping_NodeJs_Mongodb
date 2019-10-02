const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  url: String,
  status: String // OK / NOT OK
})
const CollectionURL = mongoose.model('URL', urlSchema)

module.exports = class DataInsert {
  constructor(url) {
    this.url = url
    mongoose.connect(url, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
  }

  insertURL(url) {
    var urlToInsert = new CollectionURL()

    urlToInsert.url = url
    urlToInsert.status = 'OK'

    urlToInsert.save(function(err) {
      if (err) {
        console.log(err)
      }
      console.log('URL inserted')
    })
  }
}
