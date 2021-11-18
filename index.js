import { isSuitableVersion, chromeVersion, downloadChromium } from './src/chrome.js'
import { findChromeBinaryOnDarwin } from './src/darwin.js'
import { findChromeBinaryOnLinux } from './src/linux.js'
import { findChromeBinaryOnWin32 } from './src/win32.js'

export async function findChrome({ min, max, downloadPath }) {
  try {
    let executablePath = findChromeBinaryPath()
    let isSuitable = isSuitableVersion(executablePath, min, max)
    let isNotEmpty = typeof executablePath === 'string' && executablePath.length > 0
    let isDownloadSkipped = typeof downloadPath !== 'string' || downloadPath.length === 0

    if (isNotEmpty && isSuitable) {
      return { executablePath, browser: chromeVersion(executablePath) }
    }

    if ((!isNotEmpty || (isNotEmpty && !isSuitable)) && isDownloadSkipped) {
      throw new Error(
        "Couldn't find suitable Chrome version locally.\nSkipping Chromium downloading due to unset downloadPath."
      )
    } else {
      let revisionInfo = await downloadChromium()
      return {
        executablePath: revisionInfo.executablePath,
        browser: `${revisionInfo.product} ${chromeVersion(revisionInfo.executablePath)}`
      }
    }
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
    return { executablePath: '', browser: '' }
  }
}

function findChromeBinaryPath() {
  let getter

  switch (process.platform) {
    case 'linux':
      getter = findChromeBinaryOnLinux
      break
    case 'win32':
      getter = findChromeBinaryOnWin32
      break
    case 'darwin':
      getter = findChromeBinaryOnDarwin
      break
  }

  return process.env.CHROMIUM_EXECUTABLE_PATH || process.env.PUPPETEER_EXECUTABLE_PATH || getter()
}

export default findChrome
