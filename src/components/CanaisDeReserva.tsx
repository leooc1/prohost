import { useCallback, useContext, useEffect, useState } from 'react'
import { SideBarContext } from '../contexts/SideBarMenuContext'
import Notify from './notify/Notify'
interface Canais {
    id?: number
    cor: string
    nome: string
    saas: { id: number }
}

//const apiURl = import.meta.env.VITE_baseURLAPI;

export default function CanaisDeReserva({ close, permissao }: { close: () => void, permissao: number }) {
    const apiURL = import.meta.env.VITE_API_URL
    const { dataToken } = useContext(SideBarContext)
    const [canais, setCanais] = useState<Canais[]>([])
    const [color, setColor] = useState('#bdc3c7')
    const [notify, setNotify] = useState({ type: 1, text: 'Criado!' })
    const [showNotify, setShowNotify] = useState<boolean>(false)

    const getCanais = useCallback(async () => {
        await fetch(`${apiURL}/canal_reserva/` + dataToken.id, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Canais[]) => {
                setCanais(data)
            })
            .catch(err => console.log(err))
    }, [apiURL, dataToken.id])

    async function updateCanais(id: number, pbody: { cor: string, nome: string }) {
        await fetch(`${apiURL}/canal_reserva/${id}`, {
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
        await fetch(`${apiURL}/canal_reserva/`, {
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
                    setNotify({ type: 1, text: 'Criado!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 3000)
                    setColor('#bdc3c7')
                    nome.value = ''
                    getCanais()
                }
            })
            .catch(err => console.log(err))
    }

    async function deleteCanais(id: number) {
        await fetch(`${apiURL}/canal_reserva/${id}`, {
            method: 'DELETE',
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected) {
                    setNotify({ type: 1, text: 'Excluído!' })
                    setShowNotify(true)
                    setTimeout(() => {
                        setShowNotify(false);
                    }, 3000)
                    close()
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getCanais()
    }, [dataToken, getCanais])

    return (
        <div className='w-screen h-screen fixed z-10 top-0 right-0'>
            <div className="w-screen h-screen bg-black absolute  top-0 right-0 bg-opacity-20" onClick={close}> </div>
            {showNotify && <Notify type={notify.type} text={notify.text} />}
            <section className="flex flex-col absolute min-w-80 max-w-[470px] px-4 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md py-4 max-h-screen overflow-scroll scroll-default">
                <section>
                    <h5 className="font-semibold text-2xl mb-2">Canais de Reserva</h5>
                    <ul className="flex flex-col gap-1">
                        {
                            canais.length ?
                                canais.map((e) =>
                                    <li className="flex items-center border border-zinc-200 pr-2 py-1 rounded-md pl-6">
                                        <details onClick={(e) => {
                                            if (!(permissao >= 3))
                                                e.preventDefault()
                                        }} className="relative">
                                            <summary className="flex">
                                                <div id={`cor-${e.id}`} title={e.cor} style={{ backgroundColor: e.cor }} className={`cursor-pointer w-3 h-3 rounded-full mr-5`}></div>
                                            </summary>

                                            <section className="grid grid-cols-6 absolute top-full bg-white p-2 gap-4 w-52 rounded-xl">
                                                {[
                                                    '#ffffff', '#bdc3c7', '#f1c40f', '#f39c12', '#e74c3c',
                                                    '#1abc9c', '#17d9fd', '#0000ff', '#2980b9', '#9b59b6',
                                                    '#000000', '#f2354b', '#ff9ff3', '#00d2d3', '#ff6b6b',
                                                    '#48dbfb', '#feca57', '#5f27cd', '#2e86de', '#d980fa',
                                                    '#10ac84', '#ff9f43', '#576574', '#8395a7'
                                                ].map(colorHex => (
                                                    <div
                                                        key={colorHex}
                                                        onClick={() => {
                                                            setColor(colorHex);
                                                            document.getElementById('select-color')?.click();
                                                        }}
                                                        title={colorHex}
                                                        style={{ backgroundColor: colorHex }}
                                                        className="w-5 h-5 border border-zinc-400 flex justify-center items-center cursor-pointer"
                                                    >
                                                        {color === colorHex ? '✖' : null}
                                                    </div>
                                                ))}
                                            </section>


                                        </details>

                                        <input type="text" id={`nome-${e.id}`} defaultValue={e.nome}
                                            disabled={!(permissao >= 3)} className={`outline-none border-none bg-transparent focus:bg-zinc-200 rounded-md px-1`}
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
                                            disabled={!(permissao >= 4)}
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
                            <span className="text-zinc-500 font-medium mb-1">Nome<span className='text-red-500 font-bold'> *</span></span>
                            <input type="text" name="nome" id="nome" className="border border-zinc-300 w-full rounded-md px-2 py-1 outline-none" />
                        </label>
                        <label htmlFor="cor" className="flex flex-col">
                            <span className="text-zinc-500 font-medium mb-1">Cor</span>
                            <details name="color" id="color" className={`outline outline-zinc-300 border2 border-white max-w-20 rounded-md px-2 py-1 outline-none relative`}>
                                <summary className="flex">
                                    <div id="select-color" style={{ backgroundColor: color }} className={`cursor-pointer w-6 h-6 border border-zinc-400 pl-7`}></div>
                                </summary>

                                <section className="grid grid-cols-6 absolute top-full bg-white p-2 gap-4 w-52 rounded-xl">
                                    {[
                                        '#ffffff', '#bdc3c7', '#f1c40f', '#f39c12', '#e74c3c',
                                        '#1abc9c', '#17d9fd', '#0000ff', '#2980b9', '#9b59b6',
                                        '#000000', '#f2354b', '#ff9ff3', '#00d2d3', '#ff6b6b',
                                        '#48dbfb', '#feca57', '#5f27cd', '#2e86de', '#d980fa',
                                        '#10ac84', '#ff9f43', '#576574', '#8395a7'
                                    ].map(colorHex => (
                                        <div
                                            key={colorHex}
                                            onClick={() => {
                                                setColor(colorHex);
                                                document.getElementById('select-color')?.click();
                                            }}
                                            title={colorHex}
                                            style={{ backgroundColor: colorHex }}
                                            className="w-5 h-5 border border-zinc-400 flex justify-center items-center cursor-pointer"
                                        >
                                            {color === colorHex ? '✖' : null}
                                        </div>
                                    ))}
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
