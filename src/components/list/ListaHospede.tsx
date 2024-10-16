import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AtualizarHospede from "../AtualizarHospede";
interface Hospede {
    id: number;
    saas: { id: number };
    nome: string;
    telefone: string | null;
    email: string | null;
}

export default function ListaHospede({ hospedes, atualizar, setAtualizar }: { hospedes: Hospede[], atualizar: [boolean, number], setAtualizar: Dispatch<SetStateAction<[boolean, number]>> }) {
    const [lhospedes, setLHospedes] = useState<Hospede[]>([])

    function Perfil(nome: string) {
        const array = nome.split(' ')
        const pnome = array[0][0]
        const unome = array[array.length - 1][0]
        if (array.length - 1 == 0)
            return pnome
        else
            return pnome + unome

    }

    useEffect(() => {
        setLHospedes(hospedes)
    }, [hospedes])

    return (
        <section className="w-full min-h-56 border border-zinc-300 rounded-lg bg-white px-4 py-4 mt-8">
            <div className="flex gap-4">
                <label htmlFor="hospede" className="flex flex-col relative">
                    <svg className="w-4 h-fit absolute left-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 56.966 56.966" ><g><path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" fill="#888888" opacity="1" data-original="#888888" ></path></g></svg>
                    <input type="text" name="hospede" id="hospede" placeholder="Buscar hóspede" className="pl-8 border border-zinc-300 rounded-md px-2 py-1 outline-none"
                        onChange={(e) => {
                            if (e.target.value.length == 0) {
                                setLHospedes(hospedes)
                            }
                            else {
                                setLHospedes(hospedes.filter((h)=>h.nome.toLowerCase().includes(e.target.value.toLowerCase())))
                            }
                        }} />
                </label>
            </div>
            <table className="w-full mt-3 border border-zinc-200 rounded-lg">
                <thead className="w-full">
                    <tr className="text-sm bg-slate-50 h-12">
                        <th className="text-center px-3">Perfil</th>
                        <th className="text-start">Nome</th>
                        <th className="text-center">E-mail</th>
                        <th className="text-center">Telefone</th>
                        <th className="text-center"></th>
                    </tr>
                </thead>
                <tbody className="">
                    {
                        lhospedes.length > 0 ?
                            lhospedes.map((e) =>
                                <>
                                    {atualizar[0] && <AtualizarHospede id={atualizar[1]} close={() => setAtualizar([false, 0])} />}
                                    <tr onClick={() => {
                                        setAtualizar([true, e.id])
                                    }} className="cursor-pointer text-sm bg-white h-12 border border-zinc-200 w-full hover:bg-[#FAFBFD]">
                                        <td className="flex h-12 items-center justify-center text-sm font-medium">
                                            <div className="w-8 h-8 flex justify-center items-center rounded-full bg-[#B1C2D9] text-white font-medium">{Perfil(e.nome)}</div>
                                        </td>
                                        <td className="text-start text-sm font-medium">{e.nome}</td>
                                        <td className="text-center text-sm font-medium">{e.email ? e.email : <span className="italic">Não Informado</span>}</td>
                                        <td className="text-center text-sm font-medium">{e.telefone ? e.telefone : <span className="italic">Não Informado</span>}</td>
                                        <td className="text-center text-sm font-medium cursor-pointer">
                                            <svg className="h-fit w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9ZM9 12V18H11V12H9ZM13 12V18H15V12H13Z"></path></svg>
                                        </td>
                                    </tr>
                                </>
                            )
                            : null
                    }
                </tbody>
            </table>
        </section>
    )
}
