import { useEffect, useState } from "react"
import { SideBarProvider } from "./contexts/SideBarMenuContext"
import { Outlet, useNavigate } from "react-router-dom"
import SidebarMenu from "./components/SidebarMenu"
import TopBar from "./components/TopBar"

SidebarMenu

export default function App() {
  const [route, setRoute] = useState('/')
  const navigate = useNavigate()
  useEffect(() => {
    setRoute(location.pathname)
    if (location.pathname == '/')
      navigate('/dashboard')

  }, [navigate])

  return (
    <div className="flex">
      <SideBarProvider >
        <>
          <SidebarMenu route={route} />
          <main className="w-full relative bg-zinc-100">
            {route != '/movimentacoes' && <TopBar />}
            <Outlet />
          </main>
        </>
      </SideBarProvider>
    </div>
  )
}

