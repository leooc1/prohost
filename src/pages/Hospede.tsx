import { useContext, useEffect, useState } from "react";
import CadastrarHospede from "../components/CadastrarHospede";
import ListaHospede from "../components/list/ListaHospede";
import { SideBarContext } from "../contexts/SideBarMenuContext";
import Loader from "../components/Loader";
interface Hospede {
    id: number;
    saas: { id: number };
    nome: string;
    telefone: string | null;
    email: string | null;
}

export default function Hospede() {
    const { dataToken } = useContext(SideBarContext)
    const [loaded, setLoaded] = useState(false)
    const [cadastrarHospede, setCadastrarHospede] = useState(false)
    const [atualizarHospede, setAtualizarHospede] = useState<[boolean, number]>([false, 0])
    const [hospede, setHospede] = useState<Hospede[]>([])

    async function getHospede() {
        await fetch(`http://localhost:3000/hospede/${dataToken.id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Hospede[]) => {
                setHospede(data)
                setLoaded(true)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getHospede()
    }, [dataToken])

    return (
        loaded ?
            <div className="w-full px-8">
                <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                    <h3 className="text-3xl font-semibold">Hóspedes</h3>
                    <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black'
                        onClick={() => setCadastrarHospede(true)}>Cadastrar Hóspede</button>
                    {cadastrarHospede && <CadastrarHospede close={() => setCadastrarHospede(false)} />}

                    <ListaHospede
                        atualizar={atualizarHospede}
                        setAtualizar={setAtualizarHospede}
                        hospedes={hospede} />
                </div>
            </div>
            :
            <Loader />
    )
}
