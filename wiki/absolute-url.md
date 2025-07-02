# `absolute-url` Utilities

This module provides utility functions for working with URLs, including creating absolute URLs, validating URLs, and joining path segments.

## `absoluteUrl`

Creates an absolute URL by combining a base URL with a relative path. Handles query parameters and fragments.

**Signature:**

```
absoluteUrl(path?: string | null, options?: {
  query?: Record<string, string | number | boolean | null | undefined>
  fragment?: string
  baseUrl?: string
}): string
```

- `path`: The relative path to append to the base URL. Can be null, undefined, empty, or whitespace.
- `options.query`: An object of query parameters to append to the URL. Keys with `null` or `undefined` values are omitted.
- `options.fragment`: A string fragment to append after `#` (will be URI encoded).
- `options.baseUrl`: The base URL to use. If not provided, uses `process.env.NEXT_PUBLIC_APP_URL` or defaults to `http://localhost:3000`.

Returns the absolute URL as a string. Throws an error if the base URL is invalid.

**Examples:**

- `absoluteUrl("/api/users")` → `https://example.com/api/users`
- `absoluteUrl("api/users")` → `https://example.com/api/users`
- `absoluteUrl("")` → `https://example.com`
- `absoluteUrl(null)` → `https://example.com`
- `absoluteUrl("/api/users", { query: { id: "123" } })` → `https://example.com/api/users?id=123`
- `absoluteUrl("/api/users", { fragment: "section1" })` → `https://example.com/api/users#section1`

## `isValidUrl`

Checks if a string is a valid URL.

**Signature:**

```
isValidUrl(url: string): boolean
```

Returns `true` if the input is a valid URL, otherwise `false`.

**Examples:**

- `isValidUrl("https://example.com")` → `true`
- `isValidUrl("not-a-url")` → `false`

## `joinPaths`

Joins multiple URL path segments into a single path, ensuring proper slashes.

**Signature:**

```
joinPaths(segments: (string | null | undefined)[]): string
```

- Ignores empty, null, or undefined segments.
- Removes leading/trailing slashes from segments before joining.
- Always returns a path starting with `/`.

**Examples:**

- `joinPaths(["api", "users", "123"])` → `/api/users/123`
- `joinPaths(["", "api", "users"])` → `/api/users`
