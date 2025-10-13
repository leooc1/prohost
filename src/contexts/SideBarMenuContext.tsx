import { createContext, useState, useEffect } from 'react';

export const SideBarContext = createContext({} as any);

export const SideBarProvider = ({ children }: { children: React.JSX.Element }) => {
    const [active, setActive] = useState<boolean>(true)
    const [statusData, setStatusData] = useState<{
        pagamento: string,
        qtd_acomodacao: number,
        status: string,
        trial_end: string
    } | null>(null)
    const [dataToken, setDataToken] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const token = window.localStorage.getItem('ph_token_acc');
        if (token) {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            setDataToken(tokenData);
        }
        setLoading(false);
    }, []);

    return (
        <SideBarContext.Provider value={{
            active, setActive,
            dataToken, setDataToken,
            statusData, setStatusData,
            loading
        }}>
            {children}
        </SideBarContext.Provider>
    )
}