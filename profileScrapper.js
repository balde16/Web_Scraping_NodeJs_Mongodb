module.exports = class ProfileScrapper {
  constructor(url, page) {
    this.url = url
    this.page = page
  }

  async getName(page) {
    const textContent = await page.evaluate(
      () =>
        document.querySelector(
          '#ember653 > div.profile-main-container > section > div > div.profile-overview.gu.gu-m-1of1 > h1'
        ).textContent
    )
    var fullName = textContent.split(' '),
      firstName = fullName[0],
      lastName = fullName[fullName.length - 1]
    return { firstName, lastName }
  }

  async getPhoto(page) {
    const photo = await page.$$eval(
      '#public-profile > div > div > div.bx.tac-m.ptn.header.mbs > div.gr.grsxs.fluid-container > div.gu.gu-1of5.gu-m-1of1.header-content > div > img',
      imgs => imgs.map(img => img.getAttribute('src'))
    )

    return { photo: photo[0] }
  }

  async getDesc(page) {
    const desc = await page.evaluate(
      () =>
        document.querySelector(
          '#public-profile > div > div > div.bx.tac-m.ptn.header.mbs > div.gr.grsxs.fluid-container > div.gu.gu-last.ptxl.ptn-m > div > div'
        ).textContent
    )
    return { desc }
  }

  async getParcours(page) {
    const sel =
      '#public-profile > div > div > div.optional-components.fluid-container > div.gr.mbm > div.current-position-left.gu.gu-2of3.gu-s-1of1 > div.experiences.mbs > section > article > div.gu.gu-5of6.ptm.prs.pbl.experience__content'
    const parcours = await page.evaluate(sel => {
      let elements = Array.from(document.querySelectorAll(sel))
      let links = elements.map(element => {
        return {
          description: element.querySelector(
            'div > div.experience-title-location > h3'
          ).textContent,
          duration: element.querySelector(
            'div > div.experience-title-location > span.experience-period'
          ).textContent
        }
      })
      return links
    }, sel)
    return { parcours }
  }

  async getCompetences(page) {
    const sel =
      '#public-profile > div > div > div.optional-components.fluid-container > div.gr.mbm > div.current-position-left.gu.gu-2of3.gu-s-1of1 > div.skills.pts > div > div > ul > li'
    const competences = await page.evaluate(sel => {
      let elements = Array.from(document.querySelectorAll(sel))
      let links = elements.map(element => {
        return element.textContent
      })
      return links
    }, sel)
    return { competences }
  }

  async getLangues(page) {
    const sel =
      '#public-profile > div > div > div.optional-components.fluid-container > div.gr.mbm > div.current-position-left.gu.gu-2of3.gu-s-1of1 > div.languages.pts > div > div > ul > li'
    const langues = await page.evaluate(sel => {
      let elements = Array.from(document.querySelectorAll(sel))
      let links = elements.map(element => {
        const level = element.querySelector('div > a > span').textContent
        return {
          name: element.textContent.replace(level, ''),
          level: level
        }
      })
      return links
    }, sel)
    return { langues }
  }

  async getInteret(page) {
    const sel =
      '#public-profile > div > div > div.optional-components.fluid-container > div.gr.mbm > div.current-position-left.gu.gu-2of3.gu-s-1of1 > div.hobbies.pts > div > div > div.gu.gu-last.pls.ptl.prm.pbl > ul > li > span'
    const interet = await page.evaluate(sel => {
      let elements = Array.from(document.querySelectorAll(sel))
      let links = elements.map(element => {
        return element.textContent
      })
      return links
    }, sel)
    return { interet }
  }

  async getNbContacts(page) {
    const nbContacts = await page.evaluate(
      () =>
        document.querySelector(
          '#public-profile > div > div > div.optional-components.fluid-container > div.gr.mbm > div.current-position-left.gu.gu-2of3.gu-s-1of1 > div.current-position.bx.bx-default.ptn.pln.prn.pbn.mbs.gr > div.gr.current-position__footer > div.gu.gu-2of3.gu-m-1of2 > div > p.blue3.mbn.current-position__footer-contacts'
        ).textContent
    )
    return nbContacts
  }

  async getRelations(page) {
    const sel =
      '#public-profile > div > div > div.optional-components.fluid-container > div.gr.mbm > div.gu.gu-last > div.suggested-profiles.bx.bx-default.ptm.pll.prl.pbl.mbs.mls.mln-s > ul > li'
    const relations = await page.evaluate(sel => {
      let elements = Array.from(document.querySelectorAll(sel))
      let links = elements.map(element => {
        return {
          link: element.querySelector('a').href,
          name: element.querySelector('a > div').textContent
        }
      })
      return links
    }, sel)
    return { relations }
  }

  async getProfile() {
    async function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    const { page, url } = this
    const resJson = {}
    await page.goto(url)
    await timeout(5000);

    // Nom: '',
    // Prenom: '',
    const name = await this.getName(page)
    resJson.Nom = name.firstName
    resJson.Prenom = name.lastName

    // Photo: '',
    const { photo } = await this.getPhoto(page)
    resJson.Photo = photo

    // LienProfil: '',
    resJson.LienProfil = page.url()

    // Description: '',
    const { desc } = await this.getDesc(page)
    if (desc.length !== 0) resJson.Description = desc

    // ParcoursPro: '',
    const { parcours } = await this.getParcours(page)
    if (parcours.length !== 0) resJson.ParcoursPro = parcours

    // Competences: '',
    const { competences } = await this.getCompetences(page)
    if (competences.length !== 0) resJson.Competences = competences

    // Langues: '',
    const { langues } = await this.getLangues(page)
    if (langues.length !== 0) resJson.Langues = langues

    // Interet: '',
    const { interet } = await this.getInteret(page)
    if (interet.length !== 0) resJson.Interet = interet

    // NbContacts: ''
    resJson.NbContacts = await this.getNbContacts(page)

    // Relation: ''
    const { relations } = await this.getRelations(page)
    if (relations.length !== 0) resJson.Relation = relations

    console.log(resJson)
    return resJson
  }
}
