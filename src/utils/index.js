const { accessSync } = require('fs')

const MIN_CHROME_VERSION = 85

const MAX_CHROME_VERSION = Number.MAX_VALUE

const newLineRegex = /\r?\n/

function canAccess(file) {
  if (!file) {
    return false
  }

  try {
    accessSync(file)
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  MIN_CHROME_VERSION,
  MAX_CHROME_VERSION,
  newLineRegex,
  canAccess
}
