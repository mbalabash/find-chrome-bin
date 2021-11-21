const { sep, join } = require('path')
const { execSync } = require('child_process')

const { canAccess } = require('../utils')

function findChromeBinaryOnWin32(canary) {
  let suffix = canary
    ? `${sep}Google${sep}Chrome SxS${sep}Application${sep}chrome.exe`
    : `${sep}Google${sep}Chrome${sep}Application${sep}chrome.exe`

  let prefixes = [
    process.env.LOCALAPPDATA,
    process.env.PROGRAMFILES,
    process.env['PROGRAMFILES(X86)']
  ].filter(Boolean)

  let result

  prefixes.forEach(prefix => {
    let chromePath = join(prefix, suffix)
    if (canAccess(chromePath)) result = chromePath
  })

  return result
}

function getWin32ChromeVersionInfo(executablePath) {
  let executablePathForNode = executablePath.replace(/\\/g, '\\\\')
  let wmiResult = execSync(
    `wmic datafile where name="${executablePathForNode}" GET Manufacturer,FileName,Version /format:csv`,
    { stdio: ['pipe', 'pipe', 'ignore'] }
  )

  let wmiResultAsStringArray = wmiResult
    .toString()
    .replace(/^\r\r\n/, '')
    .replace(/\r\r\n$/, '')
    .split('\r\r\n')

  if (wmiResultAsStringArray.length === 2) {
    let columnNames = wmiResultAsStringArray[0].split(',')
    let values = wmiResultAsStringArray[1].split(',')
    let manufacturer = ''
    let version = ''

    columnNames.forEach((columnName, index) => {
      switch (columnName) {
        case 'Manufacturer':
          if (values[index].includes('Chromium')) {
            manufacturer = 'Chromium'
          } else {
            manufacturer = 'Google Chrome'
          }
          break
        case 'Version':
          version = values[index]
          break
      }
    })

    return `${manufacturer} ${version}`
  } else {
    throw new Error(`No version information found for '${executablePath}'`)
  }
}

module.exports = { findChromeBinaryOnWin32, getWin32ChromeVersionInfo }
