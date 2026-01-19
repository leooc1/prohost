import { createContext, useState } from 'react';

export const SideBarContext = createContext({} as any);

export const SideBarProvider = ({ children }: { children: React.JSX.Element }) => {
    const [active, setActive] = useState<boolean>(true)
    const [statusData, setStatusData] = useState<{
        pagamento: string,
        qtd_acomodacao: number,
        status: string,
        trial_end: string
    } | null>(null)
    const [dataToken, setDataToken] = useState<{
        id: number,
        nome: string,
        is_admin?: boolean
    } | null>(null)

    return (
        <SideBarContext.Provider value={{
            active, setActive,
            dataToken, setDataToken,
            statusData, setStatusData
        }}>
            {children}
        </SideBarContext.Provider>
    )
}