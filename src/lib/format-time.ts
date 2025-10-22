export interface FormatTimeOptions {
  /**
   * Format style for the time display
   * - 'digital': "1:05:30" or "5:30"
   * - 'long': "1 hour 5 minutes 30 seconds"
   * - 'short': "1h 5m 30s"
   * - 'compact': "1:05:30" (always shows hours)
   * @default 'digital'
   */
  format?: "digital" | "long" | "short" | "compact"

  /**
   * Always show hours even if 0
   * @default false
   */
  alwaysShowHours?: boolean

  /**
   * Round decimal seconds
   * - 'floor': Round down (default)
   * - 'ceil': Round up
   * - 'round': Round to nearest
   * @default 'floor'
   */
  roundingMode?: "floor" | "ceil" | "round"

  /**
   * Show leading zero for minutes when hours are present
   * @default true
   */
  padMinutes?: boolean

  /**
   * Custom separator for digital format
   * @default ':'
   */
  separator?: string
}

/**
 * Formats seconds into a human-readable time string
 *
 * @param seconds - The number of seconds to format (must be >= 0)
 * @param options - Formatting options
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * formatTime(65)                                    // "1:05"
 * formatTime(3665)                                  // "1:01:05"
 * formatTime(65, { format: 'short' })              // "1m 5s"
 * formatTime(65, { format: 'long' })               // "1 minute 5 seconds"
 * formatTime(5, { alwaysShowHours: true })         // "0:00:05"
 * formatTime(5.7, { roundingMode: 'ceil' })        // "0:06"
 * formatTime(65, { separator: '·' })               // "1·05"
 * ```
 */
export function formatTime(seconds: number, options: FormatTimeOptions = {}): string {
  const {
    format = "digital",
    alwaysShowHours = false,
    roundingMode = "floor",
    padMinutes = true,
    separator = ":",
  } = options

  // Validate input
  if (!Number.isFinite(seconds)) {
    throw new Error("formatTime: seconds must be a finite number")
  }

  if (seconds < 0) {
    throw new Error("formatTime: seconds must be non-negative")
  }

  // Round seconds based on mode
  const roundedSeconds =
    roundingMode === "ceil" ? Math.ceil(seconds) : roundingMode === "round" ? Math.round(seconds) : Math.floor(seconds)

  // Calculate time components
  const hours = Math.floor(roundedSeconds / 3600)
  const minutes = Math.floor((roundedSeconds % 3600) / 60)
  const secs = roundedSeconds % 60

  const hasHours = hours > 0 || alwaysShowHours

  // Format based on style
  switch (format) {
    case "long":
      return formatLong(hours, minutes, secs, hasHours)

    case "short":
      return formatShort(hours, minutes, secs, hasHours)

    case "compact":
      return formatDigital(hours, minutes, secs, true, padMinutes, separator)

    case "digital":
    default:
      return formatDigital(hours, minutes, secs, hasHours, padMinutes, separator)
  }
}

/**
 * Helper: Format in digital style (1:05:30 or 5:30)
 */
function formatDigital(
  hours: number,
  minutes: number,
  seconds: number,
  showHours: boolean,
  padMinutes: boolean,
  separator: string
): string {
  const parts: string[] = []

  if (showHours) {
    parts.push(hours.toString())
    parts.push(minutes.toString().padStart(2, "0"))
  } else {
    parts.push(padMinutes ? minutes.toString().padStart(2, "0") : minutes.toString())
  }

  parts.push(seconds.toString().padStart(2, "0"))

  return parts.join(separator)
}

/**
 * Helper: Format in long style (1 hour 5 minutes 30 seconds)
 */
function formatLong(hours: number, minutes: number, seconds: number, showHours: boolean): string {
  const parts: string[] = []

  if (showHours && hours > 0) {
    parts.push(`${hours} ${pluralize("hour", hours)}`)
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${pluralize("minute", minutes)}`)
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} ${pluralize("second", seconds)}`)
  }

  return parts.join(" ")
}

/**
 * Helper: Format in short style (1h 5m 30s)
 */
function formatShort(hours: number, minutes: number, seconds: number, showHours: boolean): string {
  const parts: string[] = []

  if (showHours && hours > 0) {
    parts.push(`${hours}h`)
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`)
  }

  return parts.join(" ")
}

/**
 * Helper: Pluralize words
 */
function pluralize(word: string, count: number): string {
  return count === 1 ? word : `${word}s`
}

/**
 * Parses a formatted time string back to seconds
 *
 * @param timeString - Time string in format "1:05:30", "1:05", "5:30", etc.
 * @param separator - Separator used in the time string
 * @returns Number of seconds
 *
 * @example
 * ```typescript
 * parseTime("1:05")      // 65
 * parseTime("1:01:05")   // 3665
 * parseTime("5:30")      // 330
 * ```
 */
export function parseTime(timeString: string, separator: string = ":"): number {
  if (!timeString || typeof timeString !== "string") {
    throw new Error("parseTime: timeString must be a non-empty string")
  }

  const parts = timeString.split(separator).map((part) => {
    const num = parseInt(part, 10)
    if (!Number.isFinite(num) || num < 0) {
      throw new Error(`parseTime: invalid time component "${part}"`)
    }
    return num
  })

  if (parts.length === 0 || parts.length > 3) {
    throw new Error("parseTime: timeString must have 1-3 components (SS, MM:SS, or HH:MM:SS)")
  }

  // Handle different formats
  if (parts.length === 1) {
    // Just seconds
    return parts[0]!
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0]! * 60 + parts[1]!
  } else {
    // HH:MM:SS
    return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!
  }
}
