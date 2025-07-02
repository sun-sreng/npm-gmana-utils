import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  treeshake: true,
  external: ['typescript'],
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
    minify: true,
  },
  define: { 
    'process.env.NODE_ENV': "'production'",
    'process.env.BUILD_TIME': `'${new Date().toISOString()}'`
  },
  preserveEntrySignatures: 'strict'
});