export type ByteUnit = "b" | "kb" | "mb" | "gb" | "tb" | "pb" | "k" | "m" | "g" | "t" | "p"
export type ByteInput = `${number}${ByteUnit}` | `${number}` | number
export type ByteBase = 1000 | 1024

export interface ToBytesOptions {
  /** Base for calculations: 1024 (binary) or 1000 (decimal) */
  base: ByteBase
  /** Whether to round the result to the nearest integer */
  round: boolean
}

// Compiled regex for better performance
export const BYTE_REGEX = /^([+-]?(?:[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?|NaN|Infinity(?:-\w+)?))\s*([a-zA-Z]*)$/i

// Const assertion for better type safety
const MULTIPLIERS = {
  "": 1,
  b: 1,
  k: (base: ByteBase) => base,
  kb: (base: ByteBase) => base,
  m: (base: ByteBase) => base ** 2,
  mb: (base: ByteBase) => base ** 2,
  g: (base: ByteBase) => base ** 3,
  gb: (base: ByteBase) => base ** 3,
  t: (base: ByteBase) => base ** 4,
  tb: (base: ByteBase) => base ** 4,
  p: (base: ByteBase) => base ** 5,
  pb: (base: ByteBase) => base ** 5,
} as const

/**
 * Converts byte input with units to bytes
 *
 * @param input - The input value (e.g., "2.5kb", "33mb", "2.4gb", 1024, "1024")
 * @param options - Conversion options
 * @returns The value converted to bytes
 *
 * @example
 * ```typescript
 * toBytes("1kb") // 1024
 * toBytes("1mb", { base: 1000 }) // 1000000
 * toBytes("2.5gb") // 2684354560
 * toBytes(1024) // 1024
 * ```
 */
export function toBytes(input: ByteInput, options: Partial<ToBytesOptions> = {}): number {
  const { base = 1024, round = true } = options

  // Validate base parameter
  if (base !== 1000 && base !== 1024) {
    throw new Error(`Invalid base: "${base}". Must be 1000 or 1024`)
  }

  const str = String(input).toLowerCase().trim()
  const match = str.match(BYTE_REGEX)

  if (!match) {
    throw new Error(`Invalid format: "${input}". Expected format like "2.5kb", "33mb", "2.4gb", or a number`)
  }

  // Special case: reject multi-digit numbers with long invalid units like "12xyz"
  const numberPart = match[1] || ""
  const unitPart = match[2] || ""
  if (/^\d{2,}/.test(numberPart) && unitPart.length > 2) {
    const standardUnits = ["byte"]
    if (!standardUnits.includes(unitPart) && !unitPart.match(/^(kb|mb|gb|tb|pb)$/)) {
      throw new Error(`Invalid format: "${input}". Expected format like "2.5kb", "33mb", "2.4gb", or a number`)
    }
  }

  const value = parseFloat(match[1] || "0")
  const unit = (match[2] || "") as keyof typeof MULTIPLIERS

  // Enhanced number validation
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid number: "${match[1]}"`)
  }

  if (value < 0) {
    throw new Error(`Negative values not supported: "${value}"`)
  }

  // Get multiplier function or value
  const multiplierOrFn = MULTIPLIERS[unit]
  if (multiplierOrFn === undefined) {
    const supportedUnits = Object.keys(MULTIPLIERS)
      .filter((u) => u !== "")
      .join(", ")
    throw new Error(`Unsupported unit: "${unit}". Supported units: ${supportedUnits}`)
  }

  // Calculate multiplier
  const multiplier = typeof multiplierOrFn === "function" ? multiplierOrFn(base) : multiplierOrFn

  const result = value * multiplier

  // Check for overflow
  if (!Number.isSafeInteger(result) && round) {
    console.warn(`Result ${result} may exceed safe integer range`)
  }

  return round ? Math.round(result) : result
}

/**
 * Converts bytes back to human readable format
 *
 * @param bytes - Number of bytes
 * @param options - Formatting options
 * @returns Human readable string (e.g., "1.5 MB")
 */
export function fromBytes(
  bytes: number,
  options: {
    base?: ByteBase
    precision?: number
    longForm?: boolean
  } = {}
): string {
  const { base = 1024, precision = 2, longForm = false } = options
  const units = longForm ? ["bytes", "KB", "MB", "GB", "TB", "PB"] : ["B", "KB", "MB", "GB", "TB", "PB"]

  if (bytes === 0) return `0 ${units[0]}`
  if (bytes < 0) throw new Error("Negative bytes not supported")

  const i = Math.floor(Math.log(bytes) / Math.log(base))
  const value = bytes / Math.pow(base, i)

  return `${value.toFixed(precision)} ${units[i]}`
}

// Utility function for type-safe usage
export function createByteConverter(defaultOptions: Partial<ToBytesOptions> = {}) {
  return (input: ByteInput, overrideOptions?: Partial<ToBytesOptions>) =>
    toBytes(input, { ...defaultOptions, ...overrideOptions })
}
