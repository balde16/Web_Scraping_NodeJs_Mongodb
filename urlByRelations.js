const mongoose = require("mongoose")

mongoose.connect("mongodb://3.9.169.163:27017/url", { useNewUrlParser: true })
var db = mongoose.connection

db.on("error", console.error.bind(console, "Connection error: "))
db.once("open", function(callback) {
  //The code in this asynchronous callback block is executed after connecting to MongoDB.
  console.log("Successfully connected to MongoDB.")
})

var Schema = mongoose.Schema

const profileSchema = new Schema({
  Nom: { type: String, required: false, unique: false },
  Prenom: { type: String, required: false, unique: false },
  Photo: { type: String, required: false, unique: false },
  LienProfil: { type: String, required: false, unique: true },
  Description: { type: String, required: false, unique: false },
  ParcoursPro: [
    {
      description: { type: String, required: false, unique: false },
      duration: { type: String, required: false, unique: false }
    }
  ],
  Competences: [{ type: String, required: false, unique: false }],
  Langues: [
    {
      name: { type: String, required: false, unique: false },
      level: { type: String, required: false, unique: false }
    }
  ],
  Interet: [{ type: String, required: false, unique: false }],
  NbContacts: { type: String, required: false, unique: false },
  Relation: [
    {
      link: { type: String, required: false, unique: false },
      name: { type: String, required: false, unique: false }
    }
  ]
})
const CollectionProfile = mongoose.model("Profile", profileSchema)

const urlSchema = new Schema({
  url: { type: String, unique: true },
  status: String // OK / NOT OK
})
const CollectionURL = mongoose.model("URL", urlSchema)

readRelations = async () => {
  await CollectionProfile.find({})
    .skip(22000)
    .limit(23000)
    .select({ Relation: 1 })
    .exec(async (err, profiles) => {
      try {
        for (const profile of profiles) {
          for (let i = 0; i < profile.Relation.length; i++) {
            const url = profile.Relation[i].link
            await pushName(url)
              .then(() => console.log("Push NAme is DOne ------------"))
              .catch(error => console.log(error))
          }
        }
      } catch (err) {
        console.log(err)
      }
    })
}

pushName = async url => {
  let urlToInsert = new CollectionURL()
  urlToInsert.url = url
  urlToInsert.status = "NOT OK"
  await urlToInsert.save(function(err) {
    if (err) {
      console.log(err)
    }
    console.log(`URL inserted : ${url}`)
  })
}

readRelations()
  .then(() => console.log("done"))
  .catch(error => console.log(error))
