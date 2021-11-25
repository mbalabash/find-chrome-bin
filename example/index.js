/* eslint-disable node/no-missing-require, node/no-unpublished-require, no-console */
const { join } = require('path')
const puppeteer = require('puppeteer-core')
const { PUPPETEER_REVISIONS } = require('puppeteer-core/lib/cjs/puppeteer/revisions')

const { findChrome } = require('../index')

;

(async () => {
  let chromeInfo = await findChrome({
    min: 95,
    max: 98,
    download: {
      puppeteer,
      path: join('.', 'chrome'),
      revision: PUPPETEER_REVISIONS.chromium
    }
  })

  console.log('chromeInfo:', chromeInfo)
})()

// package.json
// {
//   "dependencies": {
//     "puppeteer-core": ">7.x"
//   }
// }
