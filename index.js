const puppeteer = require("puppeteer")
const ProfileScrapper = require("./profileScrapper")
const firstnames = require("./prenoms.json")
async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
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
  //TODO
  name = ""
  tabURL = []
  for (firstname of firstnames.prenoms) {
    name = firstname
    console.log(name)
    await page.goto(`https://www.qwant.com/?q=viadeo.com%20%2b${name}&t=web`)
    await page.waitForSelector("div.result__url > span")
    await autoScroll(page)
    const sel = "div.result__url > span"
    const urls = await page.evaluate(sel => {
      let elements = Array.from(document.querySelectorAll(sel))

      let links = elements.filter(element => {
        if(element.textContent.includes("profile")) {
         return true  
        }
        return
      }).map(element => element.textContent)
      return links
    }, sel)
    // INSERT MONGO
    tabURL.concat(urls)
    console.log(urls)
    console.log(tabURL.length)
  }
  return tabURL
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
  console.log("Done")
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
