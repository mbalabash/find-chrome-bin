import { join } from 'path'
import puppeteer from 'puppeteer-core'
import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/cjs/puppeteer/revisions.js'
import { findChrome } from 'find-chrome-bin'

let chromeInfo = await findChrome({
  min: 92,
  max: 95,
  download: {
    puppeteer,
    path: join('.', 'chrome'),
    revision: PUPPETEER_REVISIONS.chromium
  }
})

console.log(chromeInfo)

// package.json
// {
//   "type": "module",
//   "dependencies": {
//     "puppeteer-core": ">7.x",
//   }
// }
