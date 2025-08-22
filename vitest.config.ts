import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true, // Enable global test functions
    environment: "node", // or 'jsdom' if testing browser code
    coverage: {
      reporter: ["text", "html", "lcov"],
      exclude: ["node_modules/", "dist/", "**/*.test.ts", "**/*.spec.ts"],
    },
  },
})
