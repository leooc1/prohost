import { createContext, useState } from 'react';

export const SideBarContext = createContext({} as any);

export const SideBarProvider = ({ children }: { children: React.JSX.Element }) => {
    const [active, setActive] = useState<boolean>(true)
    const [dataToken, setDataToken] = useState<{ id: number, nome: string } | null>(null)

    return (
        <SideBarContext.Provider value={{
            active, setActive,
            dataToken, setDataToken
        }}>
            {children}
        </SideBarContext.Provider>
    )
}