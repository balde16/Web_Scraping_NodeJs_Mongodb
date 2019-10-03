const puppeteer = require('puppeteer')
const UrlInsert = require('./models/urlInsert')
const NameInsert = require('./models/nameInsert')
const conf = require('./conf.json')
const mongoDB = new UrlInsert(conf.url)
const mongoDBname = new NameInsert(conf.url)

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 800
  })
  await scrapper(page, browser)
  return 1
})()

accessSearchPage = async page => {
  const { collection } = mongoDBname.collection
  let count = await collection.countDocuments({ done: false })
  while (count > 0) {
    const { value } = await collection.findOneAndUpdate(
      { done: false },
      { $set: { done: true } }
    )
    const { name } = value
    await page.goto(`https://www.qwant.com/?q=viadeo.com%20%2b${name}&t=web`)
    try {
      await page.waitFor("div.result__url > span", { timeout: 1000 })
      await autoScroll(page)
      const sel = "div.result__url > span"
      const urls = await page.evaluate(sel => {
        let elements = Array.from(document.querySelectorAll(sel))
        let links = elements
          .filter(element => {
            if (element.textContent.includes("profile")) {
              return true
            }
            return
          })
          .map(element => element.textContent)
        return links
      }, sel)

      urls.forEach(element => {
        mongoDB.insertURL(element)
      })
      count = await collection.countDocuments({ done: false })
    } catch (e) {
      console.error(e)
      const { value } = await collection.findOneAndUpdate(
        { done: false },
        { $set: { done: true } }
      )
    }
  }
  return 1
}

const scrapper = async (page, browser) => {
  await mongoDBname.insertAllName()
  await accessSearchPage(page)
  console.log('Done')
  await browser.close()
  return 1
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0
      var distance = 100
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  })
}
