import { execSync } from 'child_process'
import { install } from '@puppeteer/browsers'

import { MIN_CHROME_VERSION, MAX_CHROME_VERSION } from '../utils/index.js'
import { getWin32ChromeVersionInfo } from '../win32/index.js'

export function isSuitableVersion(
  executablePath,
  min = MIN_CHROME_VERSION,
  max = MAX_CHROME_VERSION
) {
  if (min > max) {
    throw new Error(
      "ERROR: Passed options for limiting chrome versions are incorrect. Min couldn't be bigger then Max."
    )
  }

  let versionOutput

  try {
    // In case installed Chrome is not runnable
    versionOutput = chromeVersion(executablePath)
  } catch (e) {
    return false
  }

  let chromeVersionSince100RegExp = /(Google Chrome|Chromium) ([0-9]{3}).*/
  let chromeVersionBefore100RegExp = /(Google Chrome|Chromium) ([0-9]{2}).*/

  let match = chromeVersionSince100RegExp.test(versionOutput)
    ? versionOutput.match(chromeVersionSince100RegExp)
    : versionOutput.match(chromeVersionBefore100RegExp)

  if (match && match[2]) {
    let version = parseInt(match[2], 10)
    return min <= version && version <= max
  }

  return false
}

export function chromeVersion(executablePath) {
  return (
    process.platform === 'win32'
      ? getWin32ChromeVersionInfo(executablePath)
      : execSync(`"${executablePath}" --version`).toString()
  ).trim()
}

export async function downloadChromium(puppeteer, path, revision) {
  try {
    const config = {
      buildId: revision,
      browser: 'chrome',
      unpack: true,
      cacheDir: path
    }

    let newRevisionInfo = await install(config)

    return newRevisionInfo
  } catch (error) {
    console.error(`ERROR: Failed to download Chromium!`) // eslint-disable-line no-console
    throw error
  }
}
