import { Dispatch, SetStateAction, useEffect, useState } from "react"
import ph from "/prohost-logo.png"
import HistoricoFaturamento from "../HistoricoFaturamento"


type RentabilidadeDesempenhoProps = {
    imagem?: string
    editPages: boolean[]
    setEditPages: Dispatch<SetStateAction<boolean[]>>
    cores: {
        primario: string
        letra: string
    }
    saas: number
    dataIni: string
    dataFim: string
    acomodacao: number
}

export default function RentabilidadeDesempenho(props: RentabilidadeDesempenhoProps) {
    const apiURL = import.meta.env.VITE_API_URL
    const [dados, setDados] = useState<any>(null)

    async function getDados() {
        await fetch(`${apiURL}/relatorio/rentabilidade/${props.saas}/${props.dataIni}/${props.dataFim}/${props.acomodacao}`)
            .then(res => res.json())
            .then(data => {
                setDados(data)
            })
    }

    useEffect(() => { getDados() }, [])

    return (
        <div className={`relative ${!props.editPages[2] && 'opacity-30'}`}>
            <button onClick={() => {
                let error = props.editPages
                error = (error.map((e, i) => i === 2 ? !e : e))
                props.setEditPages(error)
            }} className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${props.editPages[2] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{props.editPages[2] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
            {dados ?
                <section style={{ backgroundColor: props.cores.primario }} id='desempenho-imovel' className={`${!props.editPages[2] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}>
                    <div onClick={() => {
                        const logos = document.querySelectorAll('.logo-ph')
                        if (logos[0].classList.contains('opacity-30'))
                            logos.forEach(l => {
                                l.classList.remove('opacity-30')
                                l.classList.add('opacity-100')
                            })
                        else
                            logos.forEach(l => {
                                l.classList.remove('opacity-100')
                                l.classList.add('opacity-30')
                            })
                    }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                        <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                        <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                    </div>
                    <p style={{ color: props.cores.letra }} className={`text-3xl text-[${props.cores.letra}]`}>Desempenho e rentabilidade do imóvel</p>
                    <div className='flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8'>
                        <div style={{ backgroundColor: props.cores.primario }} className={`w-full h-px bg-[${props.cores.primario}]`}></div>
                        <img src={props.imagem} alt="" className='bg-primary max-w-56 max-h-28 h-28' />
                    </div>
                    <section className='flex md:gap-10 md:mt-16 flex-wrap'>
                        <div className='bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg h-fit'>
                            <div style={{ color: props.cores.letra }} className={`w-40 text-[${props.cores.letra}] text-sm md:text-base`}>Faturamento do período</div>
                            <div style={{ color: props.cores.letra }} className={`text-end text-[${props.cores.letra}] font-medium`}><span className='text-base pr-3'>R$</span>{new Intl.NumberFormat('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(Number(dados.faturamento_periodo))}</div>
                        </div>
                        <div className='bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg h-fit'>
                            <div style={{ color: props.cores.letra }} className={`w-40 text-[${props.cores.letra}] text-sm md:text-base`}>Rentabilidade do imóvel</div>
                            <div style={{ color: props.cores.letra }} className={`text-end text-[${props.cores.letra}] font-medium`}>{Number(dados.rentabilidade).toFixed(1)}%</div>
                        </div>
                    </section>
                    <HistoricoFaturamento
                        mes={Number(props.dataIni.split('-')[1])}
                        ano={Number(props.dataIni.split('-')[0])}
                        dadosFaturamento={dados.desempenho.map((d: any) => d.faturamento_liquido)}
                        dadosDespesa={dados.desempenho.map((d: any) => d.despesas)} />
                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}]`}>*Valor do imóvel estimado em R$ {new Intl.NumberFormat('pt-BR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(Number(dados.valor_imovel))}</p>
                </section>
                : <section style={{ backgroundColor: props.cores.primario }} id='calendario' className={`${!props.editPages[0] && 'pointer-events-none opacity-30'} flex flex-col justify-center items-center text-white p-10 h-screen bg-[${props.cores.primario}] relative`}><div
  className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
></div>
</section>}
        </div>
    )
}
