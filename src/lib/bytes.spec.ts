import { describe, test, expect, vi } from "vitest"
import { toBytes, fromBytes, createByteConverter, type ByteInput, type ByteBase } from "./bytes"

describe("toBytes", () => {
  describe("basic conversions with default base (1024)", () => {
    test.each([
      // Basic units
      ["1b", 1],
      ["1kb", 1024],
      ["1mb", 1024 ** 2],
      ["1gb", 1024 ** 3],
      ["1tb", 1024 ** 4],
      ["1pb", 1024 ** 5],

      // Short units
      ["1k", 1024],
      ["1m", 1024 ** 2],
      ["1g", 1024 ** 3],
      ["1t", 1024 ** 4],
      ["1p", 1024 ** 5],

      // Decimal values
      ["2.5kb", Math.round(2.5 * 1024)],
      ["0.5mb", Math.round(0.5 * 1024 ** 2)],
      ["1.5gb", Math.round(1.5 * 1024 ** 3)],

      // No units (bytes)
      ["1024", 1024],
      ["500", 500],
    ])("should convert %s to %i bytes", (input, expected) => {
      expect(toBytes(input as ByteInput)).toBe(expected)
    })
  })

  describe("conversions with base 1000", () => {
    test.each([
      ["1kb", 1000],
      ["1mb", 1000 ** 2],
      ["1gb", 1000 ** 3],
      ["1tb", 1000 ** 4],
      ["2.5kb", Math.round(2.5 * 1000)],
    ])("should convert %s to %i bytes with base 1000", (input, expected) => {
      expect(toBytes(input as ByteInput, { base: 1000 })).toBe(expected)
    })
  })

  describe("number inputs", () => {
    test("should handle numeric input", () => {
      expect(toBytes(1024)).toBe(1024)
      expect(toBytes(500)).toBe(500)
      expect(toBytes(0)).toBe(0)
    })

    test("should handle floating point numbers", () => {
      expect(toBytes(1024.5)).toBe(1025) // rounded
    })
  })

  describe("case insensitivity and whitespace", () => {
    test.each([
      ["1KB", 1024],
      ["1Mb", 1024 ** 2],
      ["1GB", 1024 ** 3],
      ["  1kb  ", 1024],
      [" 2.5 MB ", Math.round(2.5 * 1024 ** 2)],
    ])("should handle %s correctly", (input, expected) => {
      expect(toBytes(input as ByteInput)).toBe(expected)
    })
  })

  describe("scientific notation", () => {
    test.each([
      ["1e3", 1000],
      ["1.5e3", 1500],
      ["1E6", 1000000],
      ["2.5e2kb", Math.round(250 * 1024)],
    ])("should handle scientific notation %s", (input, expected) => {
      expect(toBytes(input as ByteInput)).toBe(expected)
    })
  })

  describe("rounding options", () => {
    test("should round by default", () => {
      expect(toBytes("1.7b")).toBe(2)
      expect(toBytes("2.3kb")).toBe(Math.round(2.3 * 1024))
    })

    test("should not round when disabled", () => {
      expect(toBytes("1.7b", { round: false })).toBe(1.7)
      expect(toBytes("2.3kb", { round: false })).toBe(2.3 * 1024)
    })
  })

  describe("error cases", () => {
    test("should throw for invalid formats", () => {
      expect(() => toBytes("invalid" as ByteInput)).toThrow("Invalid format")
      expect(() => toBytes("12xyz" as ByteInput)).toThrow("Invalid format")
      expect(() => toBytes("" as ByteInput)).toThrow("Invalid format")
      expect(() => toBytes("kb" as ByteInput)).toThrow("Invalid format")
    })

    test("should throw for invalid numbers", () => {
      expect(() => toBytes("NaNkb" as ByteInput)).toThrow("Invalid number")
      expect(() => toBytes("Infinity-kb" as ByteInput)).toThrow("Invalid number")
    })

    test("should throw for negative values", () => {
      expect(() => toBytes("-1kb" as ByteInput)).toThrow("Negative values not supported")
      expect(() => toBytes(-100 as ByteInput)).toThrow("Negative values not supported")
    })

    test("should throw for invalid base", () => {
      expect(() => toBytes("1kb" as ByteInput, { base: 1500 as ByteBase })).toThrow("Invalid base")
      expect(() => toBytes("1kb" as ByteInput, { base: 0 as ByteBase })).toThrow("Invalid base")
    })

    test("should throw for unsupported units", () => {
      expect(() => toBytes("1xyz" as ByteInput)).toThrow("Unsupported unit")
      expect(() => toBytes("1byte" as ByteInput)).toThrow("Unsupported unit")
    })
  })

  describe("edge cases", () => {
    test("should handle zero", () => {
      expect(toBytes("0" as ByteInput)).toBe(0)
      expect(toBytes("0kb" as ByteInput)).toBe(0)
      expect(toBytes(0)).toBe(0)
    })

    test("should handle very small decimals", () => {
      expect(toBytes("0.001kb" as ByteInput)).toBe(Math.round(0.001 * 1024))
      expect(toBytes("0.1b" as ByteInput)).toBe(0)
    })

    test("should warn for large numbers that might overflow", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      // This should trigger the overflow warning
      toBytes("999999tb" as ByteInput)

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Result"))

      consoleSpy.mockRestore()
    })
  })
})

describe("fromBytes", () => {
  describe("basic conversions", () => {
    test.each([
      [0, "0 B"],
      [1024, "1.00 KB"],
      [1024 ** 2, "1.00 MB"],
      [1024 ** 3, "1.00 GB"],
      [1024 ** 4, "1.00 TB"],
      [1024 ** 5, "1.00 PB"],
      [1536, "1.50 KB"], // 1.5 * 1024
      [2560, "2.50 KB"], // 2.5 * 1024
    ])("should convert %i bytes to %s", (input, expected) => {
      expect(fromBytes(input as number)).toBe(expected)
    })
  })

  describe("base 1000 conversions", () => {
    test.each([
      [1000, "1.00 KB"],
      [1000 ** 2, "1.00 MB"],
      [1000 ** 3, "1.00 GB"],
    ])("should convert %i bytes to %s with base 1000", (input, expected) => {
      expect(fromBytes(input as number, { base: 1000 })).toBe(expected)
    })
  })

  describe("precision options", () => {
    test("should respect precision setting", () => {
      expect(fromBytes(1536 as number, { precision: 0 })).toBe("2 KB")
      expect(fromBytes(1536 as number, { precision: 1 })).toBe("1.5 KB")
      expect(fromBytes(1536 as number, { precision: 3 })).toBe("1.500 KB")
    })
  })

  describe("long form units", () => {
    test("should use long form units when requested", () => {
      expect(fromBytes(0, { longForm: true })).toBe("0 bytes")
      expect(fromBytes(1024, { longForm: true })).toBe("1.00 KB")
      expect(fromBytes(1024 ** 2, { longForm: true })).toBe("1.00 MB")
    })
  })

  describe("error cases", () => {
    test("should throw for negative bytes", () => {
      expect(() => fromBytes(-1)).toThrow("Negative bytes not supported")
      expect(() => fromBytes(-1024)).toThrow("Negative bytes not supported")
    })
  })
})

describe("createByteConverter", () => {
  test("should create converter with default options", () => {
    const converter = createByteConverter({ base: 1000 })

    expect(converter("1kb")).toBe(1000)
    expect(converter("1mb")).toBe(1000 ** 2)
  })

  test("should allow option overrides", () => {
    const converter = createByteConverter({ base: 1000, round: false })

    expect(converter("1kb")).toBe(1000)
    expect(converter("1kb", { base: 1024 })).toBe(1024)
  })

  test("should maintain default options", () => {
    const converter = createByteConverter({ round: false })

    expect(converter("1.7b")).toBe(1.7)
    expect(converter("1.7b", { round: true })).toBe(2)
  })
})

describe("integration tests", () => {
  test("should be reversible for common values", () => {
    const testValues = [1024, 1024 ** 2, 1024 ** 3, Math.round(2.5 * 1024), Math.round(1.5 * 1024 ** 2)]

    testValues.forEach((bytes) => {
      const humanReadable = fromBytes(bytes)
      const backToBytes = toBytes(humanReadable.toLowerCase().replace(" ", "") as ByteInput)
      expect(backToBytes).toBe(bytes)
    })
  })

  test("should handle round trip with different bases", () => {
    const bytes = 2500000 // 2.5MB in base 1000
    const humanReadable = fromBytes(bytes, { base: 1000 })
    const backToBytes = toBytes(humanReadable.toLowerCase().replace(" ", "") as ByteInput, { base: 1000 })

    // Allow small rounding differences
    expect(Math.abs(backToBytes - bytes)).toBeLessThan(1000)
  })
})

describe("performance tests", () => {
  test("should handle many conversions quickly", () => {
    const start = Date.now()

    for (let i = 0; i < 10000; i++) {
      toBytes("1mb")
      toBytes("2.5gb")
      toBytes(`${i}kb`)
    }

    const duration = Date.now() - start
    expect(duration).toBeLessThan(1000) // Should complete in under 1 second
  })
})
