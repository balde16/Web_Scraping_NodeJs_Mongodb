const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  url: { type: String, unique: true },
  status: String // OK / NOT OK
})
const CollectionURL = mongoose.model('URL', urlSchema)

module.exports = class UrlInsert {
  constructor(url) {
    this.url = url
    mongoose.connect(url, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
  }

  insertURL(url) {
    var urlToInsert = new CollectionURL()

    urlToInsert.url = url
    urlToInsert.status = 'NOT OK'
    urlToInsert.save(function(err) {
      if (err) {
        console.log(err)
      }
      console.log(`URL inserted : ${url}`)
    })
  }

  isURLDone() {
    CollectionURL.find({ type: 'NOT OK' }, (err, urls) => {
      if (err) {
        console.log('Not inserted')
      }
      console.log(urls)
      return urls
    })
  }

  async validateURL(url) {
    url.status('OK')
    await url.save()
    console.log('URL validated')
  }

  async invalidateURL(url) {
    url.status('NOT OK')
    await url.save()
    console.log('URL invalisated')
  }
}
