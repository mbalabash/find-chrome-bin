const { join } = require('path')
const puppeteer = require('puppeteer-core')
const { PUPPETEER_REVISIONS } = require('puppeteer-core/lib/cjs/puppeteer/revisions.js')
const { findChrome } = require('../index')

;(async () => {
  let chromeInfo = await findChrome({
    min: 92,
    max: 128,
    download: {
      puppeteer,
      path: join(__dirname, '..', 'test', 'chrome'),
      revision: PUPPETEER_REVISIONS.chromium
    }
  })

  console.log(chromeInfo)
})()

// package.json
// {
//   "type": "module",
//   "dependencies": {
//     "puppeteer-core": ">7.x",
//   }
// }
