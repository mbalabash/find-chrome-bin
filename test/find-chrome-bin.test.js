import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { join, dirname } from 'node:path'
import puppeteer from 'puppeteer-core'
import { restoreAll } from 'nanospy'
import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/cjs/puppeteer/revisions.js'
import { fileURLToPath } from 'url';

import { findChrome } from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    download: { puppeteer, revision: PUPPETEER_REVISIONS.chrome, path: join(__dirname, 'chrome') }
  })

  assert.is(downloadedChromeInfo.browser.length > 0, true)
  assert.is(downloadedChromeInfo.executablePath.length > 0, true)
})

test.run()
