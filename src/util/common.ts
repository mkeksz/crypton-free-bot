export function getUnixTime(): number {
  return parseInt(String(Date.now() / 1000))
}
