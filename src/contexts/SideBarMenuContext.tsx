import { createContext, useState } from 'react';

export const SideBarContext = createContext({} as any);

export const SideBarProvider = ({ children }: { children: React.JSX.Element }) => {
    const [active, setActive] = useState<boolean>(true)
    
    return (
        <SideBarContext.Provider value={{
            active, setActive
        }}>
            {children}
        </SideBarContext.Provider>
    )
}