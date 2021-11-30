const { test } = require('uvu')
const assert = require('uvu/assert')
const { spyOn, restoreAll } = require('nanospy')

const { findChrome } = require('../index.js')

test.after.each(() => restoreAll())

test('should find local suitable chromium', async () => {
  let chromeInfo = await findChrome()

  assert.is(chromeInfo.browser.length > 0, true)
  assert.is(chromeInfo.executablePath.length > 0, true)
})

test("should call 'download' when could not find chromium and 'puppeteer' options are specified", async () => {
  let targetRevision = 'some-revision'

  let chromeInfo = await findChrome()
  let browserFetcher = {
    revisionInfo: () => ({ local: false, revision: targetRevision }),
    download: () => ({ executablePath: chromeInfo.executablePath }),
    localRevisions: () => []
  }
  let puppeteer = { createBrowserFetcher: () => browserFetcher }
  let fetcherSpy = spyOn(puppeteer, 'createBrowserFetcher')
  let downloadSpy = spyOn(browserFetcher, 'download')

  let downloadedChromeInfo = await findChrome({
    min: 75,
    max: 80,
    download: {
      puppeteer,
      path: 'some/path',
      revision: targetRevision
    }
  })

  assert.is(fetcherSpy.called, true)
  assert.equal(fetcherSpy.callCount, 1)

  assert.is(downloadSpy.called, true)
  assert.equal(downloadSpy.callCount, 1)
  assert.equal(downloadSpy.calls, [[targetRevision]])
  assert.equal(downloadSpy.results, [{ executablePath: chromeInfo.executablePath }])

  assert.equal(downloadedChromeInfo.executablePath, chromeInfo.executablePath)
})

test.run()
