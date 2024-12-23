import { useContext } from "react"
import { SideBarContext } from "../contexts/SideBarMenuContext"

interface propsContinuidade {
    close: () => void
    checkinDate: string
    acomodacao: number
    canal: number
    hospede: number
    qtdHospede: number
    comissao: number | null
    idReserva: string
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

//const apiURl = import.meta.env.VITE_baseURLAPI;

export default function NovaContinuidade(props: propsContinuidade) {
    const { dataToken } = useContext(SideBarContext)

    async function createContinuidade(pbody: Reserva) {
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
                    props.close()
                    location.reload()
                }
            })
            .catch(err => console.log(err))
    }
    const checkin = new Date(props.checkinDate)
    const checkinDate = (`${checkin.getFullYear()}-${('0' + (checkin.getMonth() + 1)).slice(-2)}-${('0' + (checkin.getDate())).slice(-2)}`)
    const checkinTime = (`${('0' + (checkin.getHours())).slice(-2)}:${('0' + (checkin.getMinutes())).slice(-2)}:${('0' + (checkin.getSeconds())).slice(-2)}`)
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={props.close}></div>
            <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute min-w-80 w-[440px] px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white">
                <h5 className="font-semibold text-2xl mb-2">Continuidade de Reserva</h5>

                <div className="flex gap-4">
                    <label htmlFor="checkout-date" className="flex flex-col justify-end">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Nova data de Checkout</span>
                        <input type="date" name="checkout-date" id="checkout-date" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="checkout-hour" className="flex flex-col justify-end w-fit">
                        <input type="time" defaultValue={`0${new Date().getHours()}`.slice(-2)+':00'} name="checkout-hour" id="checkout-hour" className="border border-zinc-300 max-w-24 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="valor-total" className="flex flex-col justify-end w-fit">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Valor total</span>
                        <input
                            onChange={(e) => {
                                e.target.value = Number(e.target.value).toFixed(2)
                            }}
                            type="number" step={0.01} name="valor-total" placeholder="R$" id="valor-total" className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full" />
                    </label>
                </div>
                <label htmlFor="obs" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Observação</span>
                    <input placeholder="Opcional" type="text" name="obs" id="obs" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={props.close}>Cancelar</button>
                    <button
                        onClick={() => {
                            const checkoutDate = document.getElementById('checkout-date') as HTMLInputElement
                            const checkoutTime = document.getElementById('checkout-hour') as HTMLInputElement
                            const valorTotal = document.getElementById('valor-total') as HTMLInputElement
                            const obs = document.getElementById('obs') as HTMLInputElement

                            if (!(checkin < new Date(`${checkoutDate.value} ${checkoutTime.value}:00`))) {
                                checkoutDate.value = ''
                                checkoutTime.value = ''
                            }

                            let vProprietario: number = 0
                            let vGestor: number = 0
                            if (props.comissao) {
                                vProprietario = ((100 - props.comissao) / 100) * Number(valorTotal.value)
                                vGestor = (props.comissao / 100) * Number(valorTotal.value)
                            } else {
                                vProprietario = Number(valorTotal.value)
                                vGestor = Number(valorTotal.value)
                            }

                            if (checkoutDate.value.length > 0 && checkoutTime.value.length > 0 && valorTotal.value.length > 0)
                                createContinuidade({
                                    "acomodacao": {
                                        "id": props.acomodacao
                                    },
                                    "check_in": `${checkinDate} ${checkinTime}`,
                                    "check_out": `${checkoutDate.value} ${checkoutTime.value}:00`,
                                    "canal_reserva": {
                                        "id": props.canal
                                    },
                                    "comissao_ota": 0,
                                    "hospede": {
                                        "id": props.hospede
                                    },
                                    "qtd_hospede": props.qtdHospede,
                                    "saas": {
                                        "id": dataToken.id
                                    },
                                    "valor": Number(valorTotal.value),
                                    "valor_liq": Number(valorTotal.value),
                                    "valor_prop": vProprietario,
                                    "valor_gestor": vGestor,
                                    "obs": obs.value,
                                    "tipo_reserva": "Continuidade",
                                    "continuidade": Number(props.idReserva)
                                })
                            else alert('Dados obrigatórios nao estão preenchidos')
                        }}
                        className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Criar continuidade</button>
                </section>
            </form>


        </div >
    )
}
