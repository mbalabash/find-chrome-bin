const { join } = require('path')
const { execSync, execFileSync } = require('child_process')
const { homedir } = require('os')

const { newLineRegex, canAccess } = require('../utils')

function findChromeBinaryOnLinux() {
  let installations = []

  // Look into the directories where .desktop are saved on gnome based distro's
  let desktopInstallationFolders = [
    join(homedir(), '.local/share/applications/'),
    '/usr/share/applications/'
  ]

  desktopInstallationFolders.forEach(folder => {
    installations = installations.concat(findChromeExecutables(folder))
  })

  // Look for google-chrome(-stable) & chromium(-browser) executables by using the which command
  let executables = ['google-chrome-stable', 'google-chrome', 'chromium-browser', 'chromium']
  executables.forEach(executable => {
    try {
      let chromePath = execFileSync('which', [executable], { stdio: 'pipe' })
        .toString()
        .split(newLineRegex)[0]
      if (canAccess(chromePath)) installations.push(chromePath)
    } catch (e) {
      // Not installed.
    }
  })

  if (!installations.length) {
    return undefined
  }

  let priorities = [
    { regex: /chrome-wrapper$/, weight: 51 },
    { regex: /google-chrome-stable$/, weight: 50 },
    { regex: /google-chrome$/, weight: 49 },
    { regex: /chromium-browser$/, weight: 48 },
    { regex: /chromium$/, weight: 47 }
  ]

  if (process.env.CHROME_PATH) {
    priorities.unshift({
      regex: new RegExp(`${process.env.CHROME_PATH}`),
      weight: 101
    })
  }

  return sort(uniq(installations.filter(Boolean)), priorities)[0]
}

function findChromeExecutables(folder) {
  let installations = []
  let argumentsRegex = /(^[^ ]+).*/
  let chromeExecRegex = '^Exec=/.*/(google-chrome|chrome|chromium)-.*'

  if (canAccess(folder)) {
    let execPaths

    try {
      execPaths = execSync(`grep -ER "${chromeExecRegex}" ${folder} | awk -F '=' '{print $2}'`)
    } catch (e) {
      execPaths = execSync(`grep -Er "${chromeExecRegex}" ${folder} | awk -F '=' '{print $2}'`)
    }

    execPaths = execPaths
      .toString()
      .split(newLineRegex)
      .map(execPath => execPath.replace(argumentsRegex, '$1'))

    execPaths.forEach(execPath => canAccess(execPath) && installations.push(execPath))
  }

  return installations
}

function sort(installations, priorities) {
  let defaultPriority = 10
  return installations
    .map(inst => {
      for (let pair of priorities) {
        if (pair.regex.test(inst)) return { path: inst, weight: pair.weight }
      }
      return { path: inst, weight: defaultPriority }
    })
    .sort((a, b) => b.weight - a.weight)
    .map(pair => pair.path)
}

function uniq(arr) {
  return Array.from(new Set(arr))
}

module.exports = { findChromeBinaryOnLinux }
