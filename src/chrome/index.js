const { execSync } = require('child_process')

const { MIN_CHROME_VERSION, MAX_CHROME_VERSION } = require('../utils')
const { getWin32ChromeVersionInfo } = require('../win32')

function isSuitableVersion(executablePath, min = MIN_CHROME_VERSION, max = MAX_CHROME_VERSION) {
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

function chromeVersion(executablePath) {
  return (
    process.platform === 'win32'
      ? getWin32ChromeVersionInfo(executablePath)
      : execSync(`"${executablePath}" --version`).toString()
  ).trim()
}

async function downloadChromium(puppeteer, path, revision) {
  try {
    let downloadHost =
      process.env.PUPPETEER_DOWNLOAD_HOST ||
      process.env.npm_config_puppeteer_download_host ||
      process.env.npm_package_config_puppeteer_download_host

    let browserFetcher = puppeteer.createBrowserFetcher({
      path,
      host: downloadHost
    })

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

module.exports = { isSuitableVersion, chromeVersion, downloadChromium }
