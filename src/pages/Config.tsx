import { useState } from "react";
import TopBar from "../components/TopBar";

export default function Config() {
    const [session, setSession] = useState(0)
    const [qtdAcomodacao, setQtdAcomodacao] = useState('1')
    const [assinatura, setAssinatura] = useState(true)
    const preco = () => {
        const qtdAcomod = Number(qtdAcomodacao)
        const precosA = [249.00, 399.00, 549.00, 799.00, 1299.00, 1799.00]
        const precosM = [24.90, 39.90, 54.90, 79.90, 129.90, 179.90]
        if (qtdAcomod == 1)
            return [precosA[0], precosM[0]]
        else if (qtdAcomod > 1 && qtdAcomod <= 3)
            return [precosA[1], precosM[1]]
        else if (qtdAcomod > 3 && qtdAcomod <= 5)
            return [precosA[2], precosM[2]]
        else if (qtdAcomod > 5 && qtdAcomod <= 10)
            return [precosA[3], precosM[3]]
        else if (qtdAcomod > 10 && qtdAcomod <= 20)
            return [precosA[4], precosM[4]]
        else return [precosA[5], precosM[5]]

    }

    return (
        <div className="flex flex-col w-full min-h-screen h-full">
            <TopBar>
                <section className='ml-5 flex gap-5'>
                    <button onClick={() => setSession(0)} className={`h-full text-sm flex items-center gap-2 border-b-2 ${session == 0 ? 'border-primary' : 'border-transparent'} hover:border-primary px-2`}>
                        Meu plano</button>
                    <button onClick={() => setSession(1)} className={`h-full text-sm flex items-center gap-2 border-b-2 ${session == 1 ? 'border-primary' : 'border-transparent'} hover:border-primary px-2`}>
                        Gestão de usuários</button>
                    {/* frontend ta onde molindo?*/}
                    {/* esse é o front uai*/}
                </section>
            </TopBar>


            {session == 0 && <div
                className="flex rounded-md flex-col px-4 pb-3 pt-2">
                <h5 className="font-semibold text-2xl mb-2">Assinatura</h5>

                {assinatura ? <div className="self-center bg-emerald-100 p-6 rounded-xl flex flex-col gap-3">
                    <div onClick={() => setAssinatura(!assinatura)} className="flex items-center gap-2 text-primary font-semibold">
                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(60,209,169,1)"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z"></path></svg>
                        Meu plano</div>
                    <p className="text-primary text-2xl">Número de Acomodações: {5}</p>
                    <p className="text-primary text-2xl">Data de Renovação: {'07/12/2025'}</p>
                </div> :
                    <div className="self-center bg-red-100 p-6 rounded-xl flex flex-col gap-3">
                        <div onClick={() => setAssinatura(!assinatura)} className="flex items-center gap-2 text-[rgba(237,62,68,1)] font-semibold">
                            <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(237,62,68,1)"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"></path></svg>
                            Seu acesso está bloqueado</div>
                        <p className="text-primary text-3xl">Para desbloquear assine um plano abaixo</p>
                        <section className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-b to-primary from-secondary flex flex-col items-center px-2 py-8 rounded-xl gap-2">
                                <p className="text-3xl font-semibold text-white">Mensal</p>
                                <p className="text-2xl font-medium text-white">R$ {preco()[1].toFixed(2)}</p>
                                <label htmlFor="qtdAcomodacao" className='flex items-center gap-8 my-2'>
                                    <input id='qtdAcomodacao' type="range" className="max-w-28"
                                        min={1} max={30} defaultValue={1} value={qtdAcomodacao}
                                        onChange={(e) => {
                                            setQtdAcomodacao(e.target.value)
                                        }} />
                                    <span className='text-secondary h-8 w-8 border border-zinc-400 flex justify-center items-center rounded-lg'>{qtdAcomodacao}</span>
                                </label>
                                <p className="text-xs text-white">Caso precise, pode entrar em contato com o nosso suporte:</p>
                                <p className="text-sm text-white"><span className="font-semibold">Email:</span> contato@prohost.net.br</p>
                                <p className="text-sm text-white"><span className="font-semibold">WhatsApp:</span> (21) 99517-8020</p>
                                <button className="bg-white text-black text-xl px-3 py-1 rounded-lg">SELECIONAR</button>
                            </div>
                            <div className="bg-gradient-to-t to-primary from-secondary flex flex-col items-center px-2 py-8 rounded-xl gap-2">
                                <p className="text-3xl font-semibold text-white">Anual</p>
                                <p className="text-2xl font-medium text-white">R$ {preco()[0].toFixed(2)}</p>
                                <label htmlFor="qtdAcomodacao" className='flex items-center gap-8 my-2'>
                                    <input id='qtdAcomodacao' type="range" className="max-w-28"
                                        min={1} max={30} defaultValue={1} value={qtdAcomodacao}
                                        onChange={(e) => {
                                            setQtdAcomodacao(e.target.value)
                                        }} />
                                    <span className='text-secondary h-8 w-8 border border-zinc-400 flex justify-center items-center rounded-lg'>{qtdAcomodacao}</span>
                                </label>
                                <p className="text-xs text-white">Caso precise, pode entrar em contato com o nosso suporte:</p>
                                <p className="text-sm text-white"><span className="font-semibold">Email:</span> contato@prohost.net.br</p>
                                <p className="text-sm text-white"><span className="font-semibold">WhatsApp:</span> (21) 99517-8020</p>
                                <button className="bg-white text-black text-xl px-3 py-1 rounded-lg">SELECIONAR</button>
                            </div>
                        </section>
                    </div>}

            </div>}
            {session == 1 && <form onSubmit={(e) => { e.preventDefault() }}
                style={{ width: '-webkit-fill-available' }}
                className="flex rounded-md flex-col absolute px-4 pb-3 gap-4 top-1/2 right-1/2 min-w-72 translate-x-1/2 -translate-y-1/2 bg-white pt-2">
                <h5 className="font-semibold text-2xl mb-2">Criar usuário filiado</h5>

                <label htmlFor="nome" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Nome</span>
                    <input type="text" name="nome" id="nome" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <label htmlFor="email" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">E-mail</span>
                    <input type="email" name="email" id="email" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <label htmlFor="senha" className="flex flex-col">
                    <span className="text-zinc-500 font-medium mb-1 text-sm">Senha</span>
                    <input type="password" name="senha" id="senha" className="border border-zinc-300 rounded-md px-2 py-1 outline-none" />
                </label>
                <span className="text-zinc-500 font-medium text-sm">Permissões</span>
                <section className="grid grid-cols-2">
                    <label htmlFor="trem1" className="flex items-center gap-2">
                        <input type="checkbox" name="trem1" id="trem1" /> Inserção
                    </label>
                    <label htmlFor="trem2" className="flex items-center gap-2">
                        <input type="checkbox" name="trem2" id="trem2" /> Exclusão
                    </label>
                    <label htmlFor="trem3" className="flex items-center gap-2">
                        <input type="checkbox" name="trem3" id="trem3" /> Edição
                    </label>
                    <label htmlFor="trem4" className="flex items-center gap-2">
                        <input type="checkbox" name="trem4" id="trem4" /> Visualizar dados da assinatura
                    </label>
                    <label htmlFor="trem5" className="flex items-center gap-2">
                        <input type="checkbox" name="trem5" id="trem5" /> Visualizar dados de financeiro
                    </label>
                    <label htmlFor="trem6" className="flex items-center gap-2">
                        <input type="checkbox" name="trem6" id="trem6" /> Gestão de usuários e permissões
                    </label>
                </section>

                <section className="flex gap-3 justify-end mt-2">
                    <button className="px-3 py-2 border border-zinc-300 rounded-lg text-white bg-primary"
                    >Criar usuário</button>
                </section>
            </form>}
        </div>
    );
}
