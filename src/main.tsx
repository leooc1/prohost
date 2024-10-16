import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '../styles/index.css'
import App from './App.tsx'
import NotFound from './NotFound.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Reserva from './pages/Reserva.tsx'
import Acomodacoes from './pages/Acomodacoes.tsx'
import AcomodacoesDetalhes from './pages/AcomodacoesDetalhes.tsx'
import Hospede from './pages/Hospede.tsx'
import Financeiro from './pages/Financeiro.tsx'
import Auth from './pages/Auth.tsx'
import Assinar from './pages/Assinar.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/reservas",
        element: <Reserva />,
      },
      {
        path: "/acomodacoes",
        element: <Acomodacoes />,
      },
      {
        path: "/acomodacoes/:id",
        element: <AcomodacoesDetalhes />,
      },
      {
        path: "/hospedes",
        element: <Hospede />,
      },
      {
        path: "/movimentacoes",
        element: <Financeiro />,
      },
    ]
  },
  {
    path: "/auth",
    element: <Auth />,
    errorElement: <NotFound />,
  },
  {
    path: "/assinar",
    element: <Assinar />,
    errorElement: <NotFound />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
