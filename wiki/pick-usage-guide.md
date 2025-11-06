# Pick Function - Usage Guide

## Overview

The `pick` function creates a new object containing only the specified properties from the original object. It's useful for extracting specific fields from objects, especially when working with API responses or large data structures.

## Installation

```typescript
import { pick } from "@gmana/utils"
```

## Basic Syntax

```typescript
pick(propertyNames, object)
```

- **propertyNames**: An array of strings representing the keys you want to extract
- **object**: The source object to pick properties from
- **Returns**: A new object containing only the specified properties

## Basic Usage

### Extract Specific Properties

```typescript
const user = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "admin",
  createdAt: "2024-01-01",
}

// Pick only safe properties to send to frontend
const safeUser = pick(["id", "name", "email", "role"], user)
// Result: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' }
```

### Curried Usage

The function supports currying, allowing you to create reusable property extractors:

```typescript
// Create a reusable picker
const extractUserInfo = pick(["id", "name", "email"])

const user1 = extractUserInfo({ id: 1, name: "Alice", email: "alice@example.com", password: "123" })
const user2 = extractUserInfo({ id: 2, name: "Bob", email: "bob@example.com", password: "456" })

// Result:
// user1: { id: 1, name: 'Alice', email: 'alice@example.com' }
// user2: { id: 2, name: 'Bob', email: 'bob@example.com' }
```

## Common Use Cases

### 1. API Response Sanitization

Remove sensitive data before sending responses:

```typescript
const dbUser = {
  id: 123,
  username: "johndoe",
  email: "john@example.com",
  passwordHash: "$2b$10$...",
  salt: "random_salt",
  apiKey: "secret_key",
  lastLogin: "2024-11-06",
}

// Only send public data
const publicUser = pick(["id", "username", "email", "lastLogin"], dbUser)
```

### 2. Form Data Extraction

Extract only relevant form fields:

```typescript
const formState = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  phone: "555-1234",
  _isDirty: true,
  _errors: {},
  _touched: {},
}

// Extract only actual form values
const formData = pick(["firstName", "lastName", "email", "phone"], formState)
```

### 3. Mapping Array of Objects

Use with `map` to transform arrays:

```typescript
const users = [
  { id: 1, name: "Alice", email: "alice@example.com", password: "hash1", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", password: "hash2", role: "user" },
  { id: 3, name: "Charlie", email: "charlie@example.com", password: "hash3", role: "user" },
]

// Extract only id and name for a dropdown
const userOptions = users.map(pick(["id", "name"]))
// Result: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]
```

### 4. Configuration Selection

Pick specific configuration options:

```typescript
const fullConfig = {
  apiUrl: 'https://api.example.com',
  apiKey: 'secret_key',
  timeout: 5000,
  retries: 3,
  debug: true,
  logLevel: 'info',
  internalMetrics: { ... }
};

// Extract only client-safe config
const clientConfig = pick(['apiUrl', 'timeout', 'retries'], fullConfig);
```

### 5. Redux/State Management

Extract specific state slices:

```typescript
const appState = {
  user: { id: 1, name: 'John' },
  theme: 'dark',
  language: 'en',
  notifications: [...],
  cache: {...},
  _internal: {...}
};

// Extract only UI-relevant state
const uiState = pick(['user', 'theme', 'language'], appState);
```

## Important Behaviors

### Non-existent Properties

Properties that don't exist in the source object are ignored:

```typescript
const obj = { a: 1, b: 2 }
const result = pick(["a", "c", "d"], obj)
// Result: { a: 1 } - 'c' and 'd' are ignored
```

### Immutability

The original object is never modified:

```typescript
const original = { a: 1, b: 2, c: 3 }
const picked = pick(["a", "b"], original)

console.log(original) // { a: 1, b: 2, c: 3 } - unchanged
console.log(picked) // { a: 1, b: 2 } - new object
```

### Falsy Values

All falsy values are preserved (including `0`, `false`, `null`, `undefined`, `''`):

```typescript
const obj = { a: 0, b: false, c: null, d: undefined, e: "" }
const result = pick(["a", "b", "c", "d", "e"], obj)
// Result: { a: 0, b: false, c: null, d: undefined, e: '' }
```

### Own Properties Only

Only own properties are picked (inherited properties are ignored):

```typescript
const parent = { inherited: "value" }
const child = Object.create(parent)
child.own = "ownValue"

const result = pick(["own", "inherited"], child)
// Result: { own: 'ownValue' } - 'inherited' is not included
```

## TypeScript Support

The function is fully typed and provides excellent IDE autocomplete:

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
  password: "secret",
}

// TypeScript knows the result type
const safeUser = pick(["id", "name"], user)
// Type: Pick<User, 'id' | 'name'>
// Result: { id: number; name: string }
```

## Performance Tips

1. **Reuse curried versions** for repeated operations:

   ```typescript
   // Good - create once, use many times
   const extractBasicInfo = pick(["id", "name"])
   const users = largeArray.map(extractBasicInfo)

   // Less efficient - creates new function each time
   const users = largeArray.map((u) => pick(["id", "name"], u))
   ```

2. **Pick early** to reduce object size in data pipelines:
   ```typescript
   // Good - reduce data early
   const processed = largeDataset.map(pick(["id", "value", "timestamp"])).filter((item) => item.value > 100)
   ```

## When NOT to Use Pick

- **Destructuring is clearer** for known properties:

  ```typescript
  // Instead of: const data = pick(['x', 'y'], point);
  // Use: const { x, y } = point;
  ```

- **You need nested properties** (pick only works on top-level properties):

  ```typescript
  // pick doesn't do this:
  const result = pick(["user.name", "user.email"], obj) // Won't work as expected
  ```

- **You want to exclude properties** (use omit instead - opposite of pick)

## Testing

See `pick.test.ts` for comprehensive test examples covering all use cases and edge cases.

## Questions?

If you have questions or need help with specific use cases, reach out to the team or check the test file for more examples!
