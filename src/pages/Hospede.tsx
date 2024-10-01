import { useState } from "react";
import CadastrarHospede from "../components/CadastrarHospede";
import ListaHospede from "../components/list/ListaHospede";

export default function Hospede() {
    const [cadastrarHospede, setCadastrarHospede] = useState(false)

    return (
        <div className="w-full px-8">
            <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                <h3 className="text-3xl font-semibold">Hóspedes</h3>
                <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black'
                    onClick={() => setCadastrarHospede(true)}>Cadastrar Hóspede</button>
                {cadastrarHospede && <CadastrarHospede close={() => setCadastrarHospede(false)} />}
                <ListaHospede
                    hospedes={
                        [
                            { nome: 'Hóspede Padrão', email: null, tel: null },
                            { nome: 'Leonardo', email: null, tel: null },
                            { nome: 'Teste', email: 'teste@teste.teste', tel: '(00) 0 0000-0000' }
                        ]
                    } />
            </div>
        </div>
    )
}
