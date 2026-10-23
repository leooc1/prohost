import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './page/login/Login';
import Navbar from './components/navbar/Navbar';
import { getCookieValid } from './utils';

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  
  useEffect(() => {
    const {logged} = getCookieValid('ph_lg_tk_acc')
    setLoggedIn(logged)
  }, []);

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
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        )}
      </BrowserRouter>
    )
  );
}
