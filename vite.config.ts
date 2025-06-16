import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const getBaseUrl = () => {
  // For main branch deploys and local development use the basic GH Pages projct path
  if (process.env.GITHUB_EVENT_NAME !== 'pull_request') {
    return `/r-virus/`;
  }

  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  const prNumber = process.env.GITHUB_HEAD_REF?.split('/')[2] || ''; // Extract PR number from branch name (e.g., 'pull/3/head')
  const eventNumber = process.env.GITHUB_EVENT_NUMBER || prNumber;

  if (repoName && eventNumber) {
    // For PRs on GitHub Pages, the base is /{repo_name}/pr-previews/{pr_number}/
    return `/${repoName}/pr-previews/${eventNumber}/`;
  }
};

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
  base: getBaseUrl(),
})
