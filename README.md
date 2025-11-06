# @gmana/utils

A comprehensive utility library for common JavaScript/TypeScript operations.

## Installation

```bash
bun install @gmana/utils
```

- [pick](./wiki/pick-usage-guide.md)

## Usage

You can import utilities from `@gmana/utils` as follows:

```typescript
import { absoluteUrl, chunk, clsx, compactObject, toBytes, fromBytes } from "@gmana/utils"
```

## Available Utilities

### absolute-url

URL manipulation and validation utilities.

- `absoluteUrl(path, options?)`: Create an absolute URL from a base and path, with optional query and fragment.
- `isValidUrl(url)`: Check if a string is a valid URL.
- `joinPaths(segments)`: Join multiple path segments into a single path.

```typescript
import { absoluteUrl, isValidUrl, joinPaths } from "@gmana/utils"

// Create absolute URL
const url = absoluteUrl("/api/users", {
  base: "https://example.com",
  query: { page: 1, limit: 10 },
})
// Result: "https://example.com/api/users?page=1&limit=10"

// Validate URL
isValidUrl("https://example.com") // true
isValidUrl("not-a-url") // false

// Join paths
joinPaths(["api", "users", "123"]) // "api/users/123"
```

### array-utils

Comprehensive array manipulation utilities.

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

```typescript
import { chunk, unique, groupBy, compact } from "@gmana/utils"

// Split array into chunks
chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]

// Get unique elements
unique([1, 2, 2, 3, 3, 4]) // [1, 2, 3, 4]

// Group by property
const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Alice", age: 28 },
]
groupBy(users, (user) => user.name)
// Result: { Alice: [...], Bob: [...] }

// Remove falsy values
compact([0, 1, false, 2, "", 3]) // [1, 2, 3]
```

### clsx

Conditional class name utility.

- `clsx(...args)`: Join class names conditionally (string, number, array, or object).

```typescript
import { clsx } from "@gmana/utils"

clsx("base-class", { active: true, disabled: false }, ["nested", "classes"])
// Result: "base-class active nested classes"
```

### cn

Tailwind CSS class name utility with merging.

- `cn(...inputs)`: Merge and deduplicate Tailwind CSS classes using tailwind-merge.

```typescript
import { cn } from "@gmana/utils"

cn("px-2 py-1", "px-4") // "py-1 px-4" (px-2 is overridden by px-4)
```

### compact-object

Object cleaning utilities.

- `compactObject(obj, options?)`: Recursively remove empty values from an object.
- `compactJSONObject(obj, options?)`: Like `compactObject`, but for JSON-serializable objects.

```typescript
import { compactObject } from "@gmana/utils"

const obj = {
  name: "John",
  email: "",
  age: 0,
  address: {
    street: "123 Main St",
    city: "",
    zip: null,
  },
}

compactObject(obj)
// Result: { name: 'John', address: { street: '123 Main St' } }
```

### convert-case

String case conversion utilities.

- `convertCase(input, caseType)`: Convert a string to a specific case (e.g., snake, camel, kebab, etc.).
- `toCase`: Shortcuts for common case conversions (e.g., `toCase.camel(input)`).
- `extractWords(input)`: Extract words from a string.

```typescript
import { convertCase, toCase, extractWords } from "@gmana/utils"

// Convert to different cases
convertCase("hello world", "camel") // "helloWorld"
convertCase("hello world", "snake") // "hello_world"
convertCase("hello world", "kebab") // "hello-world"

// Use shortcuts
toCase.camel("hello world") // "helloWorld"
toCase.snake("hello world") // "hello_world"

// Extract words
extractWords("helloWorld") // ["hello", "World"]
```

### flatten

Object flattening utility.

- `flatten(obj, separator?)`: Flatten a nested object or array into a single-level object.

```typescript
import { flatten } from "@gmana/utils"

const nested = {
  user: {
    name: "John",
    address: {
      city: "New York",
      country: "USA",
    },
  },
}

flatten(nested)
// Result: { "user.name": "John", "user.address.city": "New York", "user.address.country": "USA" }
```

### is

Type checking and validation utilities.

- `isArray`, `isBoolean`, `isDev`, `isEmpty`, `isFunction`, `isNavigator`, `isNumber`, `isObject`, `isString`, `isSymbol`, `isTokenExpired`, `isUndef`, `isUrl`, `isValidComponentName`, `isValidJsonString`: Type and value checks, environment checks, and validation helpers.

```typescript
import { isArray, isEmpty, isUrl, isDev } from "@gmana/utils"

isArray([1, 2, 3]) // true
isEmpty([]) // true
isEmpty({}) // true
isUrl("https://example.com") // true
isDev() // true in development environment
```

### number

Number formatting and conversion utilities.

- `numberToWord(n)`: Convert a number to its word representation in English.
- `numberToWordKm(value, sep?, del?)`: Convert a number to Khmer words.
- `formatNumber(value?, decimalPlaces?)`: Format a number with specified decimal places.
- `formatCurrency(options)`: Format a number as currency.
- `toASCII(s)`, `toKhmer(s)`: Convert between ASCII and Khmer numerals.

```typescript
import { numberToWord, formatNumber, formatCurrency } from "@gmana/utils"

// Convert number to words
numberToWord(1234) // "One Thousand Two Hundred Thirty Four"

// Format number
formatNumber(1234.567, 2) // "1,234.57"

// Format currency
formatCurrency({
  amount: 1234.56,
  currencyCode: "USD",
  locale: "en-US",
}) // "$1,234.56"
```

### v-card

VCard 4.0 contact card generation utility.

- `VCardGenerator.generate(contact)`: Generate a vCard string from contact information.
- `VCardGenerator.createDownloadBlob(contact)`: Create a downloadable blob for the vCard.

```typescript
import { VCardGenerator } from "@gmana/utils"

const contact = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  organization: "Example Corp",
  title: "Software Engineer",
  social: {
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
}

const vcard = VCardGenerator.generate(contact)
const blob = VCardGenerator.createDownloadBlob(contact)
```

### bytes

Byte conversion and formatting utilities.

- `toBytes(input, options?)`: Convert byte input with units to bytes.
- `fromBytes(bytes, options?)`: Convert bytes back to human readable format.
- `createByteConverter(defaultOptions?)`: Create a byte converter with default options.

```typescript
import { toBytes, fromBytes, createByteConverter } from "@gmana/utils"

// Convert to bytes
toBytes("1kb") // 1024
toBytes("1mb") // 1048576
toBytes("2.5gb") // 2684354560
toBytes("1kb", { base: 1000 }) // 1000 (decimal)

// Convert from bytes
fromBytes(1024) // "1.00 KB"
fromBytes(1048576) // "1.00 MB"
fromBytes(1000, { base: 1000 }) // "1.00 KB"

// Create converter with defaults
const converter = createByteConverter({ base: 1000 })
converter("1kb") // 1000
```

### getInitialLetter

```ts
getInitialLetter("jOHN dOE") // JD
```
