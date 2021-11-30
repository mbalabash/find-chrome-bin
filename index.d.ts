export type FindChromeOptions = {
  /**
   * Minimal suitable Chromium version
   * @default 85
   * @type {number}
   */
  min: number

  /**
   * Maximal suitable Chromium version
   * @default undefined
   * @type {number}
   */
  max: number

  /**
   * Settings for Chromium downloading
   * @default undefined
   * @type {({
   *     puppeteer: Object
   *     path: string
   *     revision: string
   *   })}
   * @example
   * const puppeteer = require('puppeteer-core')
   * const { PUPPETEER_REVISIONS } = require('puppeteer-core/lib/cjs/puppeteer/revisions')
   * download: {
   *   puppeteer,
   *   path: path.join('.', 'chrome'),
   *   revision: PUPPETEER_REVISIONS.chromium,
   * }
   */
  download?: {
    /**
     * Puppeteer's instance
     * @type {Object}
     * @example const puppeteer = require('puppeteer-core');
     */
    puppeteer: Object

    /**
     * Path where to put downloaded Chromium
     * @type {string}
     * @example path.join('.', 'chrome')
     */
    path: string

    /**
     * Specific Chromium revision to download
     * @type {string}
     * @example
     * const { PUPPETEER_REVISIONS } = require('puppeteer-core/lib/cjs/puppeteer/revisions')
     * PUPPETEER_REVISIONS.chromium //=> "938553"
     */
    revision: string
  }
}

export type FindChromeOutput = {
  /**
   * Path to Chromium executable binary which you can use to run puppeteer
   * @type {string}
   * @example "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
   */
  executablePath: string

  /**
   * Browser name and version
   * @type {string}
   * @example "Google Chrome 96.0.4664.45"
   */
  browser: string
}

/**
 * Find local suitable Chromium.
 *
 * By default it only tries to find Chromium v85+.
 * You can configure suitable version using `min` and `max` options.
 *
 * It can also download Chromium if couldn't find any suitable version locally (you mast have puppeteer-core dependency in your package.json).
 *
 * @example
 * ```js
 * import { findChrome } from 'find-chrome-bin'
 * const chromeInfo = await findChrome()
 * chromeInfo.browser //=> "Google Chrome 96.0.4664.45"
 * chromeInfo.executablePath //=> "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
 * ```
 *
 * @example
 * ```js
 * import { join } from 'path
 * import { findChrome } from 'find-chrome-bin'
 * import puppeteer from 'puppeteer-core'
 * import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/cjs/puppeteer/revisions'
 * const chromeInfo = await findChrome({
 *     min: 95,
 *     max: 98,
 *     download: {
 *       puppeteer,
 *       path: path.join('.', 'chrome'),
 *       revision: PUPPETEER_REVISIONS.chromium,
 *     }
 * })
 * ```
 *
 * @param {FindChromeOptions}
 * @returns {Promise<FindChromeOutput>}
 */
export declare function findChrome(options: FindChromeOptions): Promise<FindChromeOutput>
