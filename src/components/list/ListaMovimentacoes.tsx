import image from '../../../public/none-result.svg'
export default function ListaMovimentacoes({ movimentacoes }: { movimentacoes: any[] }) {

    return (
        <>
            {
                movimentacoes.length ?
                    <section className="w-full min-h-56 border border-zinc-300 rounded-lg bg-white px-4 py-4 mt-8">
                        <table className="w-full mt-3 border border-zinc-200 rounded-lg">
                            <thead className="w-full">
                                <tr className="text-sm bg-slate-50 h-12">
                                    <th className="text-center">Data</th>
                                    <th className="text-center">Categoria</th>
                                    <th className="text-center">Descrição</th>
                                    <th className="text-center">Acomodação</th>
                                    <th className="text-center">Valor Bruto</th>
                                    <th className="text-center">Valor Líquido</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {
                                    movimentacoes.length > 0 ?
                                        movimentacoes.map((e) =>
                                            <tr className="text-xs bg-white h-12 border border-zinc-200 w-full hover:bg-[#FAFBFD]">
                                                <td className="text-center text-xs font-normal">{e.data}</td>
                                                <td className="text-xs font-normal capitalize flex items-center h-12 gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }}></div>
                                                    {e.categoria}
                                                </td>
                                                <td className="text-center text-xs font-normal">{e.desc}</td>
                                                <td className="text-center text-xs font-normal">{e.acomodacao}</td>
                                                <td className="text-center text-xs font-normal">{e.vbruto}</td>
                                                <td className="text-center text-xs font-normal">{e.vliq}</td>
                                            </tr>)
                                        : null
                                }
                            </tbody>
                            <tfoot className="text-xs bg-slate-50 h-12">
                                <tr >
                                    <td className="text-center">Mostrando 1 - 10 de {11} resultados</td>
                                    <td className="text-center"></td>
                                    <td className="text-center"></td>
                                    <td className="text-center"></td>
                                    <td className="text-center"></td>
                                    <td className="text-center flex items-center h-12 gap-4">
                                        <button disabled={!(11 <= 10)} className="px-2 py-1 disabled:cursor-no-drop bg-slate-200 border border-slate-300 rounded-md h-fit w-fit">&lt;</button>
                                        <div className="px-2 py-1 bg-slate-200 border border-slate-300 rounded-md h-fit w-fit">
                                            1
                                        </div>
                                        <button disabled={!(11 <= 10)} className="px-2 py-1 disabled:cursor-no-drop bg-slate-200 border border-slate-300 rounded-md h-fit w-fit">&gt;</button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </section> :
                    <section className="w-full mt-3 flex flex-col gap-3 items-center border bg-white border-zinc-200 rounded-lg py-5">
                        <img className='w-44 h-fit' src={image} alt="not found" />
                        <p className='text-center font-semibold text-xl'>Nenhuma movimentação encontrada<br />
                            para os filtros selecionados
                        </p>
                    </section>
            }
        </>
    )
}
