import { describe, expect, it } from "vitest"
import { getInitialLetter } from "./get-initial-letter"

describe("getInitialLetter", () => {
  it("returns empty string for null input", () => {
    expect(getInitialLetter(null)).toEqual("?")
  })

  it("returns empty string for undefined input", () => {
    expect(getInitialLetter(undefined)).toEqual("?")
  })

  it("returns empty string for empty string", () => {
    expect(getInitialLetter("")).toEqual("?")
  })

  it("returns empty string for whitespace only", () => {
    expect(getInitialLetter("   ")).toEqual("?")
  })

  it("returns single letter for single name", () => {
    expect(getInitialLetter("John")).toEqual("J")
    expect(getInitialLetter("mary")).toEqual("M")
  })

  it("returns two letters for two names", () => {
    expect(getInitialLetter("John Doe")).toEqual("JD")
    expect(getInitialLetter("mary jane")).toEqual("MJ")
  })

  it("returns two letters for more than two names", () => {
    expect(getInitialLetter("John Doe Smith")).toEqual("JD")
    expect(getInitialLetter("Mary Jane Wilson Brown")).toEqual("MJ")
  })

  it("handles multiple spaces between names", () => {
    expect(getInitialLetter("John   Doe")).toEqual("JD")
    expect(getInitialLetter("  Mary   Jane  ")).toEqual("MJ")
  })

  it("handles names with hyphens", () => {
    expect(getInitialLetter("Jean-Pierre Dupont")).toEqual("JD")
    expect(getInitialLetter("Mary-Jane Wilson")).toEqual("MW")
  })

  it("handles names with diacritics", () => {
    expect(getInitialLetter("José García")).toEqual("JG")
    expect(getInitialLetter("François Dupont")).toEqual("FD")
    expect(getInitialLetter("Beyoncé Knowles")).toEqual("BK")
  })

  it("handles names with special characters", () => {
    expect(getInitialLetter("O'Connor")).toEqual("O")
    expect(getInitialLetter("Mary O'Connor")).toEqual("MO")
  })

  it("handles mixed case input", () => {
    expect(getInitialLetter("jOHN dOE")).toEqual("JD")
    expect(getInitialLetter("MaRy JaNe")).toEqual("MJ")
  })

  it("handles single character names", () => {
    expect(getInitialLetter("A B")).toEqual("AB")
    expect(getInitialLetter("X")).toEqual("X")
  })

  it("handles names with numbers", () => {
    expect(getInitialLetter("John2 Doe")).toEqual("JD")
    expect(getInitialLetter("123 Test")).toEqual("1T")
  })

  it("handles names with multiple words", () => {
    expect(getInitialLetter("John Doe Smith")).toEqual("JD")
    expect(getInitialLetter("Mary Jane Wilson Brown")).toEqual("MJ")
  })
})
