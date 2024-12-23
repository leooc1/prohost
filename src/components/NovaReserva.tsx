import { useContext, useEffect, useState } from "react"
import { SideBarContext } from "../contexts/SideBarMenuContext"

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

interface Canais {
    id?: number
    cor: string
    nome: string
    saas: { id: number }
}

interface Hospede {
    id?: number;
    saas: { id: number };
    nome: string;
    telefone: string | null;
    email: string | null;
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
    continuidade: number | null
}


const apiUrl = import.meta.env.VITE_baseURLAPI;

export default function NovaReserva({ close }: { close: () => void }) {
    const { dataToken } = useContext(SideBarContext)
    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
    const [canais, setCanais] = useState<Canais[]>([])
    const [render, setRender] = useState(false)
    const [hospede, setHospede] = useState<Hospede[]>([])
    const [showH, setShowH] = useState<Hospede[]>([])

    function checkNegativeAndApplyStyle() {
        const total = document.getElementById('tot') as HTMLInputElement
        const comissao = document.getElementById('com') as HTMLInputElement
        const liquido = document.getElementById('liq') as HTMLInputElement

        if (Number(total.value) < 0) {
            total.classList.add('border-red-500')
        } else {
            total.classList.remove('border-red-500')
        }
        if (Number(comissao.value) < 0) {
            comissao.classList.add('border-red-500')
        } else {
            comissao.classList.remove('border-red-500')
        }
        if (Number(liquido.value) < 0) {
            liquido.classList.add('border-red-500')
        } else {
            liquido.classList.remove('border-red-500')
        }
    }

    async function createHospede(pbody: Hospede) {
        try {
            const response = await fetch(`https://api.prohost.net.br/hospede/`, {
                method: 'POST',
                body: JSON.stringify(pbody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            return data.id ? data.id : null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async function createReserva(pbody: Reserva) {
        await fetch(`https://api.prohost.net.br/reserva/`, {
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

    async function getAcomodacoes() {
        await fetch('https://api.prohost.net.br/acomodacao/1', {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Acomodacao[]) => {
                setAcomodacao(data.filter((e => !e.desativado)))
            })
            .catch(err => console.log(err))
    }

    async function getCanais() {
        await fetch('https://api.prohost.net.br/canal_reserva/1', {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Canais[]) => {
                setCanais(data)
            })
            .catch(err => console.log(err))
    }

    async function getHospede() {
        await fetch('https://api.prohost.net.br/hospede/1', {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Hospede[]) => {
                setHospede(data)
            })
            .catch(err => console.log(err))
    }

    async function getAll() {
        await getAcomodacoes()
        await getCanais()
        await getHospede()
        setRender(true)
    }

    useEffect(() => {
        getAll()
    }, [])

    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}></div>
            {render &&
                <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute min-w-80 px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white">
                    <h5 className="font-semibold text-2xl mb-2">Nova Reserva</h5>
                    <label htmlFor="acomodacao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Acomodação</span>
                        <select name="acomodacao" id="acomodacao" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none"
                            onChange={(ac) => {
                                const cIN = document.getElementById('checkin-hour') as HTMLInputElement
                                const cOUT = document.getElementById('checkout-hour') as HTMLInputElement
                                cIN.value = (acomodacao.filter(a => a.id == Number(ac.target.value))[0].check_in_p).slice(0,5) 
                                cOUT.value = (acomodacao.filter(a => a.id == Number(ac.target.value))[0].check_out_p).slice(0,5)
                            }}>          
                            <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                            {acomodacao.length &&
                                acomodacao.map(a => <option value={a.id}>{a.nome}</option>)}
                        </select>
                    </label>
                    <div className="grid gap-4" style={{ gridTemplateColumns: '3fr 1fr' }}>
                        <label htmlFor="hospede" className="flex flex-col relative">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Hóspede</span>
                            <input onChange={(e) => {
                                if (e.target.value.length == 0) {
                                    setShowH([])
                                }
                                else {
                                    setShowH(hospede.filter((h) => h.nome.toLowerCase().includes(e.target.value.toLowerCase())))
                                }
                            }} type="text" placeholder="Selecione um hóspede" name="hospede" id="hospede" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                            {showH.length > 0 && <section className="absolute bg-white top-full w-full">
                                <ul className="flex flex-col w-full gap-1">
                                    {showH.map(h => <li id={`${h.id}`} onClick={() => {
                                        const hInput = document.getElementById('hospede') as HTMLInputElement
                                        hInput.value = h.nome
                                        setShowH([])
                                    }} className="cursor-pointer border border-zinc-400 rounded-md px-1">{h.nome}</li>)}
                                </ul>
                            </section>}
                        </label>
                        <label htmlFor="qtd-hospedes" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Qtd. Hóspedes</span>
                            <input type="number" defaultValue={1} min={1} onChange={(e) => { if (e.target.value.length > 0 && Number(e.target.value) < 1) e.target.value = '1' }} name="qtd-hospedes" id="qtd-hospedes" className="border border-zinc-300 rounded-md px-2 py-1 text-center outline-none max-w-32" />
                        </label>
                    </div>
                    <div className="grid gap-4 grid-cols-4">
                        <label htmlFor="checkin-date" className="flex flex-col justify-end">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Check-in</span>
                            <input type="date" name="checkin-date" id="checkin-date" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                        </label>
                        <label htmlFor="checkin-hour" className="flex flex-col justify-end w-fit">
                            <input type="time" name="checkin-hour" defaultValue={`0${new Date().getHours()}`.slice(-2)+':00'} id="checkin-hour" className="border border-zinc-300 max-w-24 rounded-md px-2 py-1 outline-none" />
                        </label>
                        <label htmlFor="checkout-date" className="flex flex-col justify-end">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Check-out</span>
                            <input type="date" name="checkout-date" id="checkout-date" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                        </label>
                        <label htmlFor="checkout-hour" className="flex flex-col justify-end w-fit">
                            <input type="time" name="checkout-hour" defaultValue={`0${new Date().getHours()}`.slice(-2)+':00'} id="checkout-hour" className="border border-zinc-300 max-w-24 rounded-md px-2 py-1 outline-none" />
                        </label>
                    </div>
                    <label htmlFor="canal-reserva" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Canal</span>
                        <select name="canal-reserva" id="canal-reserva" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none">
                            <option value="" selected disabled className="hidden">Selecione um canal</option>
                            {canais.length &&
                                canais.map(c => <option value={c.id}>{c.nome}</option>)}
                        </select>
                    </label>
                    {/*  */}
                    <div className="grid gap-4 grid-cols-3">
                        <label htmlFor="tot" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Valor Total</span>
                            <input type="number" placeholder="R$" step="0.01" name="tot" id="tot" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                onInput={() => {
                                    const total = document.getElementById('tot') as HTMLInputElement
                                    const comissao = document.getElementById('com') as HTMLInputElement
                                    const liquido = document.getElementById('liq') as HTMLInputElement

                                    if (comissao.value.length == 0 && liquido.value.length == 0) {
                                        liquido.value = String(Number(total.value) - Number(comissao.value));
                                    } else if (comissao.value.length == 0 && liquido.value.length > 0) {
                                        comissao.value = String(Number(total.value) - Number(liquido.value));
                                    } else if (comissao.value.length > 0 && liquido.value.length == 0) {
                                        liquido.value = String(Number(total.value) - Number(comissao.value));
                                    } else {
                                        liquido.value = String(Number(total.value) - Number(comissao.value));
                                    }

                                    total.value = (Number(total.value).toFixed(2));
                                    comissao.value = (Number(comissao.value).toFixed(2));
                                    liquido.value = (Number(liquido.value).toFixed(2));

                                    checkNegativeAndApplyStyle();
                                }} />
                        </label>
                        <label htmlFor="com" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Comissão</span>
                            <input type="number" placeholder="R$" step="0.01" name="com" id="com" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                onInput={() => {
                                    const total = document.getElementById('tot') as HTMLInputElement
                                    const comissao = document.getElementById('com') as HTMLInputElement
                                    const liquido = document.getElementById('liq') as HTMLInputElement

                                    if (liquido.value.length == 0 && total.value.length == 0) {
                                        return;
                                    } else if (liquido.value.length == 0 && total.value.length > 0) {
                                        liquido.value = String(Number(total.value) - Number(comissao.value));
                                    } else if (liquido.value.length > 0 && total.value.length == 0) {
                                        total.value = String(Number(comissao.value) + Number(liquido.value));
                                    } else {
                                        liquido.value = String(Number(total.value) - Number(comissao.value));
                                    }

                                    total.value = (Number(total.value).toFixed(2));
                                    comissao.value = (Number(comissao.value).toFixed(2));
                                    liquido.value = (Number(liquido.value).toFixed(2));

                                    checkNegativeAndApplyStyle();
                                }} />
                        </label>
                        <label htmlFor="liq" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Valor Líquido</span>
                            <input type="number" placeholder="R$" step="0.01" name="liq" id="liq" className="border border-zinc-300 rounded-md px-2 py-1 outline-none"
                                onInput={() => {
                                    const total = document.getElementById('tot') as HTMLInputElement
                                    const comissao = document.getElementById('com') as HTMLInputElement
                                    const liquido = document.getElementById('liq') as HTMLInputElement

                                    if (comissao.value.length == 0 && total.value.length == 0) {
                                        total.value = String(Number(liquido.value) + Number(comissao.value));
                                    } else if (comissao.value.length == 0 && total.value.length > 0) {
                                        comissao.value = String(Number(total.value) - Number(liquido.value));
                                    } else if (comissao.value.length > 0 && total.value.length == 0) {
                                        total.value = String(Number(total.value) - Number(comissao.value));
                                    } else {
                                        comissao.value = String(Number(total.value) - Number(liquido.value));
                                    }

                                    total.value = (Number(total.value).toFixed(2));
                                    comissao.value = (Number(comissao.value).toFixed(2));
                                    liquido.value = (Number(liquido.value).toFixed(2));

                                    checkNegativeAndApplyStyle();
                                }} />
                        </label>
                    </div>
                    {/*  */}
                    <label htmlFor="obs" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Observação</span>
                        <input type="text" name="obs" id="obs" placeholder="Opcional" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <section className="flex gap-3 justify-end mt-2">
                        <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                        <button
                            onClick={async () => {
                                const acomodacaoInput = document.getElementById('acomodacao') as HTMLSelectElement
                                const canais = document.getElementById('canal-reserva') as HTMLSelectElement
                                const qtdHospede = document.getElementById('qtd-hospedes') as HTMLInputElement
                                const checkinDate = document.getElementById('checkin-date') as HTMLInputElement
                                const checkinHora = document.getElementById('checkin-hour') as HTMLInputElement
                                const checkoutDate = document.getElementById('checkout-date') as HTMLInputElement
                                const checkoutHora = document.getElementById('checkout-hour') as HTMLInputElement

                                const valorComissao = document.getElementById('com') as HTMLInputElement
                                const valorBruto = document.getElementById('tot') as HTMLInputElement
                                const valorLiquido = document.getElementById('liq') as HTMLInputElement

                                const hospedeInput = document.getElementById('hospede') as HTMLInputElement
                                const obs = document.getElementById('obs') as HTMLInputElement
                                let hospedeId: number = 0
                                let vProprietario: number = 0
                                let vGestor: number = 0

                                const checkinDateTime = new Date(`${checkinDate.value} ${checkinHora.value}:00`);
                                const checkoutDateTime = new Date(`${checkoutDate.value} ${checkoutHora.value}:00`);

                                if (acomodacaoInput.value.length > 0 && canais.value.length > 0 && Number(qtdHospede.value) > 0 && checkinDate.value.length > 0 && checkinHora.value.length > 0 && checkoutDate.value.length > 0 && checkoutHora.value.length > 0 && Number(valorComissao.value) >= 0 && Number(valorBruto.value) >= 0 && Number(valorLiquido.value) >= 0 && hospedeInput.value.length > 0 && (checkinDateTime < checkoutDateTime)) {
                                    if (hospede.filter(h => h.nome == hospedeInput.value).length > 0)
                                        hospedeId = (hospede.filter(h => h.nome == hospedeInput.value)[0].id) || 0
                                    else
                                        hospedeId = await createHospede({
                                            nome: hospedeInput.value,
                                            email: null,
                                            saas: { id: dataToken.id },
                                            telefone: null
                                        })

                                    if (acomodacao.filter(a => a.id == Number(acomodacaoInput.value))[0].comissao) {
                                        const comissao = acomodacao.filter(a => a.id == Number(acomodacaoInput.value))[0].comissao
                                        vProprietario = ((100 - comissao) / 100) * Number(valorLiquido.value)
                                        vGestor = (comissao / 100) * Number(valorLiquido.value)
                                    }
                                    else {
                                        vProprietario = Number(valorLiquido.value)
                                        vGestor = Number(valorLiquido.value)
                                    }
                                    await createReserva({
                                        "acomodacao": {
                                            "id": Number(acomodacaoInput.value)
                                        },
                                        "check_in": `${checkinDate.value} ${checkinHora.value}:00`,
                                        "check_out": `${checkoutDate.value} ${checkoutHora.value}:00`,
                                        "canal_reserva": {
                                            "id": Number(canais.value)
                                        },
                                        "comissao_ota": Number(valorComissao.value),
                                        "hospede": {
                                            "id": hospedeId
                                        },
                                        "qtd_hospede": Number(qtdHospede.value),
                                        "saas": {
                                            "id": dataToken.id
                                        },
                                        "valor": Number(valorBruto.value),
                                        "valor_liq": Number(valorLiquido.value),
                                        "valor_prop": vProprietario,
                                        "valor_gestor": vGestor,
                                        "obs": obs.value,
                                        "tipo_reserva": "Reserva",
                                        "continuidade": null
                                    })
                                }
                                else {
                                    alert('Preenchimento incorreto')
                                }
                            }}
                            id="button-cadastrar" className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Cadastrar</button>
                    </section>
                </form>}
        </div >
    )
}
