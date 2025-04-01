import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          // res.setHeader("Access-Control-Allow-Origin", "*");
          next();
        });
      }
    }
  ],
  server: {
    proxy: {
      '/github-proxy': { //  Choose a path to prefix your GitHub requests
        target: 'https://codeload.github.com', //  The base URL of GitHub's codeload service
        changeOrigin: true,  //  Important: Changes the origin of the request to the target
        rewrite: (path) => path.replace(/^\/github-proxy/, ''), //  Removes the '/github-proxy' prefix
      },
    },
  }
})
