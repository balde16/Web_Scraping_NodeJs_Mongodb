//url insert give profiles missnaming
const UrlInsert = require('./models/profileInsert')
const express = require('express')
const conf = require('./conf.json')

const profileSearch = new UrlInsert(conf.url)

const app = express()
const port = process.env.PORT || '8000'

app.get('/', async (req, res) => {
  const langues = await profileSearch.getLangues()
  res.status(200).send('Hello')
})

app.get('/getLangues', async (req, res) => {
  const langues = await profileSearch.getLangues()
  res.status(200).send({ body: langues, size: langues.length })
})

app.get('/getCompetences', async (req, res) => {
  const competences = await profileSearch.getcompetences()
  res.status(200).send({ body: competences, size: competences.length })
})

app.get('/getParcoursPro', async (req, res) => {
  const parcours = await profileSearch.getParcoursPro()
  res.status(200).send({ body: parcours, size: parcours.length })
})

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`)
})
