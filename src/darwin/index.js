const { join } = require('path')
const { execSync } = require('child_process')

const { newLineRegex, canAccess } = require('../utils')

function findChromeBinaryOnDarwin(canary) {
  let LSREGISTER =
    '/System/Library/Frameworks/CoreServices.framework' +
    '/Versions/A/Frameworks/LaunchServices.framework' +
    '/Versions/A/Support/lsregister'
  let grepexpr = canary ? 'google chrome canary' : 'google chrome'
  let result = execSync(
    `${LSREGISTER} -dump  | grep -i '${grepexpr}?.app$' | awk '{$1=""; print $0}'`
  )

  let paths = result
    .toString()
    .split(newLineRegex)
    .filter(a => a)
    .map(a => a.trim())

  paths.unshift(
    canary ? '/Applications/Google Chrome Canary.app' : '/Applications/Google Chrome.app'
  )

  for (let p of paths) {
    if (p.startsWith('/Volumes')) continue
    let installation = join(
      p,
      canary ? '/Contents/MacOS/Google Chrome Canary' : '/Contents/MacOS/Google Chrome'
    )
    if (canAccess(installation)) return installation
  }

  return undefined
}

module.exports = { findChromeBinaryOnDarwin }
