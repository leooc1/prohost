import { useState } from "react"
import CadastrarAcomodacao from "../components/CadastrarAcomodacao"

export default function Acomodacoes() {
    const [cadastrarAcomodacao, setCadastrarAcomodacao] = useState(false)
    const acomodacoes = {
        proprio: [
            { id: '123x123', nome: 'Acomodação 1', img: 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Faf19a0c58ea3d8ff8c151e96f3e2400f.cdn.bubble.io%2Ff1722622541722x929096526101806700%2Fprohost-logo.png?w=256&h=144&auto=compress&dpr=0.75&fit=max' },
            { id: '123x321', nome: 'Acomodação 2', img: 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max' }
        ],
        terceiro: [
            { id: '321x123', nome: 'Acomodação 3', img: 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F78ab8f5429dc59ec2dc40a1eb766757b.cdn.bubble.io%2Ff1694459505519x180355330462507170%2Fdefault-placeholder-300x300%255B1%255D%255B2%255D.png?w=256&h=144&auto=compress&dpr=1.25&fit=max' },
            { id: '321x321', nome: 'Acomodação 4', img: 'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Faf19a0c58ea3d8ff8c151e96f3e2400f.cdn.bubble.io%2Ff1722622541722x929096526101806700%2Fprohost-logo.png?w=256&h=144&auto=compress&dpr=0.75&fit=max' }
        ]
    }

    return (
        <div className="w-full px-8">
            <div className='mb-7 pt-2 flex justify-between gap-5 flex-wrap'>
                <h3 className="text-3xl font-semibold">Acomodações</h3>

                <button className='px-2 py-1 border border-zinc-300 rounded-lg text-sm transition-all duration-500 font-medium text-white bg-[#003447] hover:bg-[#325B6A] hover:shadow-md shadow-black'
                    onClick={() => setCadastrarAcomodacao(true)}>Cadastrar Acomodação</button>
                {cadastrarAcomodacao && <CadastrarAcomodacao close={() => setCadastrarAcomodacao(false)} />}
            </div>
            {acomodacoes.proprio.length ?
                <section className="pt-3">
                    <p className="text-2xl font-medium">Próprias</p>
                    <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                        {acomodacoes.proprio.map((e) =>
                            <li className="bg-white min-w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer"
                                onClick={() => location.assign(`/acomodacoes/${e.id}`)}>
                                <img src={e.img} className="object-cover h-24 w-full rounded-md" />
                                <p className="font-semibold mt-4 text-lg">{e.nome}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                                        <div className="bg-[#1266B5] w-2 h-2 rounded-full"></div>
                                        <div className="uppercase text-xs font-semibold text-[#1266B5]" style={{ lineHeight: 'normal', fontSize: '10px' }}>próprio</div>
                                    </div>
                                    <button onClick={(event) => {
                                        event.stopPropagation()
                                        alert('sem acesso ao banco.')
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="rgba(255,0,0,0)" stroke="currentColor" stroke-width="1" stroke-linecap="undefined" stroke-linejoin="round" className="feather feather-trash w-7 h-fit" color="rgba(255,0,0,1)" pointer-events="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </li>)}
                    </ul>
                </section>
                : null
            }
            {acomodacoes.terceiro.length ?
                <section className="py-12">
                    <p className="text-2xl font-medium">Terceiros</p>
                    <ul className="border border-zinc-300 w-full mt-5 rounded-md pt-px pb-1 px-px flex overflow-x-scroll gap-10">
                        {acomodacoes.terceiro.map((e) =>
                            <li className="bg-white min-w-52 min-h-56 border border-zinc-200 rounded-md p-5 cursor-pointer"
                                onClick={() => location.assign(`/acomodacoes/${e.id}`)}>
                                <img src={e.img} className="object-cover h-24 w-full rounded-md" />
                                <p className="font-semibold mt-4 text-lg">{e.nome}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <div className="flex items-center gap-1 bg-[#CCD6DA] h-fit w-fit px-2 py-1 rounded-md">
                                        <div className="bg-[#1266B5] w-2 h-2 rounded-full"></div>
                                        <div className="uppercase text-xs font-semibold text-[#1266B5]" style={{ lineHeight: 'normal', fontSize: '10px' }}>terceiro</div>
                                    </div>
                                    <button onClick={(event) => {
                                        event.stopPropagation()
                                        alert('sem acesso ao banco.')
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="rgba(255,0,0,0)" stroke="currentColor" stroke-width="1" stroke-linecap="undefined" stroke-linejoin="round" className="feather feather-trash w-7 h-fit" color="rgba(255,0,0,1)" pointer-events="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </li>)}
                    </ul>
                </section>
                : null
            }
        </div>
    )
}
