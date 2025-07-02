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

Import only what you need:

```ts
import { chunk, flatten, clsx } from "@gmana/utils";
```

## Publishing to npmjs

This package is named `@gmana/utils` on npm. To publish it, follow these steps:

1. **Login to npm (if not already authenticated):**

   ```sh
   npm login
   ```

   Make sure you have access to the `@gmana` scope or organization on npm.

2. **Build the package:**

   ```sh
   npm run build:all
   ```

   This will generate the production build and type declarations in the `dist/` folder.

3. **Check the package contents:**
   Ensure that only the intended files (e.g., `dist/`, `README.md`) are included, as specified in the `files` field of `package.json`.

4. **Publish to npm:**

   ```sh
   npm publish --access public
   ```

   The `--access public` flag is required for scoped packages like `@gmana/utils`.

5. **Verify:**
   After publishing, check https://www.npmjs.com/package/@gmana/utils to confirm the new version is available.

**Note:**

- Update the version in `package.json` before publishing a new release.
- You must have permission to publish to the `@gmana` scope on npm.

## Detailed Publishing Example

### 1. Update the Version

Before publishing, update the version in `package.json` according to [semver](https://semver.org/):

```json
{
  "version": "1.2.0"
}
```

You can use npm to bump the version automatically:

```sh
npm version patch   # or minor, major
```

### 2. Login to npm (if not already authenticated)

If you haven't logged in before, or your session expired:

```sh
npm login
```

- Enter your npm username, password, and email.
- If your account has 2FA enabled, enter the OTP code.
- Make sure your user has permission to publish to the `@gmana` scope.

### 3. Build the Package

Run the build script to generate the output in `dist/`:

```sh
npm run build:all
```

### 4. Check the Package Contents

Preview what will be published:

```sh
npm pack --dry-run
```

This shows the files that will be included, based on the `files` field in `package.json`.

### 5. Publish to npm

Publish the package with the correct access:

```sh
npm publish --access public
```

- The `--access public` flag is required for scoped packages (like `@gmana/utils`).
- If you see a permissions error, check your npm organization membership and scope access.

#### Example publish output:

```
$ npm publish --access public
npm notice
npm notice 📦  @gmana/utils@1.2.0
npm notice === Tarball Contents ===
dist/index.js
README.md
...
npm notice === Tarball Details ===
...
npm notice Published to: https://www.npmjs.com/package/@gmana/utils
```

### 6. Verify the Release

Go to https://www.npmjs.com/package/@gmana/utils and check that your new version is listed.

### Troubleshooting

- **2FA issues:** If you have 2FA enabled, you may need to provide a one-time password (OTP) during publish.
- **Permission denied:** Make sure you are a member of the `@gmana` organization and have publish rights.
- **Scoped package errors:** Always use `--access public` for first-time publish of a scoped package.
- **Forgot to build:** If you publish without building, the `dist/` folder may be missing. Always run `npm run build:all` first.

For more, see the [npm docs on publishing](https://docs.npmjs.com/cli/v10/commands/npm-publish).
