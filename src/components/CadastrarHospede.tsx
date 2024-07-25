
export default function CadastrarHospede() {
  return (
    <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20">
        <form onSubmit={(e)=>{e.preventDefault()}} className="flex rounded-md flex-col absolute max-w-96 min-w-80 px-4 pb-3 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white">
            <h5 className="font-semibold text-2xl mb-2">Cadastrar Hóspede</h5>
            <label htmlFor="nome" className="flex flex-col">
                <span className="text-zinc-500 font-medium mb-1">Nome</span>
                <input type="text" name="nome" id="nome" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
            </label>
            <label htmlFor="email" className="flex flex-col">
                <span className="text-zinc-500 font-medium mb-1">E-mail</span>
                <input type="email" name="email" id="email" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
            </label>
            <label htmlFor="tel" className="flex flex-col">
                <span className="text-zinc-500 font-medium mb-1">Telefone</span>
                <input type="tel" name="tel" id="tel" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
            </label>
            <section className="flex gap-3 justify-end mt-2">
                <button className="px-3 py-2 border border-zinc-300 rounded-lg">Cancelar</button>
                <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary">Cadastrar</button>
            </section>
        </form>
    </div>
  )
}
