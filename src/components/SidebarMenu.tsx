import { useContext, useState } from 'react'
import prohostLogo from '../../public/prohost-logo.png'
import { SideBarContext } from '../contexts/SideBarMenuContext'

export default function SidebarMenu({ route }: { route: string }) {
    const [refresh, setRefresh] = useState<boolean>(true)
    async function infoToken() {
        const token = window.localStorage.getItem('ph_token_acc')
        if (token) {
            await fetch(`http://localhost:3000/users/token/${token}`, {
                method: 'GET'
            })
                .then(data => {
                    if (data.status == 500) {
                        window.location.assign('/auth')
                    }
                    else {
                        return data.json()
                    }
                })
                .then((data) => {
                    setDataToken(data)
                })
                .catch(err => console.log(err))
        }
        else{
            window.location.assign('/auth')
        }
        setRefresh(false)
    }
    if (refresh) {
        infoToken()
    }
    const { active, setDataToken } = useContext(SideBarContext)
    return (
        <nav className={`bg-primary sticky top-0 left-0 h-screen ${active ? 'w-56' : 'w-20'} flex flex-col justify-between`}>
            <div>
                <a href={'/'} className='flex py-5 gap-2 px-7 justify-center'>
                    {active ?
                        <>
                            <img src={prohostLogo} alt='Logo ProHost' width={32} height={32} />
                            <h1 className='text-white font-bold text-3xl tracking-tight'>
                                prohost
                            </h1>
                        </> :
                        <h1 className='text-white font-bold text-3xl tracking-tight'>
                            <span className='text-secondary'>p</span><span>h</span>
                        </h1>
                    }
                </a>
                <hr className='opacity-25' />
                <ul className='flex flex-col gap-2 mt-6 items-center'>
                    <li>
                        <a href={'/dashboard'} className={`${route == '/dashboard' ? 'nav-active' : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? 'w-44' : 'w-fit justify-center'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#ACDBFF' viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h240v-560H200v560Zm320 0h240v-280H520v280Zm0-360h240v-200H520v200Z" /></svg>
                            {active && <p className='text-zinc-300'>Dashboard</p>}
                        </a>
                    </li>
                    <li>
                        <a href={'/reservas'} className={`${route == '/reservas' ? 'nav-active' : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? 'w-44' : 'w-fit justify-center'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#ACDBFF' viewBox="0 -960 960 960" width="24"><path d="M438-226 296-368l58-58 84 84 168-168 58 58-226 226ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" /></svg>
                            {active && <p className='text-zinc-300'>Reserva</p>}
                        </a>
                    </li>
                    <li>
                        <a href={'/acomodacoes'} className={`${route == '/acomodacoes' ? 'nav-active' : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? 'w-44' : 'w-fit justify-center'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#ACDBFF' viewBox="0 -960 960 960" width="24"><path d="M680-600h80v-80h-80v80Zm0 160h80v-80h-80v80Zm0 160h80v-80h-80v80Zm0 160v-80h160v-560H480v56l-80-58v-78h520v720H680Zm-640 0v-400l280-200 280 200v400H360v-200h-80v200H40Zm80-80h80v-200h240v200h80v-280L320-622 120-480v280Zm560-360ZM440-200v-200H200v200-200h240v200Z" /></svg>
                            {active && <p className='text-zinc-300'>Acomodações</p>}
                        </a>
                    </li>
                    <li>
                        <a href={'/hospedes'} className={`${route == '/hospedes' ? 'nav-active' : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? 'w-44' : 'w-fit justify-center'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#ACDBFF' viewBox="0 -960 960 960" width="24"><path d="M480-40 360-160H200q-33 0-56.5-23.5T120-240v-560q0-33 23.5-56.5T200-880h560q33 0 56.5 23.5T840-800v560q0 33-23.5 56.5T760-160H600L480-40ZM200-286q54-53 125.5-83.5T480-400q83 0 154.5 30.5T760-286v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM280-240h400v-10q-42-35-93-52.5T480-320q-56 0-107 17.5T280-250v10Zm200-320q-25 0-42.5-17.5T420-620q0-25 17.5-42.5T480-680q25 0 42.5 17.5T540-620q0 25-17.5 42.5T480-560Zm0 17Z" /></svg>
                            {active && <p className='text-zinc-300'>Hóspedes</p>}
                        </a>
                    </li>
                    <li>
                        <a href={'/movimentacoes'} className={`${route == '/movimentacoes' ? 'nav-active' : null} flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? 'w-44' : 'w-fit justify-center'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#ACDBFF' viewBox="0 -960 960 960" width="24"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                            {active && <p className='text-zinc-300'>Financeiro</p>}
                        </a>
                    </li>
                    <li>
                        <a href={'/assinatura'} className={`flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? 'w-44' : 'w-fit justify-center'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#ACDBFF' viewBox="0 -960 960 960" width="24"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" /></svg>
                            {active && <p className='text-zinc-300'>Configurações</p>}
                        </a>
                    </li>
                    <li>
                        <a href={'/'} className={`flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover ${active ? 'w-44' : 'w-fit justify-center'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#ACDBFF' viewBox="0 -960 960 960" width="24"><path d="M720-440v-80h160v80H720Zm48 280-128-96 48-64 128 96-48 64Zm-80-480-48-64 128-96 48 64-128 96ZM200-200v-160h-40q-33 0-56.5-23.5T80-440v-80q0-33 23.5-56.5T160-600h160l200-120v480L320-360h-40v160h-80Zm240-182v-196l-98 58H160v80h182l98 58Zm120 36v-268q27 24 43.5 58.5T620-480q0 41-16.5 75.5T560-346ZM300-480Z" /></svg>
                            {active && <p className='text-zinc-300'>Feedback</p>}
                        </a>
                    </li>
                </ul>
            </div>
            <div className='pb-5'>
                <a href={'/auth'} className={`flex items-center py-3 gap-3 px-4 rounded-md transition-all nav-hover mx-auto ${active ? 'w-44' : 'w-fit justify-center'}`}
                    onClick={(e) => {
                        e.preventDefault()
                        window.localStorage.removeItem('ph_token_acc')
                        window.location.assign('/auth')
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#ACDBFF' viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" /></svg>
                    {active && <p className='text-zinc-300'>Sair</p>}
                </a>
            </div>
        </nav>
    )
}
