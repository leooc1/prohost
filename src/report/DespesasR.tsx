
export default function DespesasR() {
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
                    <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black font-light">
                            Conjunto de facas para uso de hospedes
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            Americanas
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            54,99
                        </th>
                    </tr>
                    <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black font-light">
                            Conta de Luz Agosto.2024
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            Light
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            691,69
                        </th>
                    </tr>
                    <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black font-light">
                            Conta de Gás Junho.2024
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            Naturgy
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            212,83
                        </th>
                    </tr>
                    <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black font-light">
                            Conta de Gás Julho.2024
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            Naturgy
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            168,05
                        </th>
                    </tr>
                    <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black font-light">
                            Conta de Gás Agosto.2024
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            Naturgy
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            190,62
                        </th>
                    </tr>
                    <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black font-light">
                            Compra de taças de vinho e copos para reposição
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            Americanas
                        </th>
                        <th className="text-center border border-black w-28 text-black font-light">
                            74,96
                        </th>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="text-sm h-10">
                        <th className="text-center border border-black w-28 text-black text-xl font-semibold" colSpan={2}>
                            Total
                        </th>
                        <th className="text-center border border-black w-28 text-black text-xl font-semibold">
                            1.393,14
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
