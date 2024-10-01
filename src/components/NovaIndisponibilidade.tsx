
export default function NovaIndisponibilidade({ close }: { close: () => void }) {
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
        <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}></div>
            <form onSubmit={(e) => { e.preventDefault() }} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 py-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white">
                <h5 className="font-semibold text-2xl mb-2">Nova Indisponibilidade</h5>
                <label htmlFor="acomodacao" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Acomodação</span>
                    <select name="acomodacao" id="acomodacao" className="border border-zinc-300 rounded-md text-zinc-5 00 px-2 py-1 outline-none">
                        <option value="" selected disabled className="hidden">Selecione uma acomodação</option>
                        <option value="1">Lorem.</option>
                        <option value="2">Lorem.</option>
                        <option value="3">Lorem.</option>
                    </select>
                </label>
                <div className="grid gap-4 grid-cols-2">
                    <label htmlFor="de" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">De</span>
                        <input type="date" name="de" id="de" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                    <label htmlFor="ate" className="flex flex-col">
                        <span className="text-zinc-500 font-medium mb-1">Até</span>
                        <input type="date" name="ate" id="ate" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                    </label>
                </div>
                <label htmlFor="motivo" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1">Motivo</span>
                    <input type="text" name="motivo" id="motivo" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg" onClick={close}>Cancelar</button>
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Cadastrar</button>
                </section>
            </form>
        
        </div>
    )
}
