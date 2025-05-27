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


export default function AtualizarHospede({ close, id }: { close: () => void, id: number }) {
    const apiURL = 'https://api.prohost.net.br'
    const { dataToken } = useContext(SideBarContext)
    const [nome, setNome] = useState<string>('')
    const [email, setEmail] = useState<string | null>()
    const [tel, setTel] = useState<string | null>()
    const [err, setErr] = useState<boolean>(false)
    const [reservas, setReservas] = useState<{
        acomodacao: string
        nome: string,
        foto: string,
        reservas: {
            reserva: string
            check_in: string
            check_out: string
            valor: string
        }[]
    }[]>([])
    const [showNotify, setShowNotify] = useState<boolean>(false)

    function agruparPorAcomodacao(reservas: {
        reserva: string
        check_in: string
        check_out: string
        nome: string
        valor: string
        acomodacao: string
        foto: string
    }[]) {
        const resultado: {
            acomodacao: string
            nome: string,
            foto: string,
            reservas: {
                reserva: string
                check_in: string
                check_out: string
                valor: string
            }[]
        }[] = [];

        reservas.forEach(reserva => {
            const acomodacaoId = reserva.acomodacao;
            let acomodacao = resultado.find((a) => a.acomodacao === acomodacaoId);

            if (!acomodacao) {
                acomodacao = {
                    acomodacao: acomodacaoId,
                    nome: reserva.nome,
                    foto: reserva.foto,
                    reservas: []
                };
                resultado.push(acomodacao);
            }

            acomodacao.reservas.push({
                reserva: reserva.reserva,
                check_in: reserva.check_in,
                check_out: reserva.check_out,
                valor: reserva.valor
            });
        });

        setReservas(resultado);
        return resultado;
    }


    async function getHospede() {
        await fetch(`${apiURL}/hospede/${dataToken.id}/${id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: {
                hospede: Hospede[], reservas: {
                    reserva: string
                    check_in: string
                    nome: string
                    check_out: string
                    valor: string
                    acomodacao: string
                    foto: string
                }[]
            }) => {
                setNome(data.hospede[0].nome)
                setEmail(data.hospede[0].email)
                setTel(data.hospede[0].telefone)
                agruparPorAcomodacao(data.reservas)
            })
            .catch(err => console.log(err))
    }

    async function updateHospede(pbody: Hospede) {
        await fetch(`${apiURL}/hospede/${id}`, {
            method: 'PUT',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected == 1) {
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                        location.reload()
                    }, 3000)
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
            {showNotify && <Notify type={1} text="Atualizado!" />}
            <form onSubmit={(e) => {
                e.preventDefault()
                if (nome.length > 0) {
                    updateHospede({
                        "saas": {
                            "id": dataToken.id
                        },
                        "nome": nome,
                        "telefone": tel?.length ? tel : null,
                        "email": email?.length ? email : null
                    })
                }

            }} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white max-h-screen overflow-scroll scroll-default">
                <h5 className="font-semibold text-2xl mb-2">Atualizar Hóspede</h5>
                <label htmlFor="nome" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Nome
                        <span className='text-red-500 font-bold'> *</span>
                    </span>
                    <input type="text" name="nome" id="nome" className={`border ${err ? 'border-red-500' : 'border-zinc-300'} rounded-md px-2 py-1 outline-none`} placeholder="Hospede Exemplo" value={nome} onChange={(e) => setNome(e.target.value)} />
                </label>
                <label htmlFor="email" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">E-mail</span>
                    <input type="email" name="email" id="email" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" placeholder="email@exemplo.com.br" value={email || ''} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label htmlFor="tel" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Telefone</span>
                    <input type="tel" name="tel" id="tel" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" placeholder="(00) 9 9999-9999" value={tel || ''} onChange={(e) => setTel(e.target.value)} />
                </label>
                <section className="flex flex-col gap-2">
                    RESERVAS
                    {reservas.length &&
                        reservas.map(a =>
                            <details className="border border-black rounded-lg overflow-hidden">
                                <summary className="flex py-1 items-center bg-zinc-100 cursor-pointer">
                                    <img className="size-10" src={a.foto} alt={a.nome} />
                                    <p className="max-w-full overflow-hidden whitespace-nowrap text-ellipsis ml-5">{a.nome}</p>
                                </summary>
                                <ul>
                                    {a.reservas.map(r => <>
                                        <hr className="brightness-0" />
                                        <li>
                                            <p className="text-center">{r.check_in.split('T')[0].split('-')[2]}/
                                                {r.check_in.split('T')[0].split('-')[1]}/
                                                {r.check_in.split('T')[0].split('-')[0]} -&gt; {r.check_out.split('T')[0].split('-')[2]}/
                                                {r.check_out.split('T')[0].split('-')[1]}/
                                                {r.check_out.split('T')[0].split('-')[0]}
                                            </p>
                                            <p className="text-center">{r.check_in.split('T')[1].slice(0, 5)} -&gt; {r.check_out.split('T')[1].slice(0, 5)}</p>
                                            <p className="text-center">R$ {r.valor}</p>
                                        </li>
                                    </>
                                    )}
                                </ul>
                            </details>)
                    }
                </section>
                <section className="flex gap-3 justify-end mt-2">
                    <button type="button" className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button type='submit'
                        onClick={() => {
                            if (nome.length > 0) {
                                setErr(false)
                            }
                            else {
                                setErr(true)
                            }
                        }}
                        className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Atualizar</button>
                </section>
            </form>
        </div>
    )
}
