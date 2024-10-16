import { useEffect, useState } from "react"

interface Acomodacao {
    id: number
    tipo: string
    comissao: number
    data_ini_ope: string
    descricao: string
    endereco: string
    check_in_p: string
    check_out_p: string
    foto: string
    nome: string
    numero_hospedes: number
    valor_imovel: number
    desativado: boolean
    saas: { id: number }
}

interface Reserva {
    acomodacao: { id: number }
    check_in: string
    check_out: string
    canal_reserva: { id: number | null }
    comissao_ota: number
    hospede: { id: number | null }
    qtd_hospede: number
    saas: { id: number }
    valor: number
    valor_liq: number
    valor_prop: number
    valor_gestor: number
    obs: string
    tipo_reserva: string
}

export default function NovaIndisponibilidade({ close }: { close: () => void }) {
    const [render, setRender] = useState(false)
    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])

    async function getAcomodacoes() {
        await fetch('http://localhost:3000/acomodacao/1', {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Acomodacao[]) => {
                setAcomodacao(data.filter((e => !e.desativado)))
            })
            .catch(err => console.log(err))
    }

    async function createIndisponibilidade(pbody: Reserva) {
        await fetch(`http://localhost:3000/reserva/`, {
            method: 'POST',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.id) {
                    alert('CRIADO!')
                    close()
                    location.reload()
                }
            })
            .catch(err => console.log(err))
    }

    async function getInfo() {
        await getAcomodacoes()
        setRender(true)
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}></div>
            {render &&
                <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white">
                    <h5 className="font-semibold text-2xl mb-2">Nova Indisponibilidade</h5>
                    <label htmlFor="acomodacao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Acomodação</span>
                        <select name="acomodacao" id="acomodacao" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none">
                            <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                            {acomodacao.length &&
                                acomodacao.map(a =>
                                    <option value={a.id}>{a.nome}</option>
                                )
                            }
                        </select>
                    </label>
                    <div className="grid gap-4 grid-cols-2">
                        <label htmlFor="de" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">De</span>
                            <input type="date"
                                onChange={(d) => {
                                    const otherDate = document.getElementById('ate') as HTMLInputElement
                                    if (d.target.value.length && otherDate.value.length)
                                        if ((new Date(d.target.value).getTime() - new Date(otherDate.value).getTime()) > 0)
                                            otherDate.value = ''
                                }}
                                name="de" id="de" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                        </label>
                        <label htmlFor="ate" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Até</span>
                            <input type="date"
                                onChange={(d) => {
                                    const otherDate = document.getElementById('de') as HTMLInputElement
                                    if (d.target.value.length && otherDate.value.length)
                                        if ((new Date(otherDate.value).getTime() - new Date(d.target.value).getTime()) > 0)
                                            otherDate.value = ''
                                }}
                                name="ate" id="ate" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                        </label>
                    </div>
                    <label htmlFor="motivo" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Motivo</span>
                        <input placeholder="Opcional" type="text" name="motivo" id="motivo" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <section className="flex gap-3 justify-end mt-2">
                        <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                        <button
                            onClick={() => {
                                const acomodacao = document.getElementById('acomodacao') as HTMLSelectElement
                                const dataini = document.getElementById('de') as HTMLInputElement
                                const datafim = document.getElementById('ate') as HTMLInputElement
                                const motivo = document.getElementById('motivo') as HTMLInputElement
                                if (acomodacao.value.length && dataini.value.length && datafim.value.length)
                                    createIndisponibilidade({
                                        "acomodacao": {
                                            "id": Number(acomodacao.value)
                                        },
                                        "check_in": dataini.value + ' 00:00:00',
                                        "check_out": datafim.value + ' 23:59:59',
                                        "canal_reserva": {
                                            "id": null
                                        },
                                        "comissao_ota": 0,
                                        "hospede": {
                                            "id": null
                                        },
                                        "qtd_hospede": 0,
                                        "saas": {
                                            "id": 1
                                        },
                                        "valor": 0,
                                        "valor_liq": 0,
                                        "valor_prop": 0,
                                        "valor_gestor": 0,
                                        "obs": motivo.value,
                                        "tipo_reserva": "Indisponibilidade"
                                    })
                                else alert('Dados obrigatórios nao estão preenchidos')
                            }}
                            className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Cadastrar</button>
                    </section>
                </form>
            }

        </div>
    )
}
