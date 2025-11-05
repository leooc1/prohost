import { useState } from "react"

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
    valor_liq_calculado: number
    valor_prop: number
    valor_gestor: number
    tipo_reserva: string
    obs: string | null
}
const open = <svg id="eye-open" className="w-4 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path></svg>
const closed = <svg className="w-4 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path></svg>
export default function ListaReservaR({ reservas }: { reservas: Reserva[] }) {
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

    const [edit, setEdit] = useState([true, true, true, true, true, true, true])

    return (
        <table id="listagem" className="w-full mt-3 border border-zinc-200 rounded-lg grid">
            <thead className="table table-fixed w-full">
                <tr className="text-xs bg-slate-50 h-12">
                    <th className={`text-center ${edit[0] ? 'opacity-100' : 'opacity-30'}`}>Canal
                        <button className="ml-2 translate-y-1"
                            onClick={() => {
                                let field = edit
                                field = (field.map((e, i) => i === 0 ? !e : e))
                                setEdit(field)
                            }}>{edit[0] ? open : closed}</button>
                    </th>
                    <th className={`text-center ${edit[1] ? 'opacity-100' : 'opacity-30'}`}>Hóspede
                        <button className="ml-2 translate-y-1"
                            onClick={() => {
                                let field = edit
                                field = (field.map((e, i) => i === 1 ? !e : e))
                                setEdit(field)
                            }}>{edit[1] ? open : closed}</button>
                    </th>
                    <th className={`text-center ${edit[2] ? 'opacity-100' : 'opacity-30'}`}>Check-in
                        <button className="ml-2 translate-y-1"
                            onClick={() => {
                                let field = edit
                                field = (field.map((e, i) => i === 2 ? !e : e))
                                setEdit(field)
                            }}>{edit[2] ? open : closed}</button>
                    </th>
                    <th className={`text-center ${edit[3] ? 'opacity-100' : 'opacity-30'}`}>Check-out
                        <button className="ml-2 translate-y-1"
                            onClick={() => {
                                let field = edit
                                field = (field.map((e, i) => i === 3 ? !e : e))
                                setEdit(field)
                            }}>{edit[3] ? open : closed}</button>
                    </th>
                    <th className={`text-center ${edit[4] ? 'opacity-100' : 'opacity-30'}`}>Diárias
                        <button className="ml-2 translate-y-1"
                            onClick={() => {
                                let field = edit
                                field = (field.map((e, i) => i === 4 ? !e : e))
                                setEdit(field)
                            }}>{edit[4] ? open : closed}</button>
                    </th>
                    <th className={`text-center ${edit[5] ? 'opacity-100' : 'opacity-30'}`}>Valor Total
                        <button className="ml-2 translate-y-1"
                            onClick={() => {
                                let field = edit
                                field = (field.map((e, i) => i === 5 ? !e : e))
                                setEdit(field)
                            }}>{edit[5] ? open : closed}</button>
                    </th>
                    <th className={`text-center ${edit[6] ? 'opacity-100' : 'opacity-30'}`}>Valor Líquido
                        <button className="ml-2 translate-y-1"
                            onClick={() => {
                                let field = edit
                                field = (field.map((e, i) => i === 6 ? !e : e))
                                setEdit(field)
                            }}>{edit[6] ? open : closed}</button>
                    </th>
                </tr>
            </thead>
            <tbody className="block">
                {
                    reservas.length > 0 ?
                        reservas.map((e) =>
                            <tr className="text-xs bg-white h-12 border border-zinc-200 table table-fixed w-full">
                                <td className={`${edit[0] ? 'opacity-100' : 'opacity-30'} text-center text-xs font-medium text-white`}>
                                    {e.tipo_reserva != 'Indisponibilidade' && e.tipo_reserva != 'Continuidade' && e.tipo_reserva != 'Cancelamento' ?
                                        <div className="py-1 w-full rounded-md" style={{ backgroundColor: e.canal_reserva?.cor }}>{e.canal_reserva?.nome}</div> : null}
                                    {e.tipo_reserva == 'Continuidade' ?
                                        <div className="bg-[#30C46D] py-1 w-full rounded-md">Continuidade</div> : null}
                                    {e.tipo_reserva == 'Indisponibilidade' ?
                                        <div className="bg-[#353535] py-1 w-full rounded-md">Indisponibilidade</div> : null}
                                    {e.tipo_reserva == 'Cancelamento' ?
                                        <div className="bg-[#f67828] py-1 w-full rounded-md">Cancelamento</div> : null}
                                </td>
                                <td className={`${edit[1] ? 'opacity-100' : 'opacity-30'} text-center text-xs font-medium`}>{!(e.tipo_reserva == 'Indisponibilidade') && e.hospede?.nome}</td>
                                <td className={`${edit[2] ? 'opacity-100' : 'opacity-30'} text-center text-xs font-medium`}>{formatDate(e.check_in)}</td>
                                <td className={`${edit[3] ? 'opacity-100' : 'opacity-30'} text-center text-xs font-medium`}>{formatDate(e.check_out)}</td>
                                <td className={`${edit[4] ? 'opacity-100' : 'opacity-30'} text-center text-xs font-medium`}>{calcularDiasEntreDatas(e.check_in, e.check_out)}</td>
                                <td className={`${edit[5] ? 'opacity-100' : 'opacity-30'} text-center text-xs font-medium`}>{!(e.tipo_reserva == 'Indisponibilidade') && `${formatarMoedaBrasileira(Number(e.valor).toFixed(2))}`}</td>
                                <td className={`${edit[6] ? 'opacity-100' : 'opacity-30'} text-center text-xs font-medium`}>{!(e.tipo_reserva == 'Indisponibilidade') && `${Number(e.valor_liq_calculado)>0 ? formatarMoedaBrasileira(Number(e.valor_liq_calculado).toFixed(2)) : formatarMoedaBrasileira(Number(e.valor_liq).toFixed(2))}`}</td>
                            </tr>)
                        : null
                }
            </tbody>
        </table>
    )
}
