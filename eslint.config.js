import prettier from "eslint-config-prettier"
import typescriptEslint from "typescript-eslint"

const prettierConfigs = Array.isArray(prettier) ? prettier : [prettier]

const config = [
  ...typescriptEslint.config(...typescriptEslint.configs.recommended, ...prettierConfigs),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    rules: {
      "prettier/prettier": "error",
    },
    plugins: {
      prettier: prettierConfigs[0],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "**/*.test.tsx", "**/*.spec.tsx"],
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },
]

module.exports = config
