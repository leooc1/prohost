import React, { useContext } from "react"
import { SideBarContext } from "../contexts/SideBarMenuContext"

export default function TopBar({ children }: { children?: React.JSX.Element }) {
    const { active, setActive, dataToken } = useContext(SideBarContext)
    function Perfil(nome: string) {
        const array = nome.split(' ')
        const pnome = array[0][0]
        const unome = array[array.length - 1][0]
        if (array.length - 1 == 0)
            return pnome
        else
            return pnome + unome

    }

    return (
        <div className="bg-white w-full shadow-xs h-12 pl-4 pr-6 flex justify-between items-center mb-4">
            <div className="flex h-full">
                <button onClick={() => setActive(!active)}>
                    <svg className="w-7 h-fit transition-all duration-75 hover:brightness-50" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 24 24"><g><symbol id="d" viewBox="0 -48 48 48"></symbol><symbol id="c" viewBox="0 -48 48 48"><g clip-path="url(#a)"><g stroke="#000" stroke-miterlimit="10" stroke-width=".25"><path d="M2-48V0M4-48V0M6-48V0M8-48V0M10-48V0M12-48V0M14-48V0M16-48V0M18-48V0M20-48V0M22-48V0M24-48V0M26-48V0M28-48V0M30-48V0M32-48V0M34-48V0M36-48V0M38-48V0M40-48V0M42-48V0M44-48V0M46-48V0" fill="" opacity="1"></path></g><g fill="none" stroke="#000" stroke-miterlimit="10" stroke-width=".25"><path d="M0-2h48M0-4h48M0-6h48M0-8h48M0-10h48M0-12h48M0-14h48M0-16h48M0-18h48M0-20h48M0-22h48M0-24h48M0-26h48M0-28h48M0-30h48M0-32h48M0-34h48M0-36h48M0-38h48M0-40h48M0-42h48M0-44h48M0-46h48" fill="" opacity="1"></path></g><path d="M47.75-.25v-47.5H.25v47.5zM48 0H0v-48h48z" fill="#37425A" opacity="1"></path></g></symbol><clipPath id="a"><path d="M0-48h48V0H0z" fill="#37425A" opacity="1"></path></clipPath><symbol id="e" viewBox="0 -48 48 48"><g opacity=".4"><g clip-path="url(#b)"><path d="M47.75-.25v-47.5H.25v47.5zM48 0H0v-48h48z" fill="#37425A" opacity="1"></path></g></g></symbol><clipPath id="b"><path d="M0-48h48V0H0z" fill="#37425A" opacity="1"></path></clipPath><path d="M4 12a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM4 7a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM4 17a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z" fill="#37425A" opacity="1" ></path></g></svg>
                </button>
                {children}
            </div>
            <div className="flex items-center gap-7">
                <button>
                    <svg className="w-7 h-fit transition-all duration-75 hover:brightness-50" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 90 90"><g><path d="M55.434 72.521c0 3.712-1.979 6.553-5.193 8.41a10.37 10.37 0 0 1-10.379 0c-3.215-1.857-5.193-4.698-5.193-8.41M45.049 7.708c2.832 0 5.113 1.746 5.113 4.431 0 1.69.059 2.951 1.121 3.274 9.031 2.727 14.822 9.119 14.822 17.42v13.952c0 6.392 2.615 7.686 5.906 10.131 4.766 3.535 3.678 10.896-1.791 10.891H19.88c-5.469.005-6.557-7.356-1.791-10.891 3.287-2.445 5.906-3.739 5.906-10.131V32.833c0-8.301 5.791-14.693 14.822-17.42 1.059-.323 1.121-1.584 1.121-3.274.001-2.685 2.283-4.431 5.111-4.431z" fill="#37425A" opacity="1" data-original="#000000"></path></g></svg>
                </button>
                <div className="w-8 h-8 flex justify-center items-center rounded-full bg-[#B1C2D9] text-white font-medium">
                    {dataToken?Perfil(dataToken.nome):'NOTw'}
                </div>
            </div>
        </div>
    )
}
