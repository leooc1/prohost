import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './page/login/Login';
import Navbar from './components/navbar/Navbar';
import { getCookieValid } from './utils';
import { Toaster } from 'react-hot-toast';
import Acomodacao from './page/acomodacao/Acomodacao';

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const { logged } = getCookieValid('ph_lg_tk_acc');
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
              <Route
                path="/reserva"
                element={
                  <div className="min-h-dvh w-full flex justify-center items-center">
                    reserva
                  </div>
                }
              />
              <Route
                path="/financeiro"
                element={
                  <div className="min-h-dvh w-full flex justify-center items-center">
                    financeiro
                  </div>
                }
              />
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
