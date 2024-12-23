import { useContext, useEffect, useState } from "react";
import { SideBarContext } from "../contexts/SideBarMenuContext";

interface Hospede {
    id?: number;
    saas: { id: number };
    nome: string;
    telefone: string | null;
    email: string | null;
}

//const apiURl = import.meta.env.VITE_baseURLAPI;

export default function AtualizarHospede({ close, id }: { close: () => void, id: number }) {
    const { dataToken } = useContext(SideBarContext)
    const [nome, setNome] = useState<string>()
    const [email, setEmail] = useState<string | null>()
    const [tel, setTel] = useState<string | null>()
    async function getHospede() {
        await fetch(`https://api.prohost.net.br/hospede/1/${id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Hospede[]) => {
                setNome(data[0].nome)
                setEmail(data[0].email)
                setTel(data[0].telefone)
            })
            .catch(err => console.log(err))
    }

    async function updateHospede(pbody: Hospede) {
        await fetch(`https://api.prohost.net.br/hospede/${id}`, {
            method: 'PUT',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected == 1) {
                    alert('ATUALIZADO!')
                    close()
                    location.reload()
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getHospede()
    }, [dataToken])


    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black top-0 right-0 bg-opacity-20" onClick={close}></div>
            <form onSubmit={(e) => {
                e.preventDefault()
                if (nome?.length)
                    updateHospede({
                        "saas": {
                            "id": dataToken.id
                        },
                        "nome": nome,
                        "telefone": tel?.length ? tel : null,
                        "email": email?.length ? email : null
                    })
            }} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white">
                <h5 className="font-semibold text-2xl mb-2">Atualizar Hóspede</h5>
                <label htmlFor="nome" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Nome
                        <span className='text-red-500 font-bold'> *</span>
                    </span>
                    <input type="text" name="nome" id="nome" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" placeholder="Hospede Exemplo" value={nome} onChange={(e) => setNome(e.target.value)} />
                </label>
                <label htmlFor="email" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">E-mail</span>
                    <input type="email" name="email" id="email" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" placeholder="email@exemplo.com.br" value={email || ''} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label htmlFor="tel" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Telefone</span>
                    <input type="tel" name="tel" id="tel" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" placeholder="(00) 9 9999-9999" value={tel || ''} onChange={(e) => setTel(e.target.value)} />
                </label>
                <section className="flex gap-3 justify-end mt-2">
                    <button type="button" className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button type='submit' className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Atualizar</button>
                </section>
            </form>
        </div>
    )
}
