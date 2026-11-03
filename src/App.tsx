import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Acomodacao from "./page/acomodacao/Acomodacao";
import Financeiro from "./page/financeiro/Financeiro";
import Login from "./page/login/Login";
import Reserva from "./page/reserva/Reserva";
import Calendario from "./page/reserva/calendario/Calendario";
import Lista from "./page/reserva/lista/Lista";
import { getCookieValid } from "./utils";
import Todas from "./page/financeiro/todas/Todas";
import Receitas from "./page/financeiro/receitas/Receitas";
import Despesas from "./page/financeiro/despesas/Despesas";

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const { logged } = getCookieValid("ph_lg_tk_acc");
    setLoggedIn(logged);
  }, [location.pathname]);

  return (
    loggedIn !== null && (
      <BrowserRouter>
        {!loggedIn ? (
          <Routes>
            <Route path="/auth" element={<Login />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route element={<Navbar />}>
              <Route path="/acomodacao" element={<Acomodacao />} />
              <Route path="/reserva" element={<Reserva />}>
                <Route
                  index
                  element={<Navigate to="/reserva/calendario" replace />}
                />
                <Route path="calendario" element={<Calendario />} />
                <Route path="lista" element={<Lista />} />
              </Route>
              <Route path="/financeiro" element={<Financeiro />}>
                <Route index element={<Todas />} />
                <Route path="receita" element={<Receitas />} />
                <Route path="despesa" element={<Despesas />} />
              </Route>
              <Route
                path="/dashboard"
                element={
                  <div className="min-h-dvh w-full flex justify-center items-center">
                    dashboard
                  </div>
                }
              />
              <Route
                path="/relatorio"
                element={
                  <div className="min-h-dvh w-full flex justify-center items-center">
                    relatorio
                  </div>
                }
              />
              <Route
                path="/hospede"
                element={
                  <div className="min-h-dvh w-full flex justify-center items-center">
                    hospede
                  </div>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          </Routes>
        )}
        <Toaster position="top-center" />
      </BrowserRouter>
    )
  );
}
