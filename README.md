# Finds local suitable Chromium

* **Cross-platform.** Works on win, mac and linux.

* **Small.** Only 2.4 kB in your node_modules.

* **Zero-dependency.** 

By default, it tries to find Chromium v85+. You can configure a suitable version using `min` and `max` options.

It can also download suitable Chromium revision as fallback (you have to provide puppeteer-core entity and Chromium revision to `download` option).

Respects `CHROMIUM_EXECUTABLE_PATH` and `PUPPETEER_EXECUTABLE_PATH` environment variables for CI purposes.

## Usage

```js
import { findChrome } from 'find-chrome-bin'
const chromeInfo = await findChrome()
console.log(chromeInfo)
// { browser: "Google Chrome 96.0.4664.45", executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" }
```

### Specifying `min` and/or `max` Chromium versions

```js
import { findChrome } from 'find-chrome-bin'
const chromeInfo = await findChrome({ min: 95, max: 97 })
console.log(chromeInfo)
// { browser: "Google Chrome 96.0.4664.45", executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" }
```

### With fallback to download suitable Chromium revision

```js
import { join } from 'path'
import puppeteer from 'puppeteer-core'
import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/cjs/puppeteer/revisions.js'
import { findChrome } from 'find-chrome-bin'

let chromeInfo = await findChrome({
  max: 95,
  download: {
    puppeteer,
    path: join('.', 'chrome'),
    revision: PUPPETEER_REVISIONS.chromium
  }
})
console.log(chromeInfo)
// { browser: "Chromium 94.0.4606.0", executablePath: "/Users/mbalabash/Projects/opensource/find-chrome-bin/example/chrome/mac-911515/chrome-mac/Chromium.app/Contents/MacOS/Chromium" }
```
