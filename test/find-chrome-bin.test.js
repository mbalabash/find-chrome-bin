const { test } = require('uvu')
const { join } = require('path')
const assert = require('uvu/assert')
const puppeteer = require('puppeteer-core')
const { restoreAll } = require('nanospy')
const { PUPPETEER_REVISIONS } = require('puppeteer-core/lib/cjs/puppeteer/revisions.js')

const { findChrome } = require('../index.js')

test.after.each(() => restoreAll())

test('should find local suitable chromium', async () => {
  let chromeInfo = await findChrome()

  assert.is(chromeInfo.browser.length > 0, true)
  assert.is(chromeInfo.executablePath.length > 0, true)
})

test("should download when could not find chromium and 'puppeteer' options are specified", async () => {
  let downloadedChromeInfo = await findChrome({
    min: 70,
    max: 70,
    download: { puppeteer, revision: PUPPETEER_REVISIONS.chromium, path: join(__dirname, 'chrome') }
  })

  assert.is(downloadedChromeInfo.browser.length > 0, true)
  assert.is(downloadedChromeInfo.executablePath.length > 0, true)
})

test.run()
