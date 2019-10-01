const puppeteer = require("puppeteer");
const config = require("./conf.json");
const ProfileScrapper = require("./profileScrapper");
async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
linkArray = [];
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await connect(page);
  await accessSearchPage(page);
  // await accessUserProfil(page)
  // const profil = await retrieveProfil()
  // console.log(profil)
  await secondPage(page);
  await scrapper(page);
  await browser.close();
})();
// connect directly to viadeo (need a page from puppeter)
connect = async page => {
  page.on("load", () => console.log("Loaded: " + page.url()));
  await page.goto("https://fr.viadeo.com/fr/signin");
  await page.type(
    "#signin > div > main > form > div:nth-child(2) > input[type=text]",
    config.email
  );
  await page.type(
    "#signin > div > main > form > div:nth-child(3) > input[type=password]",
    config.pass
  );
  await page.click("button");
  await page.waitForNavigation();
};
accessSearchPage = async page => {
  //TODO
  name = "Arnaud";

  await page.goto(`https://www.viadeo.com/fr/search/#/?q=${name}`);
  await page.waitForSelector(
    "#ember674 > div > div.gu.gu-last.gu-m-1of1.unified-search__profiles > div.bx.pbxs"
  );
  hrefs = await page.$$eval("h2 > a", as => as.map(a => a.href));
  for (let href of hrefs) {
    // open the page
    try {
      if (!href.includes("company")) {
        linkArray.push(href);
      }
      // const profil = new ProfileScrapper(href, page)
      // await profil.getProfile()
    } catch (error) {
      console.log(error);
      console.log("failed to open the page: ", href);
    }
  }
};

secondPage = async page => {
  await page.goto(`https://www.viadeo.com/fr/search/#/?page=2&q=${name}`);

  await timeout(5000);

  secondHrefs = await page.$$eval("h2 > a", as => as.map(a => a.href));
  for (let href of secondHrefs) {
    // open the page
    try {
      if (!href.includes("company")) {
        linkArray.push(href);
      }
      // const profil = new ProfileScrapper(href, page)
      // profil.getProfile()
    } catch (error) {
      console.log(error);
      console.log("failed to open the page: ", href);
    }
  }
};

scrapper = async page => {
  for (const link of linkArray) {
    const profil = new ProfileScrapper(link, page);
    await profil.getProfile();
  }
};
