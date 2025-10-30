import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import obfuscator from 'vite-plugin-bundle-obfuscator';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import autoprefixer from 'autoprefixer';
import { cloudflare } from '@cloudflare/vite-plugin';


dotenv.config();

const ASSETS_DIR = 'static';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    cloudflare(),
    svgr(),
    nodePolyfills({
      globals: {
        process: true,
        Buffer: true,
        global: true,
      },
      protocolImports: true,
    }),
    tailwindcss(),
    obfuscator({
      log: false,
      enable: true,
      autoExcludeNodeModules: true,
      threadPool: true,
      options: {
        compact: true,
        stringArray: true,
        stringArrayThreshold: 1,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 1,
        stringArrayEncoding: ['base64', 'rc4'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 5,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 5,
        transformObjectKeys: true,
        identifierNamesGenerator: 'hexadecimal',
        splitStrings: true,
        splitStringsChunkLength: 5,
        unicodeEscapeSequence: true,
      },
    }),
  ],
  envPrefix: ['REACT_APP_'],
  css: {
    postcss: {
      plugins: [
        autoprefixer({}),
      ],
    }
  },
  build: {
    outDir: 'build',
    assetsDir: ASSETS_DIR,
  },
  preview: {
    port: 3000,
    open: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    preserveSymlinks: process.env.NODE_ENV === 'development',
    alias: {
      assert: 'assert',
      buffer: 'buffer',
      path: 'path-browserify',
      crypto: 'crypto-browserify',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
      url: 'url',
    },
  },
  optimizeDeps: {
    exclude: [],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});
