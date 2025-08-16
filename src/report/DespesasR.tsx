
export default function DespesasR({ despesas }: { despesas: any[] }) {
    return (
        <div>
            <table className='mx-20'>
                <thead className="w-full">
                    <tr className="text-sm h-10 bg-slate-400 text-white">
                        <th className="text-center border border-black w-full px-5 font-semibold text-xl">Descrição das Despesas</th>
                        <th className="text-center border border-black w-full px-5 font-semibold text-xl">Empresa</th>
                        <th className="text-center border border-black w-full px-10 font-semibold text-xl">Valor</th>
                    </tr>
                </thead>
                <tbody className="">
                    {despesas.length > 0 && despesas.map(e => <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black font-light">
                            {e.nome}
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            {e.recebedor}
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            {new Intl.NumberFormat('pt-BR', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            }).format(e.valor_liq)}
                        </th>
                    </tr>)}
                </tbody>
                <tfoot>
                    <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black text-xl font-semibold" colSpan={2}>
                            Total
                        </th>
                        <th className="text-center border border-black w-28 text-black text-xl font-semibold">
                            {despesas.reduce((total, item) => {
                            return total + parseFloat((item.valor_liq) || 0);
                        }, 0)}
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
