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
import Cadastro from './components/assinatura/Cadastro.tsx'
import FormaPagamento from './components/assinatura/FormaPagamento.tsx'
import Pix from './components/assinatura/Pix.tsx'
import Boleto from './components/assinatura/Boleto.tsx'
import CartaoCredito from './components/assinatura/CartaoCredito.tsx'
import { AssinaturaProvider } from './contexts/AssinaturaContext.tsx'

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
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    errorElement: <NotFound />,
  },
  {
    path: "/assinar",
    element: <AssinaturaProvider>
      <Assinar />
    </AssinaturaProvider>,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Cadastro />,
      },
      {
        path: "forma-pagamento",
        element: <FormaPagamento />,
        errorElement: <NotFound />,
      },
      {
        path: "pix",
        element: <Pix />,
      },
      {
        path: "boleto",
        element: <Boleto />,
      },
      {
        path: "credit-card",
        element: <CartaoCredito />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
