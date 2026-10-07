
export default function DespesasR({ despesas = [] }: { despesas?: any[] }) {
    return (
        <div>
            <table className='mx-20'>
                <thead className="w-full">
                    <tr className="text-sm h-10 bg-[#008374] text-white">
                        <th className="text-center border border-white w-fit px-10 font-semibold text-xl">Data</th>
                        <th className="text-center border border-white w-full px-5 font-semibold text-xl">Descrição das Despesas</th>
                        <th className="text-center border border-white w-full px-5 font-semibold text-xl">Empresa</th>
                        <th className="text-center border border-white w-full px-10 font-semibold text-xl">Valor</th>
                    </tr>
                </thead>
                <tbody className="">
                    {despesas.length > 0 && despesas.map(e => <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black font-light bg-slate-200 px-1">
                            {e.data.split('T')[0].split('-')[2]}/
                            {e.data.split('T')[0].split('-')[1]}/
                            {e.data.split('T')[0].split('-')[0]}
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light bg-slate-200 px-1">
                            {e.nome}
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light bg-slate-200 px-1">
                            {e.recebedor}
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light bg-slate-200 px-1">
                            R$ {new Intl.NumberFormat('pt-BR', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            }).format(e.valor_liq)}
                        </th>
                    </tr>)}
                </tbody>
                <tfoot>
                    <tr className="text-sm h-10 bg-[#008374]">
                        <th className="text-center border border-white w-28 text-white text-xl font-semibold" colSpan={3}>
                            Total
                        </th>
                        <th className="text-center border border-white w-28 text-white text-xl font-semibold">
                            R$ {new Intl.NumberFormat('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(despesas.reduce((total, item) => {
                            return total + parseFloat((item.valor_liq) || 0)
                        }, 0))}
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
