import { useState } from 'react'
import nomoney from '../../public/no-money.svg'

interface propsCancelamento {
    close: () => void
    id: number
}

// const apiUrl = import.meta.env.VITE_baseURLAPI;

export default function CardCancelamento(props: propsCancelamento) {
    const [possuiTaxa, setPossuiTaxa] = useState<boolean>(false)

    /* async function cancelarReserva(id: number) {
        await fetch(`https://api.prohost.net.br/reserva/${id}`, {
            method: 'DELETE'
        })
            .then(data => data.json())
            .then((data) => {
                console.log(data)
                if (data.affected == 1) {
                    alert('EXCLUÍDO!')
                    props.close()
                    location.reload()
                }
            })
            .catch(err => console.log(err))
    } */

    console.log(props.id)

    return (
        <div className='w-screen h-screen fixed z-20 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={props.close}> </div>
            <section className="flex flex-col absolute min-w-80 max-w-[470px] px-4 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md py-4">
                <h5 className="font-semibold text-2xl mb-2 text-center">A reserva possui taxa de cancelamento?</h5>
                <div className="flex justify-center">
                    <img className='h-20' src={nomoney} />
                </div>
                <div className="flex gap-2">
                    <span className="text-zinc-500 font-medium mb-2 text-sm">Possui taxa?</span>
                    <label className="switch">
                        <input type="checkbox" id="taxa" defaultChecked={false}
                            onChange={(e) => setPossuiTaxa(e.target.checked)} />
                        <div className="slider">
                            <div className="circle">
                                <svg className="cross" viewBox="0 0 365.696 365.696" y="0" x="0" height="6" width="6" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path data-original="#000000" fill="currentColor" d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"></path>
                                    </g>
                                </svg>
                                <svg className="checkmark" viewBox="0 0 24 24" y="0" x="0" height="10" width="10" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path className="" data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </label>
                </div>
                {possuiTaxa &&
                    <label htmlFor="taxa" className="flex flex-col justify-end w-fit">
                        <span className="text-zinc-500 font-medium mb-1 text-xs">Valor total</span>
                        <input
                            onChange={(e) => {
                                e.target.value = Number(e.target.value).toFixed(2)
                            }}
                            type="number" step={0.01} name="taxa" placeholder="R$" id="taxa" className="border border-zinc-300 rounded-md px-2 py-1 outline-none w-full" />
                    </label>
                }
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={props.close}>Cancelar</button>
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-red-600"
                    onClick={()=>{
                        // cancelarReserva(props.id)
                    }}>Confirmar</button>
                </section>
            </section>
        </div>
    )
}
