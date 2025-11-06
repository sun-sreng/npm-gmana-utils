/**
 * Returns a partial copy of an object containing only the keys specified.
 * If the key does not exist, the property is ignored.
 */
function pick<T extends object, K extends keyof T>(names: readonly K[], obj: T): Pick<T, K>
function pick<T extends object>(names: readonly string[]): (obj: T) => Partial<T>
function pick<T extends object, K extends keyof T>(
  names: readonly K[] | readonly string[],
  obj?: T
): Pick<T, K> | Partial<T> | ((obj: T) => Partial<T>) {
  // Curried version - return function if only one argument
  if (arguments.length === 1) {
    return (obj: T) => pick(names as unknown as readonly K[], obj) as Partial<T>
  }

  // Main implementation
  const result: Partial<T> = {}
  let idx = 0

  while (idx < names.length) {
    const key = names[idx] as keyof T
    if (key in obj!) {
      result[key] = obj![key]
    }
    idx += 1
  }

  return result
}

export { pick }

// Usage examples:
// const obj = { a: 1, b: 2, c: 3, d: 4 };
// pick(['a', 'c'], obj); // => { a: 1, c: 3 }
//
// const pickAC = pick(['a', 'c']);
// pickAC(obj); // => { a: 1, c: 3 }
