import { createContext, useState } from 'react';

export const AssinaturaContext = createContext({} as any);

export const AssinaturaProvider = ({ children }: { children: React.JSX.Element }) => {
    const [saasDTO, setSaasDTO] = useState<{
        assinatura: { id: string }
        master: string
        nome: string
        trial_end: string
        origin: string
    } | null>(null)
    const [userDTO, setUserDTO] = useState<{
        asaas_id: { id: string }
        celular: string
        cpf_cnpj: string
        end_rua: string
        end_num: string
        end_bairro: string
        end_comp: string
        end_cep: string
        nome: string
        saas: { id: number }
        email: string
        senha: string
    } | null>(null)
    const [planoDTO, setPlanoDTO] = useState<{
        qtd_acomodacao: number
        valor_ano: number
    } | null>({
        qtd_acomodacao: 1,
        valor_ano: 249.00
    })

    return (
        <AssinaturaContext.Provider value={{
            saasDTO, setSaasDTO,
            userDTO, setUserDTO,
            planoDTO, setPlanoDTO,
        }}>
            {children}
        </AssinaturaContext.Provider>
    )
}