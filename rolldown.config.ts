import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"

export default defineConfig({
  input: "src/index.ts",
  treeshake: true,
  external: ["typescript"],
  plugins: [dts()],
  output: {
    dir: "dist",
    format: "esm",
    minify: true,
  },

  define: {
    "process.env.NODE_ENV": "'production'",
    "process.env.BUILD_TIME": `'${new Date().toISOString()}'`,
  },
  preserveEntrySignatures: "strict",
})
