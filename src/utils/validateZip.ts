import { ALLOWED_ZIPS } from '../data/allowedZips'

export function validateZip(zip: string): boolean {
  return ALLOWED_ZIPS.has(zip.trim())
}
