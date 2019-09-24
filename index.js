const puppeteer = require('puppeteer')
const config = require('./conf.json')

;(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await connect(page)
  await accessSearchPage(page)
  accessSchool()
  const profil = await retrieveProfil()
  console.log(profil)
  await browser.close()
})()

// connect directly to viadeo (need a page from puppeter)
connect = async page => {
  await page.goto('https://fr.viadeo.com/fr/signin')
  await page.type(
    '#signin > div > main > form > div:nth-child(2) > input[type=text]',
    config.email
  )
  await page.type(
    '#signin > div > main > form > div:nth-child(3) > input[type=password]',
    config.pass
  )

  await page.click('#signin > div > main > form > button')
  return 1
}

accessSearchPage = async page => {
  //TODO
  city = 'Paris'
  await page.waitForSelector(
    '#newsFeed > div.news-feed__usages.ptm.pbm.cf > ul > li:nth-child(2) > article > div > div.bx.usage__box.bd > div.h-basic.pll.prl > p > a'
  )
  await page.goto(
    `http://fr.viadeo.com/fr/trombinoscope/choixecole/?town=${city}&countrySchool=fr`
  )
  await page.waitForSelector(
    '#viadeocontent > div.gu.gu-3of4.pvxl > div.mbm > div:nth-child(1) > a'
  )
  await page.click(
    '#viadeocontent > div.gu.gu-3of4.pvxl > div.mbm > div:nth-child(1) > a'
  )

  await page.waitForSelector(
    '#viadeocontent > div.gu.gu-3of4.pvxl > div.mbm > div:nth-child(2) > div.tar > a:nth-child(1)'
  )
  await page.click(
    '#viadeocontent > div.gu.gu-3of4.pvxl > div.mbm > div:nth-child(2) > div.tar > a:nth-child(1)'
  )

  await page.waitForSelector(
    '#viadeocontent > div.mainlayout > div.main > table:nth-child(10) > tbody > tr:nth-child(1) > td:nth-child(2) > div > div:nth-child(1) > a'
  )
  await page.click(
    '#viadeocontent > div.mainlayout > div.main > table:nth-child(10) > tbody > tr:nth-child(1) > td:nth-child(2) > div > div:nth-child(1) > a'
  )

  await page.screenshot({ path: 'test-screenshot.png' })
}

accessSchool = () => {
  //TODO
}

retrieveProfil = async () => {
  return 'coucou TODO'
}
