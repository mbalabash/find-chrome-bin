import { isSuitableVersion, chromeVersion, downloadChromium }  from './src/chrome/index.js'
import { findChromeBinaryOnDarwin } from './src/darwin/index.js'
import { findChromeBinaryOnLinux } from './src/linux/index.js'
import { findChromeBinaryOnWin32 } from './src/win32/index.js'

export async function findChrome({ min, max, download: { puppeteer, path, revision } = {} } = {}) {
  try {
    let executablePath = findChromeBinaryPath()
    let isSuitable = isSuitableVersion(executablePath, min, max)
    let isNotEmpty = typeof executablePath === 'string' && executablePath.length > 0
    let isDownloadSkipped =
      !!puppeteer === false ||
      typeof path !== 'string' ||
      path.length === 0 ||
      typeof revision !== 'string' ||
      revision.length === 0

    if (isNotEmpty && isSuitable) {
      return { executablePath, browser: chromeVersion(executablePath) }
    }

    if ((!isNotEmpty || (isNotEmpty && !isSuitable)) && isDownloadSkipped) {
      throw new Error(
        "Couldn't find suitable Chrome version locally.\nSkipping Chromium downloading due to unset or incorrect download settings."
      )
    } else {
      let revisionInfo = await downloadChromium(puppeteer, path, revision)
      return {
        executablePath: revisionInfo.executablePath,
        browser: chromeVersion(revisionInfo.executablePath)
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
