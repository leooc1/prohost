import { useContext, useEffect, useState } from "react"
import CadastrarAcomodacao from "../components/CadastrarAcomodacao"
import { SideBarContext } from "../contexts/SideBarMenuContext"
import Loader from "../components/Loader"

interface Acomodacao {
    id: number
    tipo: string
    comissao: number
    data_ini_ope: string
    descricao: string
    endereco: string
    check_in_p: string
    check_out_p: string
    foto: string
    nome: string
    numero_hospedes: number
    valor_imovel: number
    desativado: boolean
    saas: { id: number }
}

const apiUrl = import.meta.env.VITE_baseURLAPI;

export default function Acomodacoes() {
    const { dataToken } = useContext(SideBarContext)
    const [loaded, setLoaded] = useState(false)
    const [cadastrarAcomodacao, setCadastrarAcomodacao] = useState(false)
    const [proprio, setProprio] = useState<Acomodacao[]>([])
    const [terceiro, setTerceiro] = useState<Acomodacao[]>([])
    const [desativados, setDesativados] = useState<Acomodacao[]>([])

    async function acomodacoes() {
        await fetch('${apiUrl}/acomodacao/' + dataToken.id, {
            method: 'GET'
        })
            .then(data => data.json())
            .then((data: Acomodacao[]) => {
                setProprio(data.filter((e => e.tipo == 'proprio' && !e.desativado)))
                setTerceiro(data.filter((e => e.tipo == 'terceiro' && !e.desativado)))
                setDesativados(data.filter((e => e.desativado)))
                setLoaded(true)
            })
            .catch(err => console.log(err))
    }

    async function desativar(id: number, desativado: boolean) {
        await fetch(`${apiUrl}/acomodacao/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ desativado: desativado }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.affected == 1) {
                    desativado ? alert('DESATIVADO!') : alert('ATIVADO!');
                    close()
                    location.reload()
                }
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        acomodacoes()
        
    }, [dataToken])

    return (
        loaded ?
            <div className="w-full px-8">
                <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                    <h3 className="text-3xl font-semibold">Acomodações</h3>

                    <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black'
                        onClick={() => setCadastrarAcomodacao(true)}>Cadastrar Acomodação</button>
                    {cadastrarAcomodacao && <CadastrarAcomodacao close={() => setCadastrarAcomodacao(false)} />}
                </div>
                {proprio.length ?
                    <section className="pt-3">
                        <p className="text-2xl font-medium">Próprias</p>
                        <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                            {proprio.map((e) =>
                                <li className="bg-white min-w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer"
                                    onClick={() => location.assign(`/acomodacoes/${e.id}`)}>
                                    <img src={e.foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'} className="object-cover h-24 w-48 rounded-md" />
                                    <p className="font-semibold mt-4 text-lg">{e.nome}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                                            <div className="bg-[#1266B5] w-2 h-2 rounded-full"></div>
                                            <div className="uppercase text-xs font-semibold text-[#1266B5]" style={{ lineHeight: 'normal', fontSize: '10px' }}>próprio</div>
                                        </div>
                                        <button className="hover:bg-red-200 bg-transparent p-1 rounded-lg transition-all duration-200" onClick={(event) => {
                                            event.stopPropagation()
                                            desativar(e.id, true)
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="rgba(255,0,0,0)" stroke="currentColor" stroke-width="1" stroke-linecap="undefined" stroke-linejoin="round" className="feather feather-trash w-7 h-fit" color="rgba(255,0,0,1)" pointer-events="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </li>)}
                        </ul>
                    </section>
                    : null
                }
                {terceiro.length ?
                    <section className="py-12">
                        <p className="text-2xl font-medium">Terceiros</p>
                        <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                            {terceiro.map((e) =>
                                <li className="bg-white min-w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer"
                                    onClick={() => location.assign(`/acomodacoes/${e.id}`)}>
                                    <img src={e.foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'} className="object-cover h-24 w-48 rounded-md" />
                                    <p className="font-semibold mt-4 text-lg">{e.nome}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                                            <div className="bg-[#3A8E71] w-2 h-2 rounded-full"></div>
                                            <div className="uppercase text-xs font-semibold text-[#3A8E71]" style={{ lineHeight: 'normal', fontSize: '10px' }}>terceiro</div>
                                        </div>
                                        <button className="hover:bg-red-200 bg-transparent p-1 rounded-lg transition-all duration-200" onClick={(event) => {
                                            event.stopPropagation()
                                            desativar(e.id, true)
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="rgba(255,0,0,0)" stroke="currentColor" stroke-width="1" stroke-linecap="undefined" stroke-linejoin="round" className="feather feather-trash w-7 h-fit" color="rgba(255,0,0,1)" pointer-events="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </li>)}
                        </ul>
                    </section>
                    : null
                }
                {desativados.length ?
                    <section className="py-12">
                        <p className="text-2xl font-medium">Desativados</p>
                        <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                            {desativados.map((e) =>
                                <li className="bg-white min-w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer opacity-75 brightness-75">
                                    <img src={e.foto || 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max'} className="object-cover h-24 w-48 rounded-md" />
                                    <p className="font-semibold mt-4 text-lg">{e.nome}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                                            <div className={`bg-[${e?.tipo == 'proprio' ? '#1266B5' : '#3A8E71'}] w-2 h-2 rounded-full`}></div>
                                            <div className={`uppercase text-xs font-semibold text-[${e?.tipo == 'proprio' ? '#1266B5' : '#3A8E71'}]`} style={{ lineHeight: 'normal', fontSize: '10px' }}>{e?.tipo}</div>
                                        </div>
                                        <button className="hover:bg-green-200 bg-transparent p-1 rounded-lg transition-all duration-200" onClick={(event) => {
                                            event.stopPropagation()
                                            desativar(e.id, false)
                                        }}>
                                            <svg className="feather feather-trash w-7 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 512"><g><path d="M497.36 69.995c-7.532-7.545-19.753-7.558-27.285-.032L238.582 300.845l-83.522-90.713c-7.217-7.834-19.419-8.342-27.266-1.126-7.841 7.217-8.343 19.425-1.126 27.266l97.126 105.481a19.273 19.273 0 0 0 13.784 6.22c.141.006.277.006.412.006a19.317 19.317 0 0 0 13.623-5.628L497.322 97.286c7.551-7.525 7.564-19.746.038-27.291z" fill="#00dd00" opacity="1" data-original="#000000"></path><path d="M492.703 236.703c-10.658 0-19.296 8.638-19.296 19.297 0 119.883-97.524 217.407-217.407 217.407-119.876 0-217.407-97.524-217.407-217.407 0-119.876 97.531-217.407 217.407-217.407 10.658 0 19.297-8.638 19.297-19.296C275.297 8.638 266.658 0 256 0 114.84 0 0 114.84 0 256c0 141.154 114.84 256 256 256 141.154 0 256-114.846 256-256 0-10.658-8.638-19.297-19.297-19.297z" fill="#00dd00" opacity="1" data-original="#000000"></path></g></svg>
                                        </button>
                                    </div>
                                </li>)}
                        </ul>
                    </section>
                    : null
                }
            </div>
            :
            <Loader />
    )
}
