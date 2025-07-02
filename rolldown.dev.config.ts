import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  treeshake: false, // Disable tree-shaking for faster dev builds
  external: ['typescript'],
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
    minify: false, // Disable minification for faster builds
  },
  define: { 
    'process.env.NODE_ENV': "'development'",
    'process.env.BUILD_TIME': `'${new Date().toISOString()}'`
  },
  preserveEntrySignatures: 'allow-extension'
}); 