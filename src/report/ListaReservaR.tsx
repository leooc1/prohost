interface Reserva {
    id?: number
    acomodacao: { id: number, foto: string, nome: string }
    check_in: string
    check_out: string
    canal_reserva: { id: number, cor: string, nome: string } | null
    comissao_ota: number
    continuidade: boolean
    hospede: { id: number, nome: string } | null
    qtd_hospede: number
    saas: { id: number }
    valor: number
    valor_liq: number
    valor_prop: number
    valor_gestor: number
    tipo_reserva: string
    obs: string | null
}

export default function ListaReservaR({ reservas}: { reservas: Reserva[]}) {

    function formatDate(isoString: string) {
        const date = new Date(isoString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    function formatarMoedaBrasileira(valorStr: string) {
        const valor = parseFloat(valorStr);
        if (isNaN(valor)) {
            return "Valor inválido";
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    function calcularDiasEntreDatas(dataInicio: string, dataFim: string): number {
        const inicio: Date = new Date(dataInicio);
        const fim: Date = new Date(dataFim);

        const diferencaMs: number = fim.getTime() - inicio.getTime();

        const diferencaDias: number = Math.round(diferencaMs / (1000 * 60 * 60 * 24));

        return diferencaDias == 0 ? 1 : diferencaDias;
    }

    return (
        <table id="listagem" className="w-full mt-3 border border-zinc-200 rounded-lg grid">
            <thead className="table table-fixed w-full">
                <tr className="text-xs bg-slate-50 h-12">
                    <th className="text-center">Canal</th>
                    <th className="text-center">Hóspede</th>
                    <th className="text-center">Check-in</th>
                    <th className="text-center">Check-out</th>
                    <th className="text-center">Diárias</th>
                    <th className="text-center">Valor Total</th>
                    <th className="text-center">Valor Líquido</th>
                </tr>
            </thead>
            <tbody className="block">
                {
                    reservas.length > 0 ?
                        reservas.map((e) =>
                            <tr className="text-xs bg-white h-12 border border-zinc-200 table table-fixed w-full">
                                <td className="text-center text-xs font-medium text-white">
                                    {e.tipo_reserva != 'Indisponibilidade' && e.tipo_reserva != 'Continuidade' && e.tipo_reserva != 'Cancelamento' ?
                                        <div className="py-1 w-full rounded-md" style={{ backgroundColor: e.canal_reserva?.cor }}>{e.canal_reserva?.nome}</div> : null}
                                    {e.tipo_reserva == 'Continuidade' ?
                                        <div className="bg-[#30C46D] py-1 w-full rounded-md">Continuidade</div> : null}
                                    {e.tipo_reserva == 'Indisponibilidade' ?
                                        <div className="bg-[#353535] py-1 w-full rounded-md">Indisponibilidade</div> : null}
                                    {e.tipo_reserva == 'Cancelamento' ?
                                        <div className="bg-[#f67828] py-1 w-full rounded-md">Cancelamento</div> : null}
                                </td>
                                <td className="text-center text-xs font-medium">{!(e.tipo_reserva == 'Indisponibilidade') && e.hospede?.nome}</td>
                                <td className="text-center text-xs font-medium">{formatDate(e.check_in)}</td>
                                <td className="text-center text-xs font-medium">{formatDate(e.check_out)}</td>
                                <td className="text-center text-xs font-medium">{calcularDiasEntreDatas(e.check_in, e.check_out)}</td>
                                <td className="text-center text-xs font-medium">{!(e.tipo_reserva == 'Indisponibilidade') && `${formatarMoedaBrasileira(Number(e.valor).toFixed(2))}`}</td>
                                <td className="text-center text-xs font-medium">{!(e.tipo_reserva == 'Indisponibilidade') && `${formatarMoedaBrasileira(Number(e.valor_liq).toFixed(2))}`}</td>
                            </tr>)
                        : null
                }
            </tbody>
        </table>
    )
}
