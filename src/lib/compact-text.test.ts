import { describe, it, expect } from "vitest"
import { compactText } from "./compact-text"

describe("compactText", () => {
  it("should return undefined if text is undefined", () => {
    expect(compactText(undefined)).toBeUndefined()
  })

  it("should return cleaned text when there is extra whitespace", () => {
    const result = compactText("  Hello   world   ")
    expect(result).toBe("Hello world")
  })

  it("should return full text if it is shorter than maxLength", () => {
    const result = compactText("Hello", { maxLength: 10 })
    expect(result).toBe("Hello")
  })

  it("should return full text if maxLength <= 0", () => {
    const result = compactText("Hello world", { maxLength: 0 })
    expect(result).toBe("Hello world")
  })

  it("should truncate and append default ellipsis when text is too long", () => {
    const result = compactText("Hello amazing world", { maxLength: 10 })
    expect(result).toBe("Hello ama…")
  })

  it("should truncate and append custom ellipsis when provided", () => {
    const result = compactText("Hello amazing world", {
      maxLength: 10,
      ellipsis: "...",
    })
    expect(result).toBe("Hello a...")
  })

  it("should trim trailing spaces before adding ellipsis", () => {
    const result = compactText("Hello    world  ", { maxLength: 10 })
    expect(result).toBe("Hello wor…")
  })

  it("should handle text equal to maxLength exactly", () => {
    const result = compactText("HelloWorld", { maxLength: 10 })
    expect(result).toBe("HelloWorld")
  })

  it("should handle empty string correctly", () => {
    const result = compactText("")
    expect(result).toBeUndefined()
  })

  it("should handle text with only spaces", () => {
    const result = compactText("     ")
    expect(result).toBe("")
  })
})
