import { useContext, useEffect, useState } from "react";
import CadastrarHospede from "../components/CadastrarHospede";
import ListaHospede from "../components/list/ListaHospede";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Loader from "../components/Loader";
import SemPermissao from "../components/SemPermissao";
interface Hospede {
    id: number;
    saas: { id: number };
    nome: string;
    telefone: string | null;
    email: string | null;
}

export default function Hospede() {
    const apiURL = 'https://api.prohost.net.br'
    useEffect(() => { document.title = `Hóspedes | Prohost` }, [])


    const { dataToken } = useContext(SideBarContext)
    const [loaded, setLoaded] = useState(false)
    const [cadastrarHospede, setCadastrarHospede] = useState(false)
    const [atualizarHospede, setAtualizarHospede] = useState<[boolean, number]>([false, 0])
    const [hospede, setHospede] = useState<Hospede[]>([])

    async function getHospede() {
        await fetch(`${apiURL}/hospede/${dataToken.id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Hospede[]) => {
                setHospede(data)
                setLoaded(true)
            })
            .catch(err => console.log(err))

        await permissoes()
    }

    const [permissao, setPermissao] = useState(0)
    async function permissoes() {
        await fetch(`${apiURL}/users/${dataToken.idUsu}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => {
                if (data.hospede) {
                    setPermissao(data.hospede)
                }
                else {
                    setPermissao(0)
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getHospede()
    }, [dataToken])

    return (
        loaded ?
            <div className="w-full px-8">
                {permissao == 0 && <SemPermissao />}
                <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                    <h3 className="text-3xl font-semibold">Hóspedes</h3>
                    <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black'
                        onClick={() => setCadastrarHospede(true)}
                        disabled={!(permissao >= 2)}>Cadastrar Hóspede</button>
                    {cadastrarHospede && <CadastrarHospede close={() => setCadastrarHospede(false)} />}

                    <ListaHospede
                        permissao={permissao}
                        atualizar={atualizarHospede}
                        setAtualizar={setAtualizarHospede}
                        hospedes={hospede} />
                </div>
            </div>
            :
            <Loader />
    )
}
