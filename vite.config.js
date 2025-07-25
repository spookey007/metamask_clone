// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_SERVER_URL || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': [
              'react',
              'react-dom',
              'react-toastify',
              'framer-motion',
              '@solana/web3.js',
              '@solana/spl-token'
            ],
            'ui': [
              './src/components/Header.jsx',
              './src/components/MobileHeader.jsx',
              './src/components/DesktopHeader.jsx',
              './src/components/Footer.jsx',
              './src/components/Loader.jsx',
            ],
            'wallet': [
              './src/components/WalletConnectModal.jsx',
              './src/components/InsuranceModal.jsx'
            ]
          }
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true
          })
        ]
      }
    },
    resolve: {
      alias: {
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: 'util',
        buffer: 'buffer'
      }
    },
  };
});