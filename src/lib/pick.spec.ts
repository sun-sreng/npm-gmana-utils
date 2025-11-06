import { describe, it, expect } from "vitest"
import { pick } from "./pick"

describe("pick", () => {
  const obj = { a: 1, b: 2, c: 3, d: 4 }

  describe("basic functionality", () => {
    it("should copy the named properties of an object to a new object", () => {
      const result = pick(["a", "c"], obj)
      expect(result).toEqual({ a: 1, c: 3 })
    })

    it("should work with a single property", () => {
      const result = pick(["a"], obj)
      expect(result).toEqual({ a: 1 })
    })

    it("should return an empty object when given an empty array", () => {
      const result = pick([], obj)
      expect(result).toEqual({})
    })

    it("should return an empty object when given an empty object", () => {
      // @ts-expect-error - we want to test the behavior of the function
      const result = pick(["a", "b"], {})
      expect(result).toEqual({})
    })
  })

  describe("non-existent properties", () => {
    it("should ignore properties that do not exist", () => {
      // @ts-expect-error - we want to test the behavior of the function
      const result = pick(["a", "e", "f"], obj)
      expect(result).toEqual({ a: 1 })
    })

    it("should return an empty object if none of the properties exist", () => {
      // @ts-expect-error - we want to test the behavior of the function
      const result = pick(["x", "y", "z"], obj)
      expect(result).toEqual({})
    })
  })

  describe("currying", () => {
    it("should be curried", () => {
      const pickAC = pick(["a", "c"])
      expect(typeof pickAC).toBe("function")
      expect(pickAC(obj)).toEqual({ a: 1, c: 3 })
    })

    it("should work with curried version on different objects", () => {
      const pickAB = pick(["a", "b"])
      expect(pickAB({ a: 1, b: 2, c: 3 })).toEqual({ a: 1, b: 2 })
      expect(pickAB({ a: 5, b: 6, d: 7 })).toEqual({ a: 5, b: 6 })
    })
  })

  describe("edge cases", () => {
    it("should work with objects containing undefined values", () => {
      const objWithUndefined = { a: 1, b: undefined, c: 3 }
      const result = pick(["a", "b"], objWithUndefined)
      expect(result).toEqual({ a: 1, b: undefined })
    })

    it("should work with objects containing null values", () => {
      const objWithNull = { a: 1, b: null, c: 3 }
      const result = pick(["a", "b"], objWithNull)
      expect(result).toEqual({ a: 1, b: null })
    })

    it("should work with objects containing falsy values", () => {
      const objWithFalsy = { a: 0, b: false, c: "", d: null }
      const result = pick(["a", "b", "c"], objWithFalsy)
      expect(result).toEqual({ a: 0, b: false, c: "" })
    })

    it("should work with numeric property names", () => {
      const objWithNumbers = { 1: "one", 2: "two", 3: "three" }
      // @ts-expect-error - we want to test the behavior of the function
      const result = pick(["1", "3"], objWithNumbers)
      expect(result).toEqual({ 1: "one", 3: "three" })
    })
  })

  describe("immutability", () => {
    it("should not modify the original object", () => {
      const original = { a: 1, b: 2, c: 3 }
      const originalCopy = { ...original }
      pick(["a", "b"], original)
      expect(original).toEqual(originalCopy)
    })

    it("should create a new object", () => {
      const result = pick(["a", "b"], obj)
      expect(result).not.toBe(obj)
    })
  })

  describe("type handling", () => {
    it("should work with objects containing arrays", () => {
      const objWithArray = { a: [1, 2, 3], b: "string", c: 4 }
      const result = pick(["a", "c"], objWithArray)
      expect(result).toEqual({ a: [1, 2, 3], c: 4 })
    })

    it("should work with objects containing nested objects", () => {
      const objWithNested = { a: { nested: "value" }, b: 2, c: 3 }
      const result = pick(["a", "b"], objWithNested)
      expect(result).toEqual({ a: { nested: "value" }, b: 2 })
    })

    it("should work with objects containing functions", () => {
      const fn = () => "test"
      const objWithFunction = { a: fn, b: 2, c: 3 }
      const result = pick(["a", "c"], objWithFunction)
      expect(result).toEqual({ a: fn, c: 3 })
      expect(result.a).toBe(fn)
    })
  })

  describe("special cases", () => {
    it("should handle duplicate keys in the array", () => {
      const result = pick(["a", "a", "b"], obj)
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it("should work with symbol keys", () => {
      const sym = Symbol("test")
      const objWithSymbol = { [sym]: "symbol value", a: 1 }
      // @ts-expect-error - we want to test the behavior of the function
      const result = pick([sym as unknown as string, "a"], objWithSymbol)
      expect(result).toEqual({ [sym]: "symbol value", a: 1 })
    })
  })
})
