const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
const CollectionProfile = mongoose.model('Profile', profileSchema)

module.exports = class UrlInsert {
  constructor(url) {
    this.url = url
    this.collection = new CollectionProfile()
    mongoose.connect(url, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
  }

  async getLangues() {
    const res = {}
    const listLangues = await CollectionProfile.distinct('Langues.name')
    for (let index = 0; index < listLangues.length; index++) {
      res[listLangues[index]] = await CollectionProfile.countDocuments({
        'Langues.name': listLangues[index]
      })
    }
    return res
  }

  async getParcoursPro() {
    const res = {}
    const listParcours = await CollectionProfile.distinct(
      'ParcoursPro.description'
    )
    return listParcours.filter(parcours => {
      if (
        parcours &&
        parcours !== null &&
        parcours !== '' &&
        parcours !== undefined
      ) {
        return parcours.trim()
      }
    })
    return res
  }

  async getcompetences() {
    const listCompetences = await CollectionProfile.distinct('Competences')
    return listCompetences.filter(comp => {
      if (comp !== null && comp !== '' && comp !== undefined) return comp.trim()
    })
  }

  insertUser(profile) {
    var profileToInsert = new CollectionProfile(profile)
    console.log(profile)
    profileToInsert.save(function(err) {
      if (err) {
        console.log(err)
      }
      console.log(`Profile inserted : ${profile.Nom} ${profile.Prenom}`)
    })
  }
}
