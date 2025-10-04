import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"

/** @type {import("eslint").Linter.Config[]} */
const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
]
export default config
