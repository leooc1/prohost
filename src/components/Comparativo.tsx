import { useState } from "react"

export default function Comparativo({ number }: { number: number }) {
    const [card, setCard] = useState<boolean>(false)
    return (
        <>
            <div className="flex bg-green-100 rounded-md w-fit px-2 items-baseline cursor-pointer" onClick={() => setCard(true)}>
                <svg className="w-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#82C785"><path d="M3 12H7V21H3V12ZM17 8H21V21H17V8ZM10 2H14V21H10V2Z"></path></svg>
                <p className="text-[#82C785] font-medium">{number}</p>
                <p className="text-[#82C785] font-medium ml-1">%</p>
            </div>
            {card &&
                <div className='w-screen h-screen fixed z-10 top-0 right-0'>
                    <div className="w-screen h-screen bg-black absolute top-0 right-0 bg-opacity-20" onClick={() => setCard(false)}> </div>
                    <section className="flex flex-col absolute w-96 px-4 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded-xl py-4 border border-black">
                        <p className="text-center font-medium text-zinc-500 text">Comparativos entre Períodos
                            <br />
                            <span className="font-semibold">{'TOTAL DE RESERVAS'}</span>
                        </p>
                        <div className="flex justify-between text-zinc-600 text-sm">
                            <p className="text-left">
                                PERÍODO DE 11/11/23
                                <br />ATÉ 11/12/23
                            </p>
                            <p className="text-right">
                                PERÍODO DE 11/11/24
                                <br />ATÉ 11/12/24
                            </p>
                        </div>

                        <div className="flex justify-between text-zinc-600">
                            <p className="text-left text-3xl font-semibold">
                                {54321}
                            </p>
                            <span className="font-semibold text-xl">✕</span>
                            <p className="text-right text-3xl font-semibold">
                                {12345}
                            </p>
                        </div>

                        <div className="bg-[#ED3E44] text-white text-2xl px-5 text-center w-28 h-28 flex justify-center items-center self-center rounded-full">
                            <span>{900}</span>
                            <span>%</span>
                        </div>
                    </section>
                </div>
            }
        </>
    )
}
