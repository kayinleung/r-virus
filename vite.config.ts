import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [
    preact(),
    tsconfigPaths(),
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          // res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  server: {
    proxy: {
      '/github-proxy': { //  Choose a path to prefix your GitHub requests
        target: 'https://codeload.github.com', //  The base URL of GitHub's codeload service
        changeOrigin: true,  //  Important: Changes the origin of the request to the target
        rewrite: (path) => path.replace(/^\/github-proxy/, ''), //  Removes the '/github-proxy' prefix
      },
    },
  },
  base:  process.env.BASE_URL ?? '/r-virus/',
})
