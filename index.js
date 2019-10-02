const puppeteer = require("puppeteer");
const ProfileScrapper = require("./profileScrapper");
async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
linkArray = [];
(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800
  });
  await scrapper(page);
  await browser.close();
})();

accessSearchPage = async page => {
  //TODO
  name = "Arnaud";

  await page.goto(`https://www.qwant.com/?q=viadeo.com%20%2b${name}&t=web`);
  await page.waitForSelector("div.result__url > span");
  await autoScroll(page);
  const sel = "div.result__url > span";
  const langues = await page.evaluate(sel => {
    let elements = Array.from(document.querySelectorAll(sel));

    let links = elements.map(element => {
      return element.textContent.includes("profile") ? element.textContent : 0;
    });
    return links;
  }, sel);
  return langues;
};

scrapper = async page => {
  s = await accessSearchPage(page);
  for (const link of s) {
    url = "https://" + link;
    if (link !== 0) {
      const profil = new ProfileScrapper(url, page);
      await profil.getProfile();
    }
  }
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
