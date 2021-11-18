import { join } from 'path'
import puppeteer from 'puppeteer-core'
import { execSync } from 'child_process'
import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/cjs/puppeteer/revisions'

import { MIN_CHROME_VERSION, MAX_CHROME_VERSION } from './utils'
import { getWin32ChromeVersionInfo } from './win32'

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

  try {
    /* eslint-disable no-console */
    console.info(`Downloading Chromium r${revision}...`)

    let newRevisionInfo = await browserFetcher.download(revisionInfo.revision)

    console.info(`Chromium downloaded to ${newRevisionInfo.folderPath}`)
    console.info(`Downloaded Chrome executable path: ${revisionInfo.executablePath}`)
    console.info(`Downloaded Chrome version: ${chromeVersion(revisionInfo.executablePath)}`)

    let localRevisions = await browserFetcher.localRevisions()
    localRevisions = localRevisions.filter(r => r !== revisionInfo.revision)

    // Remove previous revisions
    let cleanupOldVersions = localRevisions.map(r => browserFetcher.remove(r))
    await Promise.all(cleanupOldVersions)

    return newRevisionInfo
  } catch (error) {
    console.error(`ERROR: Failed to download Chromium r${revision}!`)
    console.error(error)
    return null
    /* eslint-enable no-console */
  }
}

function chromeVersion(executablePath) {
  if (process.platform === 'win32') {
    return getWin32ChromeVersionInfo(executablePath)
  } else {
    return execSync(`"${executablePath}" --version`).toString()
  }
}
