import { useContext, useEffect, useState } from "react"
import { SideBarContext } from "./contexts/SideBarMenuContext"
import { Outlet, useNavigate } from "react-router-dom"
import SidebarMenu from "./components/SidebarMenu"
import TopBar from "./components/TopBar"
import Loader from "./components/Loader";

SidebarMenu

export default function App() {
  const [route, setRoute] = useState('/')
  const navigate = useNavigate()
  const { dataToken, loading } = useContext(SideBarContext)

  useEffect(() => {
    if (!loading) {
      setRoute(location.pathname)
      if (!dataToken && location.pathname !== '/auth') {
        navigate('/auth');
      } else if (dataToken && location.pathname === '/') {
        navigate('/dashboard');
      }
    }
  }, [navigate, dataToken, loading])

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex">
        <>
          <SidebarMenu route={route} />
          <main className="w-full relative bg-zinc-100">
            {route != '/movimentacoes' && route != '/assinatura' && <TopBar />}
            <Outlet />
          </main>
        </>
    </div>
  )
}

