import { useContext, useEffect, useState } from 'react'
import { SideBarContext } from '../contexts/SideBarMenuContext'
interface Canais {
    id?: number
    cor: string
    nome: string
    saas: { id: number }
}

const apiUrl = import.meta.env.VITE_baseURLAPI;

export default function CanaisDeReserva({ close }: { close: () => void }) {
    const { dataToken } = useContext(SideBarContext)
    const [canais, setCanais] = useState<Canais[]>([])
    const [color, setColor] = useState('#bdc3c7')

    async function getCanais() {
        await fetch('https://api.prohost.net.br/canal_reserva/1', {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Canais[]) => {
                setCanais(data)
            })
            .catch(err => console.log(err))
    }

    async function updateCanais(id: number, pbody: { cor: string, nome: string }) {
        await fetch(`https://api.prohost.net.br/canal_reserva/${id}`, {
            method: 'PUT',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected) {
                    getCanais()
                }
            })
            .catch(err => console.log(err))
    }

    async function createCanais(pbody: Canais) {
        await fetch('https://api.prohost.net.br/canal_reserva/', {
            method: 'POST',
            body: JSON.stringify(pbody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data: Canais) => {
                if (data.id) {
                    const nome = document.getElementById('nome') as HTMLInputElement
                    alert('CRIADO!')
                    setColor('#bdc3c7')
                    nome.value = ''
                    getCanais()
                }
            })
            .catch(err => console.log(err))
    }

    async function deleteCanais(id: number) {
        await fetch(`https://api.prohost.net.br/canal_reserva/${id}`, {
            method: 'DELETE',
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected) {
                    alert('DELETADO!')
                    close()
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getCanais()
    }, [dataToken])

    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}> </div>
            <section className="flex flex-col absolute min-w-80 max-w-[470px] px-4 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md py-4">
                <section>
                    <h5 className="font-semibold text-2xl mb-2">Canais de Reserva</h5>
                    <ul className="flex flex-col gap-1">
                        {
                            canais.length ?
                                canais.map((e) =>
                                    <li className="flex items-center border border-zinc-200 pr-2 py-1 rounded-md pl-6">
                                        <details className="relative">
                                            <summary className="flex">
                                                <div id={`cor-${e.id}`} title={e.cor} className={`cursor-pointer w-3 h-3 rounded-full bg-[${e.cor}] mr-5`}></div>
                                            </summary>

                                            <section className="grid grid-cols-4 absolute top-full bg-white p-2 gap-4 w-36 rounded-xl">
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#ffffff', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#ffffff' className='bg-[#ffffff] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#bdc3c7', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#bdc3c7' className='bg-[#bdc3c7] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#f1c40f', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#f1c40f' className='bg-[#f1c40f] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#f39c12', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#f39c12' className='bg-[#f39c12] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#e74c3c', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#e74c3c' className='bg-[#e74c3c] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#1abc9c', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#1abc9c' className='bg-[#1abc9c] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#17d9fd', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#17d9fd' className='bg-[#17d9fd] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#0000ff', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#0000ff' className='bg-[#0000ff] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#2980b9', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#2980b9' className='bg-[#2980b9] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#9b59b6', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#9b59b6' className='bg-[#9b59b6] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#000000', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#000000' className='bg-[#000000] w-5 h-5 border border-zinc-400 text-zinc-400 flex justify-center items-center cursor-pointer'></div>
                                                <div onClick={() => {
                                                    const nome = document.getElementById(`nome-${e.id}`) as HTMLInputElement
                                                    updateCanais(e.id || 0, { cor: '#f2354b', nome: nome.value })
                                                    const ck = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    ck.click()
                                                }} title='#f2354b' className='bg-[#f2354b] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'></div>
                                            </section>

                                        </details>

                                        <input type="text" id={`nome-${e.id}`} defaultValue={e.nome} className={`outline-none border-none bg-transparent focus:bg-zinc-200 rounded-md px-1`}
                                            onBlur={(el) => {
                                                if (el.target.value.length) {
                                                    const cor = document.getElementById(`cor-${e.id}`) as HTMLDivElement
                                                    updateCanais(e.id || 0, { cor: cor.title, nome: el.target.value })
                                                }
                                            }} />
                                        <button
                                            onClick={() => {
                                                const excluir = confirm("Tem certeza que deseja excluir o canal?")
                                                if (excluir)
                                                    deleteCanais(e.id || 0)
                                            }}
                                            className='px-1 py-1 rounded-md transition-all duration-200 hover:bg-red-100'>
                                            <svg className="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,109,109,1)"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                                        </button>
                                    </li>)
                                :
                                null
                        }
                    </ul>
                </section>
                <hr className='my-5' />
                <form onSubmit={(e) => { e.preventDefault() }} className="">
                    <h5 className="font-semibold text-xl mb-4">Cadastrar novo canal</h5>
                    <div className='flex gap-3 items-center'>
                        <label htmlFor="nome" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Nome</span>
                            <input type="text" name="nome" id="nome" className="border border-zinc-300 w-full rounded-md px-2 py-1 outline-none" />
                        </label>
                        <label htmlFor="cor" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Cor</span>
                            <details name="color" id="color" className={`outline outline-zinc-300 border2 border-white max-w-20 rounded-md px-2 py-1 outline-none relative`}>
                                <summary className="flex">
                                    <div id="select-color" className={`cursor-pointer bg-[${color}] w-6 h-6 border border-zinc-400 pl-7`}></div>
                                </summary>

                                <section className="grid grid-cols-4 absolute top-full bg-white p-2 gap-4 w-36 rounded-xl">
                                    <div onClick={() => {
                                        setColor('#ffffff')
                                        document.getElementById('select-color')?.click()
                                    }} title='#ffffff' className='bg-[#ffffff] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#ffffff' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#bdc3c7')
                                        document.getElementById('select-color')?.click()
                                    }} title='#bdc3c7' className='bg-[#bdc3c7] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#bdc3c7' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#f1c40f')
                                        document.getElementById('select-color')?.click()
                                    }} title='#f1c40f' className='bg-[#f1c40f] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#f1c40f' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#f39c12')
                                        document.getElementById('select-color')?.click()
                                    }} title='#f39c12' className='bg-[#f39c12] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#f39c12' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#e74c3c')
                                        document.getElementById('select-color')?.click()
                                    }} title='#e74c3c' className='bg-[#e74c3c] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#e74c3c' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#1abc9c')
                                        document.getElementById('select-color')?.click()
                                    }} title='#1abc9c' className='bg-[#1abc9c] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#1abc9c' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#17d9fd')
                                        document.getElementById('select-color')?.click()
                                    }} title='#17d9fd' className='bg-[#17d9fd] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#17d9fd' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#0000ff')
                                        document.getElementById('select-color')?.click()
                                    }} title='#0000ff' className='bg-[#0000ff] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#0000ff' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#2980b9')
                                        document.getElementById('select-color')?.click()
                                    }} title='#2980b9' className='bg-[#2980b9] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#2980b9' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#9b59b6')
                                        document.getElementById('select-color')?.click()
                                    }} title='#9b59b6' className='bg-[#9b59b6] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#9b59b6' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#000000')
                                        document.getElementById('select-color')?.click()
                                    }} title='#000000' className='bg-[#000000] w-5 h-5 border border-zinc-400 text-zinc-400 flex justify-center items-center cursor-pointer'>
                                        {color == '#000000' ?
                                            '✖' :
                                            null}
                                    </div>
                                    <div onClick={() => {
                                        setColor('#f2354b')
                                        document.getElementById('select-color')?.click()
                                    }} title='#f2354b' className='bg-[#f2354b] w-5 h-5 border border-zinc-400 text-zinc-900 flex justify-center items-center cursor-pointer'>
                                        {color == '#f2354b' ?
                                            '✖' :
                                            null}
                                    </div>
                                </section>
                            </details>
                        </label>
                        <button
                            onClick={() => {
                                const nome = document.getElementById('nome') as HTMLInputElement
                                if (nome.value.length) {
                                    createCanais({
                                        cor: color,
                                        nome: nome.value,
                                        saas: { id: dataToken.id }
                                    })
                                }
                            }}
                            className="w-9 h-9 flex justify-center items-center font-bold border border-zinc-300 rounded-lg text-white bg-primary self-end">+</button>
                    </div>
                </form>
            </section>
        </div>
    )
}
