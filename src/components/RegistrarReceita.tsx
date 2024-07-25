
export default function RegistrarReceita() {
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
            <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                <h5 className="font-semibold text-2xl mb-2">Registrar Receita</h5>
                
                <section>
                    <span className="text-zinc-500 font-medium">Categoria</span>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        <label htmlFor="gerais" onClick={() => setCategoria()} className="bg-slate-100 text-sm font-medium cursor-pointer flex items-center text-slate-500 rounded-2xl px-2 py-px">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                            Receitas Gerais
                            <input type="radio" name="categoria" id="gerais" className="hidden" />
                        </label>
                        <label htmlFor="exemplo" onClick={() => setCategoria()} className="bg-slate-100 text-sm font-medium cursor-pointer flex items-center text-slate-500 rounded-2xl px-2 py-px">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                            Receita Exemplo
                            <input type="radio" name="categoria" id="exemplo" className="hidden" />
                        </label>
                    </div>
                </section>
                <div className="grid">
                    <label htmlFor="descricao" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Descrição</span>
                        <input placeholder="Ex: Material de Limpeza" type="text" name="descricao" id="descricao" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                </div>
                <label htmlFor="acomodacao" className={`flex flex-col`}>
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Acomodação</span>
                    <select name="acomodacao" id="acomodacao" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none">
                        <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                        <option value="1">Lorem.</option>
                        <option value="2">Lorem.</option>
                        <option value="3">Lorem.</option>
                    </select>
                </label>
                <div className="grid gap-3 items-center grid-cols-2">
                    <label htmlFor="data" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Data</span>
                        <input placeholder="dd/mm/aaaa" type="text" name="data" id="data" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="valor" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1 text-sm">Valor</span>
                        <input placeholder="R$" type="text" name="valor" id="valor" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>    
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
