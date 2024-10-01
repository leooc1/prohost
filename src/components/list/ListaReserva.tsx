
export default function ListaReserva({ acomodacoes, reservas }: { acomodacoes: any[], reservas: any[] }) {
    function formatDate(isoString: string) {
        // Cria um objeto Date a partir da string ISO
        const date = new Date(isoString);

        // Extrai o dia, mês e ano
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        // Retorna a data formatada no formato dd/mm/aaaa
        return `${day}/${month}/${year}`;
    }
    function calcularDiasEntreDatas(dataInicio: string, dataFim: string) {
        const inicio: any = new Date(dataInicio);
        const fim: any = new Date(dataFim);

        const diferencaMs = fim - inicio;

        const diferencaDias = diferencaMs / (1000 * 60 * 60 * 24);

        return diferencaDias;
    }
    function nomeAcomodacao(id: string) {
        const acomodacao: any = acomodacoes.find(e => e.id == id)
        return acomodacao.title
    }

    return (
        <section className="w-full min-h-56 border border-zinc-300 rounded-lg bg-white px-4 py-4">
            <div className="flex gap-4">
                <label htmlFor="canal" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Canal
                    <select name="canal" id="canal" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm">
                        <option value="all">Todos os canais</option>
                        <option value="Indicação">Indicação</option>
                    </select>
                </label>
                <label htmlFor="tipo" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Tipo de Evento
                    <select name="tipo" id="tipo" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm">
                        <option value="all">Todos os tipos</option>
                        <option value="reserva">Reserva</option>
                        <option value="continuidade">Continuidade</option>
                        <option value="indisponibilidade">Indisponibilidade</option>
                    </select>
                </label>
                <label htmlFor="periodo" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Período de Análise
                    <select name="periodo" id="periodo" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm">
                        <option value="m-atual" className="text-black">Mês Atual</option>
                        <option value="m-passado" className="text-black">Mês Passado</option>
                        <option value="a-atual" className="text-black">Ano Atual</option>
                        <option value="a-passado" className="text-black">Ano Passado</option>
                        <option value="personalizado" className="text-black">Personalizado</option>
                    </select>
                </label>
            </div>
            <div className="flex gap-4 mt-3">
                <label htmlFor="acomodacao" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Acomodação
                    <select name="acomodacao" id="acomodacao" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm">
                        <option value="all">Todas</option>
                        <option value="1">Lorem</option>
                    </select>
                </label>
                <label htmlFor="order" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Ordenar por:
                    <select name="order" id="order" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm">
                        <option value="all">Padrão</option>
                        <option value="numero">Número</option>
                        <option value="checkin">Checkin</option>
                        <option value="checkout">Checkout</option>
                        <option value="valor">Valor</option>
                        <option value="valor-liquido">Valor Líquido</option>
                    </select>
                </label>
                <label htmlFor="classificar" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Classificar por:
                    <select name="classificar" id="classificar" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm">
                        <option value="descrescente" className="text-black">Maior &#10140; Menor</option>
                        <option value="crescente" className="text-black">Menor &#10140; Maior</option>
                    </select>
                </label>
            </div>
            <table className="w-full mt-3 border border-zinc-200 rounded-lg grid">
                <thead className="table table-fixed w-full">
                    <tr className="text-xs bg-slate-50 h-12">
                        <th className="text-center px-3">#</th>
                        <th className="text-center">Acomodação</th>
                        <th className="text-center">Canal</th>
                        <th className="text-center">Hóspede</th>
                        <th className="text-center">Check-in</th>
                        <th className="text-center">Check-out</th>
                        <th className="text-center">Diárias</th>
                        <th className="text-center">Valor Total</th>
                        <th className="text-center">Valor Líquido</th>
                    </tr>
                </thead>
                <tbody className="max-h-64 overflow-y-scroll block">
                    {
                        reservas.length > 0 && acomodacoes.length > 0 ?
                            reservas.map((e) =>
                                <tr className="text-xs bg-white h-12 border border-zinc-200 table table-fixed w-full">
                                    <td className="text-center text-xs font-medium">
                                        {e.tipo == 'Indisponibilidade' ?
                                            '🚫' :
                                            <span className="flex items-center justify-center gap-1">
                                                {e.resourceId}
                                                {e.tipo == 'Continuidade' ? <svg className="w-3 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 2.54 2.54" fill-rule="evenodd"><g><circle cx="1.27" cy="1.27" r="1.27" fill="#30c46d" opacity="1" data-original="#48b02c"></circle><g fill="#fff"><path d="M1.143 1.944V.674a.127.127 0 0 1 .254 0v1.27a.127.127 0 0 1-.254 0z" fill="#ffffff" opacity="1" data-original="#ffffff"></path><path d="M.635 1.182h1.27a.127.127 0 0 1 0 .254H.635a.127.127 0 0 1 0-.254z" fill="#ffffff" opacity="1" data-original="#ffffff" ></path></g></g></svg> : null}
                                            </span>
                                        }
                                    </td>
                                    <td className="text-center text-xs font-medium">{nomeAcomodacao(e.resourceId)}</td>
                                    <td className="text-center text-xs font-medium text-white">
                                        {e.tipo != 'Indisponibilidade' && e.tipo != 'Continuidade' ?
                                            <div className="py-1 w-full rounded-md" style={{ backgroundColor: e.color }}>'Indicação'</div> : null}
                                        {e.tipo == 'Continuidade' ?
                                            <div className="bg-[#30C46D] py-1 w-full rounded-md">Continuidade</div> : null}
                                        {e.tipo == 'Indisponibilidade' ?
                                            <div className="bg-[#353535] py-1 w-full rounded-md">Indisponibilidade</div> : null}
                                    </td>
                                    <td className="text-center text-xs font-medium">{!(e.tipo == 'Indisponibilidade') && e.title}</td>
                                    <td className="text-center text-xs font-medium">{formatDate(e.start)}</td>
                                    <td className="text-center text-xs font-medium">{formatDate(e.end)}</td>
                                    <td className="text-center text-xs font-medium">{calcularDiasEntreDatas(e.start, e.end)}</td>
                                    <td className="text-center text-xs font-medium">{!(e.tipo == 'Indisponibilidade') && `R$ ${e.bruto.toFixed(2)}`}</td>
                                    <td className="text-center text-xs font-medium">{!(e.tipo == 'Indisponibilidade') && `R$ ${e.liquido.toFixed(2)}`}</td>
                                </tr>)
                            : null
                    }
                </tbody>
                <tfoot className="table table-fixed w-full">
                    <tr className="text-xs bg-slate-50 h-12">
                        <td className="text-center">Total de Reserva: {3}</td>
                        <td className="text-center">Total Bruto: R$ {(250).toFixed(2)}</td>
                        <td className="text-center">Total Líquido: R$ {(200).toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </section>
    )
}
