import { InputMask } from "@react-input/mask"

export default function CartaoCredito() {
    return (
        <section className="bg-white flex flex-col py-20 h-full">
            <h2 className='text-3xl font-semibold mb-5 ml-10'>Pagamento</h2>
            <hr className='mx-5 mb-10' />
            <form action="" className='mx-10 flex flex-col gap-2'>
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
                            replacement={{ x: /\d/ }} id='data-expiracap' type="text"
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
                    <a href="/assinar/forma-pagamento" className={`py-2 text-white text-xl font-medium px-10 rounded-lg ${true ? 'bg-primary' : 'bg-zinc-400 cursor-no-drop'}`}
                        onClick={(e) => {
                            if (!true)
                                e.preventDefault()
                        }}
                    >Avançar</a>
                </section>
            </form>
        </section>
    )
}
