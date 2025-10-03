export function compactText(
  text?: string,
  options?: {
    maxLength?: number
    ellipsis?: string
  }
): string | undefined {
  if (!text) return undefined

  // Clean up whitespace
  const clean = text.replace(/\s+/g, " ").trim()

  const { maxLength, ellipsis = "…" } = options || {}

  // No truncation needed
  if (!maxLength || maxLength <= 0 || clean.length <= maxLength) {
    return clean
  }

  // Truncate and add ellipsis
  return clean.slice(0, maxLength - ellipsis.length).trimEnd() + ellipsis
}
