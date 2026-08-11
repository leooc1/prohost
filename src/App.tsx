import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarMenu from "./components/SidebarMenu";
import TopBar from "./components/TopBar";
import { SideBarProvider } from "./contexts/SideBarMenuContext";

SidebarMenu;

export default function App() {
  const [route, setRoute] = useState("/");
  const navigate = useNavigate();
  useEffect(() => {
    setRoute(location.pathname);
    if (location.pathname == "/") navigate("/dashboard");
  }, [navigate, route]);

  return (
    <div className="flex">
      <SideBarProvider>
        <>
          <SidebarMenu route={route} />
          <main className="w-full relative bg-zinc-100">
            {location.pathname != "/movimentacoes" &&
              location.pathname != "/assinatura" && <TopBar />}
            <Outlet />
          </main>
        </>
      </SideBarProvider>
    </div>
  );
}
