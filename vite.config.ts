import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.glb'],

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core — always needed, cached aggressively
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react-vendor';
          }

          // Framer Motion — heavy animation library
          if (id.includes('node_modules/motion') ||
              id.includes('node_modules/framer-motion')) {
            return 'motion-vendor';
          }

          // Three.js ecosystem — only loaded for 3D model viewer
          if (id.includes('node_modules/three') ||
              id.includes('node_modules/@react-three') ||
              id.includes('node_modules/@threlte') ||
              id.includes('node_modules/troika') ||
              id.includes('node_modules/meshline')) {
            return 'three-vendor';
          }

          // Supabase — auth & API client
          if (id.includes('node_modules/@supabase') ||
              id.includes('node_modules/supabase')) {
            return 'supabase-vendor';
          }

          // Remaining large UI/utility libs
          if (id.includes('node_modules/@radix-ui') ||
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/sonner') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge')) {
            return 'ui-vendor';
          }

          // Recharts — only needed in AdminDashboard, never seen by shoppers
          if (id.includes('node_modules/recharts') ||
              id.includes('node_modules/d3-') ||
              id.includes('node_modules/victory-vendor')) {
            return 'charts-vendor';
          }
        },
      },
    },
    // Three.js is ~942KB minified — this is its unavoidable baseline size.
    // All other chunks are well below 500KB so raising the limit is safe.
    chunkSizeWarningLimit: 1000,
  },
})
