# @gmana/utils

## Installation

```bash
bun install @gmana/utils
```

## Usage

You can import utilities from `@gmana/utils` as follows:

### absolute-url

- `absoluteUrl(path, options?)`: Create an absolute URL from a base and path, with optional query and fragment.
- `isValidUrl(url)`: Check if a string is a valid URL.
- `joinPaths(segments)`: Join multiple path segments into a single path.

### array-utils

- `chunk(array, size)`: Split an array into chunks.
- `unique(array)`, `uniqueBy(array, keyFn)`: Get unique elements.
- `groupBy(array, keyFn)`: Group elements by a key.
- `flattenArray(array)`, `flattenDeepArray(array)`: Flatten arrays.
- `intersection(array1, array2)`, `difference(array1, array2)`, `symmetricDifference(array1, array2)`: Set operations.
- `partition(array, predicate)`: Partition array by predicate.
- `compact(array)`: Remove falsy values.
- `take(array, n)`, `takeRight(array, n)`, `drop(array, n)`, `dropRight(array, n)`: Slice arrays.
- `shuffle(array)`, `sample(array, n)`: Shuffle or sample elements.
- `sortBy(array, ...selectors)`: Sort by multiple criteria.
- `groupConsecutive(array, keyFn)`: Group consecutive elements by key.
- `maxBy(array, selector)`, `minBy(array, selector)`: Find max/min by selector.
- `sumBy(array, selector)`, `meanBy(array, selector)`: Sum/average by selector.
- `countBy(array, keyFn)`: Count occurrences by key.
- `zip(...arrays)`: Zip arrays together.

### clsx

- `clsx(...args)`: Join class names conditionally (string, number, array, or object).

### compact-object

- `compactObject(obj, options?)`: Recursively remove empty values from an object.
- `compactJSONObject(obj, options?)`: Like `compactObject`, but for JSON-serializable objects.

### convert-case

- `convertCase(input, caseType)`: Convert a string to a specific case (e.g., snake, camel, kebab, etc.).
- `toCase`: Shortcuts for common case conversions (e.g., `toCase.camel(input)`).
- `extractWords(input)`: Extract words from a string.

### flatten

- `flatten(obj, separator?)`: Flatten a nested object or array into a single-level object.

### is

- `isArray`, `isBoolean`, `isDev`, `isEmpty`, `isFunction`, `isNavigator`, `isNumber`, `isObject`, `isString`, `isSymbol`, `isTokenExpired`, `isUndef`, `isUrl`, `isValidComponentName`, `isValidJsonString`: Type and value checks, environment checks, and validation helpers.
