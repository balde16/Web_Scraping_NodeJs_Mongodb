const mongoose = require('mongoose')
const firstnames = require('../data/prenoms.json')
const Schema = mongoose.Schema

const nameSchema = new Schema({
  name: { type: String, unique: true },
  status: Boolean
})
const CollectionName = mongoose.model('Name', nameSchema)

module.exports = class NameInsert {
  constructor(url) {
    this.collection = new CollectionName()
    this.url = url
    mongoose.connect(url, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
  }

  async insertAllName() {
    const docs = []
    try {
      await firstnames.prenoms.forEach(async person => {
        await docs.push({ name: person.name, done: false })
      })
      await CollectionName.collection.insertMany(docs, e => {
        if (!e) {
          console.log('Names are now Inserted')
        } else {
          console.log('Names are Already Inserted')
        }
      })
    } catch (e) {
      console.log('Names are Already Inserted')
    }
    return 1
  }

  async checkName(name) {
    await CollectionName.find({ name }, (err, names) => {
      if (err) {
        console.log(err)
      }
      console.log(names)
      return names
    })
  }

  async getName(person) {
    person.done = true
    await person.save()
  }
}
