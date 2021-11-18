import { join } from 'path'
import { execSync } from 'child_process'

import { MIN_CHROME_VERSION, MAX_CHROME_VERSION } from './utils.js'
import { getWin32ChromeVersionInfo } from './win32.js'

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

  let match = versionOutput.match(/(Google Chrome|Chromium) ([0-9]{2}).*/)
  if (match && match[2]) {
    let version = parseInt(match[2], 10)
    return min <= version && version <= max
  }

  return false
}

export async function downloadChromium(chromeDestinationPath) {
  try {
    let { default: puppeteer } = await import('puppeteer-core')
    let { PUPPETEER_REVISIONS } = await import('puppeteer-core/lib/cjs/puppeteer/revisions')

    let downloadHost =
      process.env.PUPPETEER_DOWNLOAD_HOST ||
      process.env.npm_config_puppeteer_download_host ||
      process.env.npm_package_config_puppeteer_download_host
    let chromeTempPath = chromeDestinationPath || join(__dirname, 'temp', 'chrome')

    let browserFetcher = puppeteer.createBrowserFetcher({
      path: chromeTempPath,
      host: downloadHost
    })

    let revision =
      process.env.PUPPETEER_CHROMIUM_REVISION ||
      process.env.npm_config_puppeteer_chromium_revision ||
      process.env.npm_package_config_puppeteer_chromium_revision ||
      PUPPETEER_REVISIONS.chromium

    let revisionInfo = browserFetcher.revisionInfo(revision)

    // If already downloaded
    if (revisionInfo.local) return revisionInfo

    let newRevisionInfo = await browserFetcher.download(revisionInfo.revision)

    let localRevisions = await browserFetcher.localRevisions()
    localRevisions = localRevisions.filter(r => r !== revisionInfo.revision)

    // Remove previous revisions
    let cleanupOldVersions = localRevisions.map(r => browserFetcher.remove(r))
    await Promise.all(cleanupOldVersions)

    return newRevisionInfo
  } catch (error) {
    console.error(`ERROR: Failed to download Chromium!`) // eslint-disable-line no-console
    throw error
  }
}

export function chromeVersion(executablePath) {
  if (process.platform === 'win32') {
    return getWin32ChromeVersionInfo(executablePath)
  } else {
    return execSync(`"${executablePath}" --version`).toString()
  }
}
