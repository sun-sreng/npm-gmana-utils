export function toIso(value?: Date | string): string | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return !isNaN(date.valueOf()) ? date.toISOString() : undefined
}
