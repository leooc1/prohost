import { useContext, useEffect, useState } from "react"
import { SideBarContext } from "../contexts/SideBarMenuContext"
import Notify from "./notify/Notify"

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
    modelo: number
    taxa_limpeza: number
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
    taxa_limpeza: number
    valor: number
    valor_liq: number
    valor_prop: number
    valor_gestor: number
    valor_liq_calculado: number
    obs: string
    tipo_reserva: string
    continuidade: number | null
}


//const apiURl = import.meta.env.VITE_baseURLAPI;

export default function NovaReserva({ close }: { close: () => void }) {
    const apiURL = import.meta.env.VITE_API_URL
    const { dataToken } = useContext(SideBarContext)
    const [acomodacao, setAcomodacao] = useState<Acomodacao[]>([])
    const [canais, setCanais] = useState<Canais[]>([])
    const [render, setRender] = useState(false)
    const [err, setErr] = useState<[boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]>([false, false, false, false, false, false, false, false, false])
    const [hospede, setHospede] = useState<Hospede[]>([])
    const [showTaxaLimpeza, setShowTaxaLimpeza] = useState<[boolean, number]>([false, 0])
    const [showH, setShowH] = useState<Hospede[]>([])
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)

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

    function formatedNumber(input: string) {
        if (input.replace(/[.,]/gm, '').length <= 3)
            return input.replace(/[.,]/gm, '').replace(/(\d{1})(\d{2})/gm, '$1,$2')
        else if (input.replace(/[.,]/gm, '').length <= 4)
            return input.replace(/[.,]/gm, '').replace(/(\d{2})(\d{2})/gm, '$1,$2')
        else if (input.replace(/[.,]/gm, '').length <= 5)
            return input.replace(/[.,]/gm, '').replace(/(\d{3})(\d{2})/gm, '$1,$2')
        else if (input.replace(/[.,]/gm, '').length <= 6)
            return input.replace(/[.,]/gm, '').replace(/(\d{1})(\d{3})(\d{2})/gm, '$1.$2,$3')
        else if (input.replace(/[.,]/gm, '').length <= 7)
            return input.replace(/[.,]/gm, '').replace(/(\d{2})(\d{3})(\d{2})/gm, '$1.$2,$3')
        else if (input.replace(/[.,]/gm, '').length <= 8)
            return input.replace(/[.,]/gm, '').replace(/(\d{3})(\d{3})(\d{2})/gm, '$1.$2,$3')
        else if (input.replace(/[.,]/gm, '').length <= 9)
            return input.replace(/[.,]/gm, '').replace(/(\d{1})(\d{3})(\d{3})(\d{2})/gm, '$1.$2.$3,$4')
        else if (input.replace(/[.,]/gm, '').length <= 10)
            return input.replace(/[.,]/gm, '').replace(/(\d{2})(\d{3})(\d{3})(\d{2})/gm, '$1.$2.$3,$4')
        else if (input.replace(/[.,]/gm, '').length <= 11)
            return input.replace(/[.,]/gm, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/gm, '$1.$2.$3,$4')
        else return '0,00'
    }

    async function createHospede(pbody: Hospede) {
        try {
            const response = await fetch(`${apiURL}/hospede/`, {
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
        await fetch(`${apiURL}/reserva/`, {
            method: 'POST',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.id) {
                    localStorage.setItem('ph-cld-initial-date', pbody.check_in)
                    setNotify({ type: 1, text: 'Criado!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                        location.reload()
                    }, 3000)
                } else if (data.length > 0) {
                    setNotify({ type: 2, text: data })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 3000)
                }
                else {
                    setNotify({ type: 2, text: 'Erro ao cadastrar!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 3000)
                }

            })
            .catch(err => console.log(err))
    }

    async function getAcomodacoes() {
        await fetch(`${apiURL}/acomodacao/${dataToken.id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Acomodacao[]) => {
                setAcomodacao(data.filter((e => !e.desativado)))
            })
            .catch(err => console.log(err))
    }

    async function getCanais() {
        await fetch(`${apiURL}/canal_reserva/${dataToken.id}`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Canais[]) => {
                setCanais(data)
            })
            .catch(err => console.log(err))
    }

    async function getHospede() {
        await fetch(`${apiURL}/hospede/${dataToken.id}`, {
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
    }, [dataToken])
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}></div>
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            {render &&
                <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col max-h-screen overflow-scroll scroll-default absolute min-w-80 px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white">
                    <h5 className="font-semibold text-2xl mb-2">Nova Reserva</h5>
                    <label htmlFor="acomodacao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Acomodação<span className='text-red-500 font-bold'> *</span></span>
                        <select name="acomodacao" id="acomodacao" className={`border ${err[0] ? 'border-red-500' : 'border-zinc-300'}  rounded-md text-zinc-5 00 px-2 py-1 outline-none`}
                            onChange={(ac) => {
                                const cIN = document.getElementById('checkin-hour') as HTMLInputElement
                                const cOUT = document.getElementById('checkout-hour') as HTMLInputElement

                                cIN.value = (acomodacao.filter(a => a.id == Number(ac.target.value))[0].check_in_p).slice(0, 5)
                                cOUT.value = (acomodacao.filter(a => a.id == Number(ac.target.value))[0].check_out_p).slice(0, 5)

                                setShowTaxaLimpeza([(acomodacao.filter(a => a.id == Number(ac.target.value))[0].modelo) == 2, (acomodacao.filter(a => a.id == Number(ac.target.value))[0].taxa_limpeza)])
                            }}>
                            <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                            {acomodacao.length &&
                                acomodacao.map(a => <option value={a.id}>
                                    {a.nome}
                                </option>)}
                        </select>
                    </label>
                    <div className="grid gap-4" style={{ gridTemplateColumns: '3fr 1fr' }}>
                        <label htmlFor="hospede" className="flex flex-col relative">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Hóspede<span className='text-red-500 font-bold'> *</span></span>
                            <input onChange={(e) => {
                                if (e.target.value.length == 0) {
                                    setShowH([])
                                }
                                else {
                                    setShowH(hospede.filter((h) => h.nome.toLowerCase().includes(e.target.value.toLowerCase())))
                                }
                            }} type="text" placeholder="Selecione um hóspede" name="hospede" id="hospede" className={`border ${err[1] ? 'border-red-500' : 'border-zinc-300'}  rounded-md px-2 py-1 outline-none`} />
                            {showH.length > 0 && <section className="absolute bg-white top-full w-full">
                                <ul className="flex flex-col w-full gap-1">
                                    {showH.map(h => <li id={`${h.id}`} onClick={() => {
                                        const hInput = document.getElementById('hospede') as HTMLInputElement
                                        hInput.value = h.nome
                                        setShowH([])
                                    }} className={`cursor-pointer border border-zinc-400 rounded-md px-1`}>{h.nome}</li>)}
                                </ul>
                            </section>}
                        </label>
                        <label htmlFor="qtd-hospedes" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Qtd. Hóspedes<span className='text-red-500 font-bold'> *</span></span>
                            <input type="number" defaultValue={1} min={1} onChange={(e) => { if (e.target.value.length > 0 && Number(e.target.value) < 1) e.target.value = '1' }} name="qtd-hospedes" id="qtd-hospedes" className={`border ${err[2] ? 'border-red-500' : 'border-zinc-300'}  rounded-md px-2 py-1 text-center outline-none max-w-32`} />
                        </label>
                    </div>
                    <div className="grid gap-4 grid-cols-4">
                        <label htmlFor="checkin-date" className="flex flex-col justify-end">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Check-in<span className='text-red-500 font-bold'> *</span></span>
                            <input type="date" name="checkin-date" id="checkin-date" className={`border ${err[3] ? 'border-red-500' : 'border-zinc-300'}  rounded-md px-2 py-1 outline-none`} />
                        </label>
                        <label htmlFor="checkin-hour" className="flex flex-col justify-end w-fit">
                            <input type="time" name="checkin-hour" defaultValue={`0${new Date().getHours()}`.slice(-2) + ':00'} id="checkin-hour" className={`border ${err[3] ? 'border-red-500' : 'border-zinc-300'}  max-w-24 rounded-md px-2 py-1 outline-none`} />
                        </label>
                        <label htmlFor="checkout-date" className="flex flex-col justify-end">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Check-out<span className='text-red-500 font-bold'> *</span></span>
                            <input type="date" name="checkout-date" id="checkout-date" className={`border ${err[4] ? 'border-red-500' : 'border-zinc-300'}  rounded-md px-2 py-1 outline-none`} />
                        </label>
                        <label htmlFor="checkout-hour" className="flex flex-col justify-end w-fit">
                            <input type="time" name="checkout-hour" defaultValue={`0${new Date().getHours()}`.slice(-2) + ':00'} id="checkout-hour" className={`border ${err[4] ? 'border-red-500' : 'border-zinc-300'}  max-w-24 rounded-md px-2 py-1 outline-none`} />
                        </label>
                    </div>
                    <label htmlFor="canal-reserva" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Canal<span className='text-red-500 font-bold'> *</span></span>
                        <select name="canal-reserva" id="canal-reserva" className={`border ${err[5] ? 'border-red-500' : 'border-zinc-300'}  rounded-md text-zinc-5 00 px-2 py-1 outline-none`}>
                            <option value="" selected disabled className="hidden">Selecione um canal</option>
                            {canais.length &&
                                canais.map(c => <option value={c.id}>{c.nome}</option>)}
                        </select>
                    </label>
                    <div className="-mb-10 -mt-1 z-20 relative">
                        <button onBlur={() => {
                            document.getElementById('izinho')?.classList.add('hidden')
                        }} onClick={() => {
                            if (document.getElementById('izinho')?.classList.contains('hidden'))
                                document.getElementById('izinho')?.classList.remove('hidden')
                            else
                                document.getElementById('izinho')?.classList.add('hidden')
                        }}>
                            <svg className="h-5 w-fit fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path></svg>
                        </button>
                        <section id="izinho" className="absolute bg-primary top-0 text-white text-sm p-2 rounded-xl -translate-y-full hidden">
                            <p><strong>Valor Total</strong> - Valor Total é o valor pago pelo hóspede.</p>
                            <p><strong>Valor Diárias</strong> - Valor diárias é o valor que o hóspede pagou referente as diárias da hospedagem, ou seja, o valor que ele pagou menos a taxa de limpeza (ou qualquer taxa cobrada a parte das diárias).</p>
                            <p><strong>⁠Comissão</strong> - Comissão é o valor que ficou retido para a plataforma, incluindo impostos (se aplicável).</p>
                            <p><strong>⁠Taxa de limpeza</strong> - Taxa de limpeza é o valor cobrado adicionalmente ao valor das diárias nas reservas.</p>
                        </section>
                    </div>
                    {/*  */}
                    <div className="grid gap-4 grid-cols-3">
                        <label htmlFor="tot" className="flex flex-col">
                            <span className="text-zinc-500 font-medium ml-6 mb-1 text-xs">{!showTaxaLimpeza[0] ? 'Valor Total' : 'Valor Diárias'}<span className='text-red-500 font-bold'> *</span></span>
                            <div className="flex items-center gap-2">
                                R$<input type="text" placeholder="R$" step="0.01" name="tot" id="tot" className={`border ${err[6] ? 'border-red-500' : 'border-zinc-300'}  rounded-md px-2 py-1 outline-none w-full`}
                                    onInput={() => {
                                        const total = document.getElementById('tot') as HTMLInputElement
                                        const comissao = document.getElementById('com') as HTMLInputElement
                                        const liquido = document.getElementById('liq') as HTMLInputElement
                                        if (comissao.value.length == 0 && liquido.value.length == 0) {
                                            liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        } else if (comissao.value.length == 0 && liquido.value.length > 0) {
                                            comissao.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        } else if (comissao.value.length > 0 && liquido.value.length == 0) {
                                            liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        } else {
                                            liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        }
                                        total.value = formatedNumber(String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                        comissao.value = formatedNumber(String(Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                        liquido.value = formatedNumber(String(Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                        checkNegativeAndApplyStyle();
                                    }} />
                            </div>
                        </label>
                        <label htmlFor="com" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Comissão<span className='text-red-500 font-bold'> *</span></span>
                            <div className="flex items-center gap-2">
                                R$<input type="text" placeholder="R$" step="0.01" name="com" id="com" className={`border ${err[7] ? 'border-red-500' : 'border-zinc-300'}  rounded-md px-2 py-1 outline-none w-full`}
                                    onInput={() => {
                                        const total = document.getElementById('tot') as HTMLInputElement
                                        const comissao = document.getElementById('com') as HTMLInputElement
                                        const liquido = document.getElementById('liq') as HTMLInputElement
                                        if (liquido.value.length == 0 && total.value.length == 0) {
                                            return;
                                        } else if (liquido.value.length == 0 && total.value.length > 0) {
                                            liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        } else if (liquido.value.length > 0 && total.value.length == 0) {
                                            total.value = String(Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        } else {
                                            liquido.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        }
                                        total.value = formatedNumber(String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                        comissao.value = formatedNumber(String(Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                        liquido.value = formatedNumber(String(Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                        checkNegativeAndApplyStyle();
                                    }} />
                            </div>
                        </label>
                        <label htmlFor="liq" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1 text-xs">Valor Líquido<span className='text-red-500 font-bold'> *</span></span>
                            <div className="flex items-center gap-2">
                                R$<input type="text" placeholder="R$" step="0.01" name="liq" id="liq" className={`border ${err[8] ? 'border-red-500' : 'border-zinc-300'}  rounded-md px-2 py-1 outline-none w-full`}
                                    onInput={() => {
                                        const total = document.getElementById('tot') as HTMLInputElement
                                        const comissao = document.getElementById('com') as HTMLInputElement
                                        const liquido = document.getElementById('liq') as HTMLInputElement
                                        if (comissao.value.length == 0 && total.value.length == 0) {
                                            total.value = String(Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) + Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        } else if (comissao.value.length == 0 && total.value.length > 0) {
                                            comissao.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        } else if (comissao.value.length > 0 && total.value.length == 0) {
                                            total.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        } else {
                                            comissao.value = String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, '')) - Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '')));
                                        }
                                        total.value = formatedNumber(String(Number(total.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                        comissao.value = formatedNumber(String(Number(comissao.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                        liquido.value = formatedNumber(String(Number(liquido.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                        checkNegativeAndApplyStyle();
                                    }} />
                            </div>
                        </label>
                    </div>
                    {/*  */}
                    {showTaxaLimpeza[0] && <label htmlFor="taxa_limpeza" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Taxa de Limpeza<span className='text-red-500 font-bold'> *</span></span>
                        <div className="flex items-center gap-2">
                            R$<input type="text" placeholder="R$" step="0.01" name="taxa_limpeza" id="taxa_limpeza"
                                defaultValue={showTaxaLimpeza[1]} className={`border ${err[8] ? 'border-red-500' : 'border-zinc-300'}  rounded-md px-2 py-1 outline-none w-full`}
                                onChange={(e) => {
                                    e.target.value = formatedNumber(String(Number(e.target.value.replace(/[.]/gm, '').replace(/[,]/gm, ''))));
                                    checkNegativeAndApplyStyle();
                                }} />
                        </div>
                    </label>}
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
                                const taxaLimpeza = document.getElementById('taxa_limpeza') as HTMLInputElement
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
                                // 
                                let valorLiqCalculado = 0
                                if (taxaLimpeza) {
                                    const calculado = (
                                        (
                                            (Number(valorBruto.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2')) +
                                                (Number(taxaLimpeza.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2')))) -
                                            Number(valorComissao.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))
                                        )//valor liquido 
                                        - (
                                            (Number(taxaLimpeza.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))) // limpeza 
                                            -
                                            (
                                                (Number(taxaLimpeza.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))) *
                                                (
                                                    (Number(valorComissao.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))) /
                                                    (Number(valorBruto.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2')) +
                                                        (Number(taxaLimpeza.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2'))))
                                                )
                                            )
                                        )
                                    );

                                    valorLiqCalculado = Number(calculado.toFixed(2));
                                }
                                // 
                                if (acomodacaoInput.value.length > 0 && canais.value.length > 0 && Number(qtdHospede.value) > 0 && checkinDate.value.length > 0 && checkinHora.value.length > 0 && checkoutDate.value.length > 0 && checkoutHora.value.length > 0 && Number(valorComissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')) >= 0 && Number(valorBruto.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')) >= 0 && Number(valorLiquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')) >= 0 && hospedeInput.value.length > 0 && (checkinDateTime < checkoutDateTime)) {
                                    if (hospede.filter(h => h.nome.toLowerCase() == hospedeInput.value.toLowerCase()).length > 0)
                                        hospedeId = (hospede.filter(h => h.nome.toLowerCase() == hospedeInput.value.toLowerCase())[0].id) || 0
                                    else
                                        hospedeId = await createHospede({
                                            nome: hospedeInput.value,
                                            email: null,
                                            saas: { id: dataToken.id },
                                            telefone: null
                                        })

                                    if (acomodacao.filter(a => a.id == Number(acomodacaoInput.value))[0].comissao) {
                                        const comissao = acomodacao.filter(a => a.id == Number(acomodacaoInput.value))[0].comissao
                                        vProprietario = ((100 - comissao) / 100) * Number(valorLiquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                                        vGestor = (comissao / 100) * Number(valorLiquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                                    }
                                    else {
                                        vProprietario = Number(valorLiquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                                        vGestor = Number(valorLiquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '.'))
                                    }
                                    await createReserva({
                                        "acomodacao": {
                                            "id": Number(acomodacaoInput.value)
                                        },
                                        "check_in": `${checkinDate.value} ${checkinHora.value}:00`,
                                        "check_out": `${checkoutDate.value} ${checkoutHora.value}:00`,
                                        "taxa_limpeza": taxaLimpeza ? Number(taxaLimpeza.value.replace(/[.,]/gm, '').replace(/(\d{1,})(\d{2})/gm, '$1.$2')) : 0,
                                        "canal_reserva": {
                                            "id": Number(canais.value)
                                        },
                                        "comissao_ota": Number(valorComissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')),
                                        "hospede": {
                                            "id": hospedeId
                                        },
                                        "qtd_hospede": Number(qtdHospede.value),
                                        "saas": {
                                            "id": dataToken.id
                                        },
                                        "valor": Number(valorBruto.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')),
                                        "valor_liq": Number(valorLiquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')),
                                        "valor_prop": vProprietario,
                                        "valor_gestor": vGestor,
                                        "valor_liq_calculado": valorLiqCalculado,
                                        "obs": obs.value,
                                        "tipo_reserva": "Reserva",
                                        "continuidade": null
                                    })
                                }
                                else {
                                    let error = err
                                    if (acomodacaoInput.value.length == 0) {
                                        error = (error.map((e, i) => i === 0 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 0 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    if (hospedeInput.value.length == 0) {
                                        error = (error.map((e, i) => i === 1 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 1 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    if (Number(qtdHospede.value) <= 0) {
                                        error = (error.map((e, i) => i === 2 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 2 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    if (checkinDate.value.length == 0 || checkinHora.value.length == 0 || !(checkinDateTime < checkoutDateTime)) {
                                        error = (error.map((e, i) => i === 3 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 3 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    if (checkoutDate.value.length == 0 || checkoutHora.value.length == 0 || !(checkinDateTime < checkoutDateTime)) {
                                        error = (error.map((e, i) => i === 4 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 4 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    if (canais.value.length == 0) {
                                        error = (error.map((e, i) => i === 5 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 5 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    if (Number(valorBruto.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')) < 0 || valorBruto.value.length == 0) {
                                        error = (error.map((e, i) => i === 6 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 6 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    if (Number(valorComissao.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')) < 0 || valorComissao.value.length == 0) {
                                        error = (error.map((e, i) => i === 7 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 7 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    if (Number(valorLiquido.value.replace(/[.]/gm, '').replace(/[,]/gm, '.')) < 0 || valorLiquido.value.length == 0) {
                                        error = (error.map((e, i) => i === 8 ? true : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    else {
                                        error = (error.map((e, i) => i === 8 ? false : e) as [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                                    }
                                    setErr(error)
                                    setNotify({ type: 2, text: 'Preenchimento incorreto!' })
                                    setShowNotify(true)
                                    setTimeout(() => {
                                        setShowNotify(false);
                                    }, 3000)
                                }
                            }}
                            id="button-cadastrar" className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Cadastrar</button>
                    </section>
                </form>}
        </div >
    )
}
