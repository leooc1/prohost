import { InputMask } from "@react-input/mask"
import { useState } from "react"
import Notify from "../notify/Notify"


export default function CartaoCredito() {
        const apiURL = 'http://localhost:3000'
        const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)

    async function pagamento(pbody: any) {
        const storage = window.localStorage.getItem('ph_pay_acc')
        let pay = ''
        await fetch(`${apiURL}/assinatura/${storage}`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(data => {
            pay = data
        })
            .catch(err => console.error(err))
        await fetch(`${apiURL}/assinatura/credit-card/${pay}`, {
            method: 'POST',
            body: JSON.stringify({cardForm:pbody}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.status == 'CONFIRMED') {
                    setNotify({ type: 1, text: 'Feito!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 3000)
                    location.assign('/auth')
                }
                else {
                    setNotify({ type: 2, text: 'Algo deu errado, tente novamente!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 3000)
                }
            })
    }
    return (
        <section className="bg-white flex flex-col py-20 h-full">
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            <h2 className='text-3xl font-semibold mb-5 ml-10'>Pagamento</h2>
            <hr className='mx-5 mb-10' />
            <form action="" onSubmit={(e) => e.preventDefault()} className='mx-10 flex flex-col gap-2'>
                <label className='text-zinc-500 flex flex-col text-sm gap-2 relative'>
                    Nome impresso no cartão
                    <input id='nome' type="text"
                        className='border border-zinc-300 bg-transparent text-lg py-1 pr-2 pl-4 outline-secondary text-black rounded-md' />
                </label>
                <label className='text-zinc-500 flex flex-col text-sm gap-2 relative'>
                    Número do Cartão
                    <InputMask
                        placeholder="0000 0000 0000 0000"
                        mask="xxxx xxxx xxxx xxxx"
                        replacement={{ x: /\d/ }}
                        id='num-card' type="text"
                        className='border border-zinc-300 bg-transparent text-lg py-1 pr-2 pl-4 outline-secondary text-black rounded-md' />
                </label>
                <div className='grid grid-cols-2 gap-5'>
                    <label className='text-zinc-500 flex flex-col text-sm gap-2 relative'>
                        Data de Expiração
                        <InputMask
                            placeholder="MM / AAAA"
                            mask="xx / xxxx"
                            replacement={{ x: /\d/ }} id='data-expiracao' type="text"
                            className='border border-zinc-300 bg-transparent text-lg py-1 pr-2 pl-4 outline-secondary text-black rounded-md' />
                    </label>
                    <label className='text-zinc-500 flex flex-col text-sm gap-2 relative'>
                        CVC
                        <InputMask
                            mask="xxx"
                            replacement={{ x: /\d/ }}
                            placeholder="000" id='cvc' type="text"
                            className='border border-zinc-300 bg-transparent text-lg py-1 pr-2 pl-4 outline-secondary text-black rounded-md' />
                    </label>
                </div>

                <section className='flex gap-10 mt-4'>
                    <button className={`py-2 text-white text-xl font-medium px-10 rounded-lg bg-primary`}
                        onClick={() => {
                            const nome = document.getElementById('nome') as HTMLInputElement
                            const num_card = document.getElementById('num-card') as HTMLInputElement
                            const data_expiracao = document.getElementById('data-expiracao') as HTMLInputElement
                            const cvc = document.getElementById('cvc') as HTMLInputElement

                            if (nome.value.length > 0 && num_card.value.length > 0 && data_expiracao.value.length > 6 && cvc.value.length > 0) {
                                pagamento({
                                    "holderName": nome.value,
                                    "number": num_card.value,
                                    "expiryMonth": data_expiracao.value.split(' / ')[0],
                                    "expiryYear": data_expiracao.value.split(' / ')[1],
                                    "ccv": cvc.value
                                })
                            }
                        }}
                    >Avançar</button>
                </section>
            </form>
        </section>
    )
}
