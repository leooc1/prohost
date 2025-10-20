import { useState } from "react"
interface comparatidoProps {
    passado: number
    atual: number
    data: string[]
    nome: string,
    formatarMoeda?: (valor: number) => string;
}

export default function Comparativo(props: comparatidoProps) {
    const [card, setCard] = useState<boolean>(false)
    function formatarPorcentagem() {
        /* const pct = ((props.atual / props.passado) * 100)
        if (props.passado > props.atual){
            return Number.isInteger(pct*-1) ? (pct*-1) : Number(pct*-1).toFixed(2)
        }else{
            return Number.isInteger(pct-100) ? (pct-100) : Number(pct-100).toFixed(2)
        } */
        const pct = ((props.atual - props.passado) / Math.abs(props.passado)) * 100
        return Number.isInteger(pct) ? (pct) : Number(pct).toFixed(2)
    }

    function dataAtual(data: string) {
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano.slice(-2)}`;
    }

    function dataPassado(data: string) {
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${(parseInt(ano) - 1).toString().slice(-2)}`;
    }

    return (
        <>
            <div style={{ backgroundColor: props.passado > props.atual ? '#feeded' : '#dcfce7' }} className="flex rounded-md w-fit px-2 items-baseline cursor-pointer" onClick={() => setCard(true)}>
                <svg className="w-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={props.passado > props.atual ? '#EF4C4F' : '#82C785'}><path d="M3 12H7V21H3V12ZM17 8H21V21H17V8ZM10 2H14V21H10V2Z"></path></svg>
                <p style={{ color: props.passado > props.atual ? '#EF4C4F' : '#82C785' }} className={`font-medium text-sm`}>{props.passado == 0 ? 0 :
                    formatarPorcentagem()}</p>
                <p style={{ color: props.passado > props.atual ? '#EF4C4F' : '#82C785' }} className={`font-medium ml-1`}>%</p>
            </div>
            {card &&
                <div className='w-screen h-screen fixed z-10 top-0 right-0'>
                    <div className="w-screen h-screen bg-black absolute top-0 right-0 bg-opacity-20" onClick={() => setCard(false)}> </div>
                    <section className="flex flex-col absolute w-96 px-4 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded-xl py-4 border border-black">
                        <p className="text-center font-medium text-zinc-500 text">Comparativos entre Períodos
                            <br />
                            <span className="font-semibold">{props.nome}</span>
                        </p>
                        <div className="flex justify-between text-zinc-600 text-sm">
                            <p className="text-left">
                                PERÍODO DE {dataPassado(props.data[0])}
                                <br />ATÉ {dataPassado(props.data[1])}
                            </p>
                            <p className="text-right">
                                PERÍODO DE {dataAtual(props.data[0])}
                                <br />ATÉ {dataAtual(props.data[1])}
                            </p>
                        </div>

                        <div className="flex justify-between text-zinc-600">
                            <p className="text-left text-2xl font-semibold">
                                {props.formatarMoeda ? props.formatarMoeda(props.passado) : (Number.isInteger(props.passado) ? props.passado : Number(props.passado).toFixed(2))}
                            </p>
                            <span className="font-semibold text-xl">✕</span>
                            <p className="text-right text-2xl font-semibold">
                                {props.formatarMoeda ? props.formatarMoeda(props.atual) : (Number.isInteger(props.atual) ? props.atual : Number(props.atual).toFixed(2))}
                            </p>
                        </div>

                        <div className="bg-[#ED3E44] text-white text-xl px-5 text-center w-28 h-28 flex justify-center items-center self-center rounded-full">
                            <span>{props.passado == 0 ? 0 :
                                formatarPorcentagem()}</span>
                            <span>%</span>
                        </div>
                    </section>
                </div>
            }
        </>
    )
}
