import { useState } from "react"

export default function CadastrarCategoria({ close }: { close: () => void }) {
    const [mov, setMov] = useState(false)
    const [color, setColor] = useState('#bdc3c7')
    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}> </div>
            <section className="flex flex-col absolute min-w-80 max-w-[470px] px-4 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md py-4">
                <h5 className="font-semibold text-2xl mb-2">Categorias</h5>
                <section className="flex gap-5">
                    <label htmlFor="receita" className="flex gap-2">
                        <input type="radio" name="mov" id="receita" checked={!mov} onChange={(e) => {
                            if (e.target.value == 'on')
                                setMov(false)
                        }} />
                        Receita
                    </label>
                    <label htmlFor="despesa" className="flex gap-2">
                        <input type="radio" name="mov" id="despesa" checked={mov} onChange={(e) => {
                            if (e.target.value == 'on')
                                setMov(true)
                        }} />
                        Despesa
                    </label>
                </section>
                <ul className="flex flex-col gap-1">
                    {!mov && <li className="flex items-center border border-zinc-200 px-2 py-1 rounded-md justify-around">
                        <div className="w-3 h-3 rounded-full bg-[#1ABC9C]"></div>
                        Receitas Gerais
                        {/* <button className='px-1 py-1 rounded-md transition-all duration-200 hover:bg-red-100'>
                                <svg className="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,109,109,1)"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                            </button> */}
                    </li>}
                    {mov && <li className="flex items-center border border-zinc-200 px-2 py-1 rounded-md justify-around">
                        <div className="w-3 h-3 rounded-full bg-[#F2354B]"></div>
                        Despesas Gerais
                        {/* <button className='px-1 py-1 rounded-md transition-all duration-200 hover:bg-red-100'>
                                <svg className="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,109,109,1)"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                            </button> */}
                    </li>}
                </ul>
                <hr className='my-5' />
                <form onSubmit={(e) => { e.preventDefault() }}>
                    <h5 className="font-semibold text-xl mb-4">Cadastrar nova Categoria</h5>
                    <div className='flex gap-3 items-center'>
                        <label htmlFor="nome" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Nome</span>
                            <input type="text" name="nome" id="nome" className="border border-zinc-300 max-w-40 rounded-md px-2 py-1 outline-none" />
                        </label>
                        <label htmlFor="comissao" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Comissão</span>
                            <select name="color" id="color" className={`outline outline-zinc-300 border2 border-white text-sm rounded-md px-1 py-1 outline-none`}>
                                <option value="receitas" title='receitas' className='' selected={!mov} >Receita</option>
                                <option value="despesas" title='despesas' className='' selected={mov} >Despesa</option>
                            </select>
                        </label>
                        <label htmlFor="cor" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Cor</span>
                            <select name="color" id="color" className={`outline outline-zinc-300 border2 border-white max-w-20 rounded-md px-2 py-1 outline-none bg-[${color}]`}
                                onChange={(e) => { setColor(e.target.value) }}>
                                <option value="#ffffff" title='#ffffff' className='bg-[#ffffff] w-5 h-5'></option>
                                <option value="#bdc3c7" title='#bdc3c7' className='bg-[#bdc3c7] w-5 h-5'></option>
                                <option value="#f1c40f" title='#f1c40f' className='bg-[#f1c40f] w-5 h-5'></option>
                                <option value="#f39c12" title='#f39c12' className='bg-[#f39c12] w-5 h-5'></option>
                                <option value="#e74c3c" title='#e74c3c' className='bg-[#e74c3c] w-5 h-5'></option>
                                <option value="#1abc9c" title='#1abc9c' className='bg-[#1abc9c] w-5 h-5'></option>
                                <option value="#17d9fd" title='#17d9fd' className='bg-[#17d9fd] w-5 h-5'></option>
                                <option value="#0000ff" title='#0000ff' className='bg-[#0000ff] w-5 h-5'></option>
                                <option value="#2980b9" title='#2980b9' className='bg-[#2980b9] w-5 h-5'></option>
                                <option value="#9b59b6" title='#9b59b6' className='bg-[#9b59b6] w-5 h-5'></option>
                                <option value="#000000" title='#000000' className='bg-[#000000] w-5 h-5'></option>
                                <option value="#f2354b" title='#f2354b' className='bg-[#f2354b] w-5 h-5'></option>
                                <option value="#0480f4" title='#0480f4' className='bg-[#0480f4] w-5 h-5'></option>
                            </select>
                        </label>
                    </div>
                    <button className="w-full mt-4 h-9 flex justify-center items-center font-semibold border border-zinc-300 rounded-lg text-white bg-primary self-end">
                        Cadastrar Categoria
                    </button>
                </form>
            </section>
        </div>
    )
}
