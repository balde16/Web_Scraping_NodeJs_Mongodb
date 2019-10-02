const puppeteer = require('puppeteer')
const ProfileScrapper = require('./profileScrapper')
const DataInsert = require('./dataInsert')
const firstnames = require('./prenoms.json')
const mongoDB = new DataInsert('mongodb://localhost:27017/url')
const fs = require('fs')

linkArray = []
;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 800
  })
  await scrapper(page, browser)
})()

accessSearchPage = async page => {
  name = ''
  tabURL = []
  let i = 0
  for ({ name, done } of firstnames.prenoms) {
    console.log({ name, done })
    if (done) continue
    await page.goto(`https://www.qwant.com/?q=viadeo.com%20%2b${name}&t=web`)
    await page.waitForSelector('div.result__url > span')
    await autoScroll(page)

    const sel = 'div.result__url > span'
    const urls = await page.evaluate(sel => {
      let elements = Array.from(document.querySelectorAll(sel))
      let links = elements
        .filter(element => {
          if (element.textContent.includes('profile')) {
            return true
          }
          return
        })
        .map(element => element.textContent)
      return links
    }, sel)

    //insert in Mongo
    mongoDB.getURLToCrawl()
    urls.forEach(element => {
      mongoDB.insertURL(element)
    })
    tabURL.concat(urls)
    firstnames.prenoms[i].done = true
    await checkName(firstnames)
    i++
  }
  return tabURL
}

async function checkName(json) {
  fs.writeFile('prenoms.json', JSON.stringify(json), function(err) {
    if (err) throw err
  })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const scrapper = async (page, browser) => {
  let count = 0
  tableURL = await accessSearchPage(page)
  await asyncForEach(tableURL, async element => {
    if (element === 0) return 1
    const page = await browser.newPage()
    const profilScrapper = new ProfileScrapper(`http://${element}`, page)
    // await profilScrapper.getProfile()
    count++
    console.log(`${count} profiles récuppérés`)
  })
  console.log('Done')
  await browser.close()
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
