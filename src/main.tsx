import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '../styles/index.css'
import App from './App.tsx'
import NotFound from './NotFound.tsx'
import Dashboard from './pages/Dashboard.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard/>,
      },
      {
        path: "/reservas",
        element: <></>,
      },
      {
        path: "/acomodacoes",
        element: <></>,
      },
      {
        path: "/hospedes",
        element: <></>,
      },
      {
        path: "/movimentacoes",
        element: <></>,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
