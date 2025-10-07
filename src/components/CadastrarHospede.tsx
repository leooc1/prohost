import { useContext, useEffect, useState } from "react";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Notify from "./notify/Notify";

interface Hospede {
    id?: number;
    saas: { id: number };
    nome: string;
    telefone: string | null;
    email: string | null;
}

//const apiURl = import.meta.env.VITE_baseURLAPI;

export default function CadastrarHospede({ close }: { close: () => void }) {
    const apiURL = import.meta.env.VITE_API_URL
    const { dataToken } = useContext(SideBarContext)
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)

    async function createHospede(pbody: Hospede) {
        await fetch(`${apiURL}/hospede/`, {
            method: 'POST',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.id) {
                    setNotify({ type: 1, text: 'Criado!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                        location.reload()
                    }, 3000)
                }
            })
            .catch(err => console.log(err))
    }
    useEffect(() => { }, [dataToken])
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black top-0 right-0 bg-opacity-20" onClick={close}></div>
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            <form onSubmit={(e) => {
                e.preventDefault()
                const nome = document.getElementById('nome') as HTMLInputElement
                const email = document.getElementById('email') as HTMLInputElement
                const tel = document.getElementById('tel') as HTMLInputElement
                if (nome.value?.length)
                    if (dataToken && dataToken.id) createHospede({
                        "saas": {
                            "id": dataToken.id
                        },
                        "nome": nome.value,
                        "telefone": tel.value?.length ? tel.value : null,
                        "email": email.value?.length ? email.value : null
                    })
            }} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white">
                <h5 className="font-semibold text-2xl mb-2">Cadastrar Hóspede</h5>
                <label htmlFor="nome" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Nome
                        <span className='text-red-500 font-bold'> *</span>
                    </span>
                    <input type="text" name="nome" id="nome" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" placeholder="Hospede Exemplo" />
                </label>
                <label htmlFor="email" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">E-mail</span>
                    <input type="email" name="email" id="email" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" placeholder="hospede@email.com" />
                </label>
                <label htmlFor="tel" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Telefone</span>
                    <input type="tel" name="tel" id="tel" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" placeholder="(00) 9 9999-9999" />
                </label>
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Cadastrar</button>
                </section>
            </form>
        </div>
    )
}
