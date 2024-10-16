import prohostLogo from '../../public/prohost-logo.png'

export default function Auth() {
    return (
        <div className="flex">
            <main className="w-full min-h-screen h-full relative bg-zinc-100 grid grid-cols-3">
                <section className="bg-white flex flex-col justify-center h-full">
                    <div className='flex gap-2 ml-10'>
                        <img src={prohostLogo} alt='Logo ProHost' width={32} height={32} />
                        <h1 className='text-zinc-500 font-bold text-3xl tracking-tight'>
                            prohost
                        </h1>
                    </div>

                    <h2 className='text-3xl font-semibold mb-5 mt-10 ml-10'>Faça login</h2>

                    <form action="#" className='mx-10 flex flex-col gap-5'>

                        <label className='text-zinc-500 flex flex-col text-sm gap-2 relative col-span-2'>
                            Seu e-mail
                            <svg className='h-fit w-4 fill-zinc-300 absolute top-10 left-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"></path></svg>
                            <input id='email' type="email"
                                className='border border-zinc-300 bg-transparent text-lg py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                        </label>
                        <label className='text-zinc-500 flex flex-col text-sm gap-2 relative'>
                            Sua senha
                            <svg className='h-fit w-4 fill-zinc-300 absolute top-10 left-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17ZM11 14V18H13V14H11Z"></path></svg>
                            <input id='senha' type="password"
                                className='border border-zinc-300 bg-transparent text-lg py-1 pr-2 pl-7 outline-secondary text-black rounded-md' />
                        </label>
                        <p className='flex gap-2 items-center font-medium text-zinc-500 cursor-pointer hover:text-blue-600'>Esqueceu sua senha?</p>
                        <button className={`py-2 text-white text-xl font-medium px-10 rounded-lg bg-primary w-fit`}>Avançar</button>
                        <a href='/assinar' className='flex gap-2 items-center font-medium text-zinc-500 hover:text-blue-600'>Não tem uma conta? Registre-se</a>
                    </form>

                </section>

                <section className="bg-gradient-to-t from-[#003447] to-[#0e7c71] relative flex items-center col-span-2">
                    <h2 className="text-6xl text-white font-semibold ml-10">
                        Seja bem-vindo <br />
                        à próxima geração <br />
                        de anfitriões
                    </h2>
                </section>
            </main>
        </div>
    )
}
