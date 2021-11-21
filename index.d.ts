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
   *     path: string
   *     revision: string | undefined
   *   })}
   */
  download?: {
    /**
     * Path where to put downloaded Chromium
     * @type {string}
     */
    path: string

    /**
     * Specific Chromium revision to download
     * @type {string | undefined}
     */
    revision?: string
  }
}

export type FindChromeOutput = {
  /**
   * Path to Chromium executable binary which you can use to run puppeteer
   * @example '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
   * @type {string}
   */
  executablePath: string

  /**
   * Browser name and version
   * @example 'Google Chrome 96.0.4664.45'
   * @type {string}
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
 * import findChrome from 'find-chrome-bin'
 * const chromeInfo = findChrome()
 * chromeInfo.browser //=> "Google Chrome 96.0.4664.45"
 * chromeInfo.executablePath //=> "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
 * ```
 *
 * @example
 * ```js
 * import { dirname, join } from 'path'
 * import { fileURLToPath } from 'url'
 * import findChrome from 'find-chrome-bin'
 * const chromeInfo = findChrome({
 *     min: 95,
 *     max: 98,
 *     download: {
 *       path: join(dirname(fileURLToPath(import.meta.url)), 'chrome'),
 *       revision: '938553'
 *     }
 * })
 * ```
 *
 * @param {FindChromeOptions}
 * @returns {Promise<FindChromeOutput>}
 */
export declare function findChrome(options: FindChromeOptions): Promise<FindChromeOutput>

export default findChrome
