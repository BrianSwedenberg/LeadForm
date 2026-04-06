import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Inlines the generated CSS into the JS bundle so the embed is a single file.
// No external dependency — under 20 lines of native Rollup plugin API.
function injectCss(): Plugin {
  let css = ''
  return {
    name: 'css-inject',
    apply: 'build',
    generateBundle(_, bundle) {
      for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset' && name.endsWith('.css')) {
          css = chunk.source as string
          delete bundle[name]
        }
      }
    },
    renderChunk(code) {
      if (!css) return null
      const inject = `;(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s)})()`
      return { code: inject + '\n' + code, map: null }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), injectCss()],
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'LeadForm',
      fileName: () => 'lead-form.js',
      formats: ['iife'],
    },
    outDir: 'dist/embed',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
