const { test } = require('uvu')
const { join } = require('path')
const assert = require('uvu/assert')
const puppeteer = require('puppeteer-core')
const { spyOn, restoreAll } = require('nanospy')
const { PUPPETEER_REVISIONS } = require('puppeteer-core/lib/cjs/puppeteer/revisions')

const { findChrome } = require('../index.js')

test.after.each(() => restoreAll())

test('should find local suitable chromium', async () => {
  let chromeInfo = await findChrome()

  assert.is(chromeInfo.browser.length > 0, true)
  assert.is(chromeInfo.executablePath.length > 0, true)
})

test("should download when could not find chromium and 'puppeteer' options are specified", async () => {
  let fetcherSpy = spyOn(puppeteer, 'createBrowserFetcher')
  let downloadedChromeInfo = await findChrome({
    min: 70,
    max: 70,
    download: { puppeteer, revision: PUPPETEER_REVISIONS.chromium, path: join(__dirname, 'chrome') }
  })

  assert.is(fetcherSpy.called, true)
  assert.equal(fetcherSpy.callCount, 1)
  assert.is(downloadedChromeInfo.browser.length > 0, true)
  assert.is(downloadedChromeInfo.executablePath.length > 0, true)
})

test.run()
