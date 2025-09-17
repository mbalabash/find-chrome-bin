import { sep, join } from 'path'
import { execSync } from 'child_process'

import { canAccess } from '../utils/index.js'

export function findChromeBinaryOnWin32(canary) {
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

export function getWin32ChromeVersionInfo(executablePath) {
  try {
    // Use PowerShell to get ProductVersion property
    const informationCommand = `powershell -Command "(Get-Item '${executablePath}').VersionInfo | Select-Object CompanyName,ProductVersion | ConvertTo-Json"`
    const information = JSON.parse(
      execSync(informationCommand, { stdio: ['pipe', 'pipe', 'ignore'] })
    )
    const manufacturer = information.CompanyName.includes('Chromium') ? 'Chromium' : 'Google Chrome'
    if (information.ProductVersion) {
      return `${manufacturer} ${information.ProductVersion}`
    }

    throw new Error(`No version information found for '${executablePath}'`)
  } catch (err) {
    throw new Error(`Failed to get version info for '${executablePath}': ${err.message}`)
  }
}
