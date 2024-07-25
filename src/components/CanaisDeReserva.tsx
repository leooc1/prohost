import lixo from '../../public/trash-icon.svg'

export default function CanaisDeReserva() {
    return (
        <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20">
            <section className="flex flex-col absolute min-w-80 max-w-[470px] px-4 gap-4 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white rounded-md py-4">
                <section>
                    <h5 className="font-semibold text-2xl mb-2">Canais de Reserva</h5>
                    <ul className="flex flex-col gap-1">
                        <li className="flex items-center border border-zinc-200 px-2 py-1 rounded-md justify-around">
                            <div className="w-3 h-3 rounded-full bg-red-600"></div>
                            AIRBNB
                            <input defaultValue={'20%'} type="text" className="bg-zinc-100 rounded-md w-20 px-2 py-1 outline-none" name="comissao" id="comissao" />
                            <button className='px-1 py-1 rounded-md transition-all duration-200 hover:bg-red-100'><img src={lixo} alt="excluir" className='w-5 h-fit' /></button>
                        </li>
                        <li className="flex items-center border border-zinc-200 px-2 py-1 rounded-md justify-around">
                            <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                            BOOKING
                            <input defaultValue={'20%'} type="text" className="bg-zinc-100 rounded-md w-20 px-2 py-1 outline-none" name="comissao" id="comissao" />
                            <button className='px-1 py-1 rounded-md transition-all duration-200 hover:bg-red-100'><img src={lixo} alt="excluir" className='w-5 h-fit' /></button>
                        </li>
                    </ul>
                </section>
                <hr className='my-5' />
                <form onSubmit={(e) => { e.preventDefault() }} className="">
                    <h5 className="font-semibold text-xl mb-4">Cadastrar novo canal</h5>
                    <div className='flex gap-3 items-center'>
                        <label htmlFor="nome" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Nome</span>
                            <input type="text" name="nome" id="nome" className="border border-zinc-300 max-w-40 rounded-md px-2 py-1 outline-none" />
                        </label>
                        <label htmlFor="comissao" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Comissão</span>
                            <input type="text" name="comissao" id="comissao" placeholder='0%' className="border border-zinc-300 max-w-20 rounded-md px-2 py-1 outline-none" />
                        </label>
                        <label htmlFor="cor" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Cor</span>
                            <input type="color" name="cor" id="cor" className="border border-zinc-300 max-w-10 rounded-md px-2 py-1 outline-none" />
                        </label>
                        <button className="w-9 h-9 flex justify-center items-center font-bold border border-zinc-300 rounded-lg text-white bg-primary self-end">+</button>
                    </div>
                </form>
            </section>
        </div>
    )
}
