# `array-utils` Utilities

This module provides enhanced array utility functions with improved type safety and additional features.

---

## `chunk`

Splits an array into chunks of specified size.

**Signature:**

```
chunk(array: T[], size: number): T[][]
```

- `chunk([1,2,3,4,5], 2)` → `[[1,2],[3,4],[5]]`

## `unique`

Returns unique elements from an array.

**Signature:**

```
unique(array: T[]): T[]
```

- `unique([1,2,2,3])` → `[1,2,3]`

## `uniqueBy`

Returns unique elements based on a key function.

**Signature:**

```
uniqueBy(array: T[], keyFn: (item: T) => K): T[]
```

- `uniqueBy([{id:1},{id:2},{id:1}], x => x.id)` → `[{id:1},{id:2}]`

## `groupBy`

Groups array elements by a key function.

**Signature:**

```
groupBy(array: T[], key: (item: T) => K): Record<K, T[]>
```

- `groupBy([1,2,3,4], x => x % 2)` → `{0: [2,4], 1: [1,3]}`

## `flattenArray`

Flattens a nested array by one level.

**Signature:**

```
flattenArray(array: (T | T[])[]): T[]
```

- `flattenArray([1, [2, 3], 4])` → `[1,2,3,4]`

## `flattenDeepArray`

Deeply flattens a nested array.

**Signature:**

```
flattenDeepArray(array: (T | (T | T[])[])[]): T[]
```

- `flattenDeepArray([1, [2, [3, 4]], 5])` → `[1,2,3,4,5]`

## `intersection`

Returns the intersection of two arrays.

**Signature:**

```
intersection(array1: T[], array2: T[]): T[]
```

- `intersection([1,2,3], [2,3,4])` → `[2,3]`

## `difference`

Returns the difference between two arrays (items in first but not second).

**Signature:**

```
difference(array1: T[], array2: T[]): T[]
```

- `difference([1,2,3], [2,4])` → `[1,3]`

## `symmetricDifference`

Returns the symmetric difference between two arrays.

**Signature:**

```
symmetricDifference(array1: T[], array2: T[]): T[]
```

- `symmetricDifference([1,2,3], [2,3,4])` → `[1,4]`

## `partition`

Partitions an array into two arrays based on a predicate.

**Signature:**

```
partition(array: T[], predicate: (item: T, index: number) => boolean): [T[], T[]]
```

- `partition([1,2,3,4], x => x % 2 === 0)` → `[[2,4],[1,3]]`

## `compact`

Removes falsy values from an array.

**Signature:**

```
compact(array: (T | null | undefined | false | 0 | "")[]): T[]
```

- `compact([0, 1, false, 2, '', 3])` → `[1,2,3]`

## `take`

Takes n elements from the beginning of an array.

**Signature:**

```
take(array: T[], n: number): T[]
```

- `take([1,2,3,4], 2)` → `[1,2]`

## `takeRight`

Takes elements from the end of an array.

**Signature:**

```
takeRight(array: T[], n: number): T[]
```

- `takeRight([1,2,3,4], 2)` → `[3,4]`

## `drop`

Drops n elements from the beginning of an array.

**Signature:**

```
drop(array: T[], n: number): T[]
```

- `drop([1,2,3,4], 2)` → `[3,4]`

## `dropRight`

Drops elements from the end of an array.

**Signature:**

```
dropRight(array: T[], n: number): T[]
```

- `dropRight([1,2,3,4], 2)` → `[1,2]`

## `shuffle`

Shuffles an array using the Fisher-Yates algorithm.

**Signature:**

```
shuffle(array: T[]): T[]
```

- `shuffle([1,2,3])` → `[2,1,3]` (order will vary)

## `sample`

Returns a random sample of n elements from an array.

**Signature:**

```
sample(array: T[], n?: number): T[]
```

- `sample([1,2,3,4], 2)` → `[3,1]` (order will vary)

## `sortBy`

Sorts an array by multiple criteria.

**Signature:**

```
sortBy(array: T[], ...selectors: ((item: T) => unknown)[]): T[]
```

- `sortBy([{a:2},{a:1}], x => x.a)` → `[{a:1},{a:2}]`

## `groupConsecutive`

Creates an array of arrays, grouping consecutive elements by a key function.

**Signature:**

```
groupConsecutive(array: T[], keyFn: (item: T) => K): T[][]
```

- `groupConsecutive([1,1,2,2,1], x => x)` → `[[1,1],[2,2],[1]]`

## `maxBy`

Finds the maximum element in an array based on a selector function.

**Signature:**

```
maxBy(array: T[], selector: (item: T) => number): T | undefined
```

- `maxBy([{a:1},{a:3},{a:2}], x => x.a)` → `{a:3}`

## `minBy`

Finds the minimum element in an array based on a selector function.

**Signature:**

```
minBy(array: T[], selector: (item: T) => number): T | undefined
```

- `minBy([{a:1},{a:3},{a:2}], x => x.a)` → `{a:1}`

## `sumBy`

Calculates the sum of array elements based on a selector function.

**Signature:**

```
sumBy(array: T[], selector: (item: T) => number): number
```

- `sumBy([{a:1},{a:2},{a:3}], x => x.a)` → `6`

## `meanBy`

Calculates the average of array elements based on a selector function.

**Signature:**

```
meanBy(array: T[], selector: (item: T) => number): number
```

- `meanBy([{a:1},{a:2},{a:3}], x => x.a)` → `2`

## `countBy`

Counts occurrences of each element in an array.

**Signature:**

```
countBy(array: T[], keyFn: (item: T) => K): Record<K, number>
```

- `countBy(['a','b','a'], x => x)` → `{a:2, b:1}`

## `zip`

Zips multiple arrays together.

**Signature:**

```
zip(...arrays: T): Array<{ [K in keyof T]: T[K] extends readonly (infer U)[] ? U : never }>
```

- `zip([1,2],["a","b"])` → `[[1,"a"],[2,"b"]]`
