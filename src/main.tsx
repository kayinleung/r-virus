// import { StrictMode } from 'preact/compat';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


// TODO: Add another "Info" page
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Error</div>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
  </>,
)
