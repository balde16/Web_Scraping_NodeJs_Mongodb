const puppeteer = require('puppeteer')
const ProfileScrapper = require('./Profile')
const UrlInsert = require('./models/urlInsert')
const ProfileInsert = require('./models/profileInsert')
const conf = require('./conf.json')
const mongoDBUrl = new UrlInsert(conf.url)
const mongoDBProfile = new ProfileInsert(conf.url)

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 800
  })
  await scrapper(browser)
  return 1
})()

accessProfilePage = async browser => {
  const { collection } = mongoDBUrl.collection
  let count = await collection.countDocuments({ status: 'NOT OK' })
  while (count > 0) {
    const { value } = await collection.findOneAndUpdate(
      { status: 'NOT OK' },
      { $set: { status: 'OK' } }
    )
    const { url } = value
    const page = await browser.newPage()
    const profilScrapper = new ProfileScrapper(`http://${url}`, page)
    const profile = await profilScrapper.getProfile()
    count++
    console.log(`${count} profiles récuppérés`)

    if (profile !== 0) mongoDBProfile.insertUser(profile)

    count = await collection.countDocuments({ status: 'NOT OK' })
  }
  return 1
}

const scrapper = async browser => {
  await accessProfilePage(browser)
  console.log('Done')
  await browser.close()
  return 1
}
