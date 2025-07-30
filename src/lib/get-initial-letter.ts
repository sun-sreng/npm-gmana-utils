/**
 * Generates a one or two-letter initial string from a full name.
 * It takes the first letter of the first two name parts.
 * This function correctly handles diacritics, extra whitespace, and empty or invalid inputs.
 *
 * @example
 * getInitialLetter("John Doe") // "JD"
 * getInitialLetter(" Beyoncé  Knowles-Carter") // "BK"
 * getInitialLetter("Cher") // "C"
 * getInitialLetter(null) // "?"
 *
 * @param fullName The full name to process. Can be a string, null, or undefined.
 * @returns The uppercase initials (1 or 2 characters), or an empty string if the input is invalid.
 */
export function getInitialLetter(fullName?: string | null, fallback: string = "?"): string {
  const cleanedName = fullName?.trim() ?? ""
  if (!cleanedName) {
    return fallback
  }

  return cleanedName
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase() ?? ""
    )
    .join("")
}
