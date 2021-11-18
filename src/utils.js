import { accessSync } from 'fs'

export const MIN_CHROME_VERSION = 85

export const MAX_CHROME_VERSION = Number.MAX_VALUE

export const newLineRegex = /\r?\n/

export function canAccess(file) {
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
