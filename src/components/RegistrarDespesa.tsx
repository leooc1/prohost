import { ChangeEvent, useState } from "react"

export default function RegistrarDespesa() {
    const [tipoDespesa, setTipoDespesa] = useState('')
    const setCategoria = () => {
        const categorias = document.querySelectorAll('label:has(input[type="radio"])')
        categorias.forEach((e: any) => {
            if (e.children[1].checked) {
                e.classList.add('outline')
                e.classList.add('outline-2')
                e.classList.add('outline-slate-700')
                e.classList.add('bg-slate-300')
                e.classList.remove('bg-slate-100')
            }
            else {
                e.classList.remove('outline')
                e.classList.remove('outline-2')
                e.classList.remove('outline-slate-700')
                e.classList.remove('bg-slate-300')
                e.classList.add('bg-slate-100')
            }
        })
    }
    return (
        <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20">
            <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                <h5 className="font-semibold text-2xl mb-2">Registrar Despesa</h5>
                <label htmlFor="tipo-despesa" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Tipo de Despesa</span>
                    <select name="tipo-despesa" id="tipo-despesa" className={`${tipoDespesa == '' ? 'text-zinc-400' : ''} font-medium border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none`}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => { setTipoDespesa(e.target.value) }}>
                        <option value="" selected disabled className="hidden">Padrão</option>
                        <option value="negocio" className="text-black">Despesas do Negócio</option>
                        <option value="fixas" className="text-black">Despesas Fixas</option>
                        <option value="variaveis" className="text-black">Despesas Variáveis</option>
                    </select>
                </label>
                <section>
                    <span className="text-zinc-500 font-medium">Categoria</span>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        <label htmlFor="gerais" onClick={() => setCategoria()} className="bg-slate-100 text-sm font-medium cursor-pointer flex items-center text-slate-500 rounded-2xl px-2 py-px">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                            Despesas Gerais
                            <input type="radio" name="categoria" id="gerais" className="hidden" />
                        </label>
                        <label htmlFor="exemplo" onClick={() => setCategoria()} className="bg-slate-100 text-sm font-medium cursor-pointer flex items-center text-slate-500 rounded-2xl px-2 py-px">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                            Despesa Exemplo
                            <input type="radio" name="categoria" id="exemplo" className="hidden" />
                        </label>
                    </div>
                </section>
                <div className="grid gap-4 grid-cols-2">
                    <label htmlFor="descricao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Descrição</span>
                        <input placeholder="Ex: Material de Limpeza" type="text" name="descricao" id="descricao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="recebedor" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Recebedor</span>
                        <input placeholder="Ex: Mercado Paulista" type="text" name="recebedor" id="recebedor" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                </div>
                <label htmlFor="acomodacao" className={`flex flex-col ${tipoDespesa=='negocio'?'hidden':null}`}>
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Acomodação (opicional)</span>
                    <select name="acomodacao" id="acomodacao" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none">
                        <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                        <option value="1">Lorem.</option>
                        <option value="2">Lorem.</option>
                        <option value="3">Lorem.</option>
                    </select>
                </label>
                <div className="grid gap-3 items-center" style={{gridTemplateColumns:'1fr 1fr 0.3fr'}}>
                    <label htmlFor="data" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Data</span>
                        <input placeholder="dd/mm/aaaa" type="text" name="data" id="data" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="valor" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Valor</span>
                        <input placeholder="R$" type="text" name="valor" id="valor" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <div className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-2 text-sm">Pago?</span>
                        <label className="switch">
                            <input type="checkbox" defaultChecked/>
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
                </div>
                <label htmlFor="observacao" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Observação</span>
                    <input placeholder="Opcional" type="text" name="observacao" id="observacao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg">Cancelar</button>
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Registrar Movimentação</button>
                </section>
            </form>
        </div>
    )
}
