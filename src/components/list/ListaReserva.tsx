import * as XLSX from 'xlsx';
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
    valor_prop: number
    valor_gestor: number
    tipo_reserva: string
    obs: string | null
}

export default function ListaReserva({ reservas, ids, acomodacoes, canaisReserva }: { reservas: Reserva[], ids: { id: number, index: number }[], acomodacoes: { id: number, nome: string }[], canaisReserva: { id: number, nome: string }[] }) {

    const [download, setDownload] = useState(false)

    const date = new Date()
    const [evento, setEvento] = useState('all')
    const [acomodacao, setAcomodacao] = useState('all')
    const [compare, setCompare] = useState('all')
    const [order, setOrder] = useState('decrescente')
    const [canalReserva, setCanalReserva] = useState('all')
    const [periodo, setPeriodo] = useState('m-atual')
    const [deData, setDeData] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`)
    const [ateData, setAteData] = useState(`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`)

    function getDaysInMonth(month: number, year: number) {
        switch (month) {
            case 1: // Janeiro
            case 3: // Março
            case 5: // Maio
            case 7: // Julho
            case 8: // Agosto
            case 10: // Outubro
            case 12: // Dezembro
                return 31;
            case 4: // Abril
            case 6: // Junho
            case 9: // Setembro
            case 11: // Novembro
                return 30;
            case 2: // Fevereiro
                // Verifica se o ano é bissexto
                if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                    return 29;
                } else {
                    return 28;
                }
            default:
                return "Mês inválido";
        }
    }

    function formatarMoedaBrasileira(valorStr: string) {
        const valor = parseFloat(valorStr);
        if (isNaN(valor)) {
            return "Valor inválido";
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatDate(isoString: string) {
        const date = new Date(isoString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    function calcularDiasEntreDatas(dataInicio: string, dataFim: string): number {
        const inicio: Date = new Date(dataInicio);
        const fim: Date = new Date(dataFim);

        const diferencaMs: number = fim.getTime() - inicio.getTime();

        const diferencaDias: number = Math.round(diferencaMs / (1000 * 60 * 60 * 24));

        return diferencaDias == 0 ? 1 : diferencaDias;
    }

    function gerarEbaixarCSVReservas(
        reservas: any[],
        formatDate: (date: any) => string,
        calcularDias: (inicio: any, fim: any) => number,
        formatarMoeda: (valor: any) => string
    ) {
        const headers = [
            "Índice",
            "Acomodação",
            "Canal",
            "Hóspede",
            "Check-in",
            "Check-out",
            "Diárias",
            "Valor Total",
            "Valor Líquido"
        ];

        const linhas = [headers.join(",")];

        reservas.forEach((e, index) => {
            const isIndisp = e.tipo_reserva === "Indisponibilidade";
            const isCont = e.tipo_reserva === "Continuidade";

            const linha = [
                isIndisp ? "🚫" : index + 1,
                e.acomodacao?.nome || "",
                isIndisp
                    ? "Indisponibilidade"
                    : isCont
                        ? "Continuidade"
                        : e.canal_reserva?.nome || "",
                !isIndisp ? e.hospede?.nome || "" : "",
                formatDate(e.check_in),
                formatDate(e.check_out),
                calcularDias(e.check_in, e.check_out),
                !isIndisp ? formatarMoeda(e.valor) : "",
                !isIndisp ? formatarMoeda(e.valor_liq) : ""
            ];

            linhas.push(
                linha.map(valor => `"${String(valor).replace(/"/g, '""')}"`).join(",")
            );
        });

        const csvContent = "\uFEFF" + linhas.join("\n"); // BOM para Excel

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "reservas.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function gerarEbaixarExcelReservas(
        reservas: any[],
        formatDate: (date: any) => string,
        calcularDias: (inicio: any, fim: any) => number,
        formatarMoeda: (valor: any) => string
    ) {
        const dados = reservas.map((e, index) => {
            const isIndisp = e.tipo_reserva === 'Indisponibilidade';
            const isCont = e.tipo_reserva === 'Continuidade';

            return {
                'Índice': isIndisp ? '🚫' : index + 1,
                'Acomodação': e.acomodacao?.nome || '',
                'Canal': isIndisp
                    ? 'Indisponibilidade'
                    : isCont
                        ? 'Continuidade'
                        : e.canal_reserva?.nome || '',
                'Hóspede': !isIndisp ? e.hospede?.nome || '' : '',
                'Check-in': formatDate(e.check_in),
                'Check-out': formatDate(e.check_out),
                'Diárias': calcularDias(e.check_in, e.check_out),
                'Valor Total': !isIndisp ? formatarMoeda(e.valor) : '',
                'Valor Líquido': !isIndisp ? formatarMoeda(e.valor_liq) : ''
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');

        XLSX.writeFile(workbook, 'reservas.xlsx');
    }



    return (
        <section className="w-full min-h-56 border border-zinc-300 rounded-lg bg-white px-4 py-4">
            <div className="flex gap-4">
                <label htmlFor="canal" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Canal
                    <select name="canal" id="canal" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm" onChange={(e) => { setCanalReserva(e.target.value) }}>
                        <option value="all">Todos os canais</option>
                        {canaisReserva.length > 0 ?
                            canaisReserva.map(cr => <option value={cr.id}>{cr.nome}</option>) :
                            null}
                    </select>
                </label>
                <label htmlFor="tipo" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Tipo de Evento
                    <select name="tipo" id="tipo" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm" onChange={(e) => { setEvento(e.target.value) }}>
                        <option value="all">Todos os tipos</option>
                        <option value="reserva">Reserva</option>
                        <option value="continuidade">Continuidade</option>
                        <option value="indisponibilidade">Indisponibilidade</option>
                    </select>
                </label>
                <div className="flex flex-wrap gap-4">
                    <label htmlFor="periodo" className="flex flex-col text-zinc-600 font-medium text-xs">
                        Período de Análise
                        <select name="periodo" id="periodo" onChange={(e) => { setPeriodo(e.target.value) }} className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm">
                            <option value="m-atual" className="text-black">Mês Atual</option>
                            <option value="m-passado" className="text-black">Mês Passado</option>
                            <option value="a-atual" className="text-black">Ano Atual</option>
                            <option value="a-passado" className="text-black">Ano Passado</option>
                            <option value="personalizado" className="text-black">Personalizado</option>
                        </select>
                    </label>
                    {periodo == 'personalizado' ? <>
                        <label htmlFor="de" className="flex flex-col text-zinc-600 font-medium text-xs">
                            De:
                            <input type="date" name="de" id="de" onChange={(e) => { setDeData(e.target.value) }} className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm" />
                        </label>
                        <label htmlFor="ate" className="flex flex-col text-zinc-600 font-medium text-xs">
                            Até:
                            <input type="date" name="ate" id="ate" onChange={(e) => { setAteData(e.target.value) }} className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm" />
                        </label>
                    </> : null}
                </div>
            </div>
            <div className="flex gap-4 mt-3">
                <label htmlFor="acomodacao" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Acomodação
                    <select name="acomodacao" id="acomodacao" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm" onChange={(e) => { setAcomodacao(e.target.value) }}>
                        <option value="all">Todas</option>
                        {acomodacoes.length > 0 ?
                            acomodacoes.map(ac => <option value={ac.id}>{ac.nome}</option>) :
                            null}
                    </select>
                </label>
                <label htmlFor="order" className="flex flex-col text-zinc-600 font-medium text-xs">
                    Ordenar por:
                    <select name="order" id="order" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm" onChange={(e) => { setCompare(e.target.value) }}>
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
                    <select name="classificar" id="classificar" className="border border-zinc-300 rounded-md px-2 py-1 mt-2 outline-none text-sm" onChange={(e) => { setOrder(e.target.value) }}>
                        <option value="decrescente" className="text-black">Maior &#10140; Menor</option>
                        <option value="crescente" className="text-black">Menor &#10140; Maior</option>
                    </select>
                </label>
                <div style={{ width: '-webkit-fill-available' }}
                    className="group relative flex items-end justify-end gap-5">
                    {download && <section className='absolute flex gap-5 -top-7 -right-7'>
                        <div className="w-screen h-screen bg-black fixed top-0 right-0 bg-opacity-20" onClick={() => { setDownload(false) }}></div>
                        <button onClick={() => {
                            gerarEbaixarCSVReservas(reservas
                                .filter((e) => {
                                    if (periodo == 'm-atual') {
                                        return (new Date(e.check_in).getMonth() == date.getMonth() &&
                                            new Date(e.check_in).getFullYear() == date.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == date.getMonth() &&
                                                new Date(e.check_out).getFullYear() == date.getFullYear())
                                    }
                                    else if (periodo == 'm-passado') {
                                        const datames = date
                                        datames.setDate(date.getMonth() - 1)
                                        return (new Date(e.check_in).getMonth() == datames.getMonth() &&
                                            new Date(e.check_in).getFullYear() == datames.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == datames.getMonth() &&
                                                new Date(e.check_out).getFullYear() == datames.getFullYear())
                                    }
                                    else if (periodo == 'a-atual') {
                                        return new Date(e.check_in).getFullYear() == date.getFullYear() ||
                                            new Date(e.check_out).getFullYear() == date.getFullYear()
                                    }
                                    else if (periodo == 'a-passado') {
                                        return new Date(e.check_in).getFullYear() == (date.getFullYear() - 1) ||
                                            new Date(e.check_out).getFullYear() == (date.getFullYear() - 1)
                                    }
                                    else {
                                        return (new Date(e.check_in) >= new Date(deData) &&
                                            new Date(e.check_in) <= new Date(ateData)) &&
                                            (new Date(e.check_out) >= new Date(deData) &&
                                                new Date(e.check_out) <= new Date(ateData))
                                    }
                                })
                                .filter((e) => {
                                    if (evento == 'all')
                                        return e
                                    else return e.tipo_reserva.toLowerCase() == evento
                                })
                                .filter((e) => {
                                    if (acomodacao == 'all')
                                        return e
                                    else return e.acomodacao.id == Number(acomodacao)
                                })
                                .filter((e) => {
                                    if (canalReserva == 'all')
                                        return e
                                    else return e.canal_reserva?.id == Number(canalReserva)
                                })
                                .sort((a, b) => {
                                    if (compare == 'numero') {
                                        if (order == 'crescente') { return (a.id || 0) - (b.id || 0) }
                                        else { return (b.id || 0) - (a.id || 0) }
                                    }
                                    else if (compare == 'checkin') {
                                        if (order == 'crescente') { return Number(new Date(a.check_in)) - Number(new Date(b.check_in)) }
                                        else { return Number(new Date(b.check_in)) - Number(new Date(a.check_in)) }
                                    }
                                    else if (compare == 'checkout') {
                                        if (order == 'crescente') { return Number(new Date(a.check_out)) - Number(new Date(b.check_out)) }
                                        else { return Number(new Date(b.check_out)) - Number(new Date(a.check_out)) }
                                    }
                                    else if (compare == 'valor') {
                                        if (order == 'crescente') { return a.valor - b.valor }
                                        else { return b.valor - a.valor }
                                    }
                                    else if (compare == 'valor-liquido') {
                                        if (order == 'crescente') { return a.valor_liq - b.valor_liq }
                                        else { return b.valor_liq - a.valor_liq }
                                    }
                                    else return (a.id || 0) - (b.id || 0)
                                }), formatDate, calcularDiasEntreDatas, formatarMoedaBrasileira)
                            setDownload(false)
                        }}
                            className="bg-white w-10 h-8 flex justify-center items-center rounded-lg hover:text-green-600 hover:duration-300 justify-self-end border-2 border-green-600 z-10"
                        >
                            .csv
                        </button>
                        <button onClick={() => {
                            gerarEbaixarExcelReservas(reservas
                                .filter((e) => {
                                    if (periodo == 'm-atual') {
                                        return (new Date(e.check_in).getMonth() == date.getMonth() &&
                                            new Date(e.check_in).getFullYear() == date.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == date.getMonth() &&
                                                new Date(e.check_out).getFullYear() == date.getFullYear())
                                    }
                                    else if (periodo == 'm-passado') {
                                        const datames = date
                                        datames.setDate(date.getMonth() - 1)
                                        return (new Date(e.check_in).getMonth() == datames.getMonth() &&
                                            new Date(e.check_in).getFullYear() == datames.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == datames.getMonth() &&
                                                new Date(e.check_out).getFullYear() == datames.getFullYear())
                                    }
                                    else if (periodo == 'a-atual') {
                                        return new Date(e.check_in).getFullYear() == date.getFullYear() ||
                                            new Date(e.check_out).getFullYear() == date.getFullYear()
                                    }
                                    else if (periodo == 'a-passado') {
                                        return new Date(e.check_in).getFullYear() == (date.getFullYear() - 1) ||
                                            new Date(e.check_out).getFullYear() == (date.getFullYear() - 1)
                                    }
                                    else {
                                        return (new Date(e.check_in) >= new Date(deData) &&
                                            new Date(e.check_in) <= new Date(ateData)) &&
                                            (new Date(e.check_out) >= new Date(deData) &&
                                                new Date(e.check_out) <= new Date(ateData))
                                    }
                                })
                                .filter((e) => {
                                    if (evento == 'all')
                                        return e
                                    else return e.tipo_reserva.toLowerCase() == evento
                                })
                                .filter((e) => {
                                    if (acomodacao == 'all')
                                        return e
                                    else return e.acomodacao.id == Number(acomodacao)
                                })
                                .filter((e) => {
                                    if (canalReserva == 'all')
                                        return e
                                    else return e.canal_reserva?.id == Number(canalReserva)
                                })
                                .sort((a, b) => {
                                    if (compare == 'numero') {
                                        if (order == 'crescente') { return (a.id || 0) - (b.id || 0) }
                                        else { return (b.id || 0) - (a.id || 0) }
                                    }
                                    else if (compare == 'checkin') {
                                        if (order == 'crescente') { return Number(new Date(a.check_in)) - Number(new Date(b.check_in)) }
                                        else { return Number(new Date(b.check_in)) - Number(new Date(a.check_in)) }
                                    }
                                    else if (compare == 'checkout') {
                                        if (order == 'crescente') { return Number(new Date(a.check_out)) - Number(new Date(b.check_out)) }
                                        else { return Number(new Date(b.check_out)) - Number(new Date(a.check_out)) }
                                    }
                                    else if (compare == 'valor') {
                                        if (order == 'crescente') { return a.valor - b.valor }
                                        else { return b.valor - a.valor }
                                    }
                                    else if (compare == 'valor-liquido') {
                                        if (order == 'crescente') { return a.valor_liq - b.valor_liq }
                                        else { return b.valor_liq - a.valor_liq }
                                    }
                                    else return (a.id || 0) - (b.id || 0)
                                }), formatDate, calcularDiasEntreDatas, formatarMoedaBrasileira)
                            setDownload(false)
                        }}
                            className="bg-white w-10 h-8 flex justify-center items-center rounded-lg hover:text-green-600 hover:duration-300 justify-self-end border-2 border-green-600 z-10"
                        >
                            .xlsx
                        </button>
                    </section>}
                    <button onClick={() => { setDownload(true) }}
                        className="bg-white w-10 h-10 flex justify-center items-center rounded-lg hover:text-green-600 hover:translate-y-1 hover:duration-300 justify-self-end border-2 border-green-600"
                    >
                        <svg
                            className="w-6 h-6"
                            stroke="currentColor"
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
            <table id="listagem" className="w-full mt-3 border border-zinc-200 rounded-lg grid">
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
                        reservas.length > 0 ?
                            reservas
                                //periodo
                                .filter((e) => {
                                    if (periodo == 'm-atual') {
                                        return (new Date(e.check_in).getMonth() == date.getMonth() &&
                                            new Date(e.check_in).getFullYear() == date.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == date.getMonth() &&
                                                new Date(e.check_out).getFullYear() == date.getFullYear())
                                    }
                                    else if (periodo == 'm-passado') {
                                        const datames = date
                                        datames.setDate(date.getMonth() - 1)
                                        return (new Date(e.check_in).getMonth() == datames.getMonth() &&
                                            new Date(e.check_in).getFullYear() == datames.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == datames.getMonth() &&
                                                new Date(e.check_out).getFullYear() == datames.getFullYear())

                                    }
                                    else if (periodo == 'a-atual') {
                                        return new Date(e.check_in).getFullYear() == date.getFullYear() ||
                                            new Date(e.check_out).getFullYear() == date.getFullYear()

                                    }
                                    else if (periodo == 'a-passado') {
                                        return new Date(e.check_in).getFullYear() == (date.getFullYear() - 1) ||
                                            new Date(e.check_out).getFullYear() == (date.getFullYear() - 1)

                                    }
                                    else {
                                        return (new Date(e.check_in) >= new Date(deData) &&
                                            new Date(e.check_in) <= new Date(ateData)) &&
                                            (new Date(e.check_out) >= new Date(deData) &&
                                                new Date(e.check_out) <= new Date(ateData))
                                    }

                                })
                                //tipo de evento
                                .filter((e) => {
                                    if (evento == 'all')
                                        return e
                                    else return e.tipo_reserva.toLowerCase() == evento
                                })
                                //acomodacao
                                .filter((e) => {
                                    if (acomodacao == 'all')
                                        return e
                                    else return e.acomodacao.id == Number(acomodacao)
                                })
                                //canais de reserva
                                .filter((e) => {
                                    if (canalReserva == 'all')
                                        return e
                                    else return e.canal_reserva?.id == Number(canalReserva)
                                })
                                //ornedar
                                .sort((a, b) => {
                                    if (compare == 'numero') {
                                        if (order == 'crescente') { return (a.id || 0) - (b.id || 0) }
                                        else { return (b.id || 0) - (a.id || 0) }
                                    }
                                    else if (compare == 'checkin') {
                                        if (order == 'crescente') { return Number(new Date(a.check_in)) - Number(new Date(b.check_in)) }
                                        else { return Number(new Date(b.check_in)) - Number(new Date(a.check_in)) }
                                    }
                                    else if (compare == 'checkout') {
                                        if (order == 'crescente') { return Number(new Date(a.check_out)) - Number(new Date(b.check_out)) }
                                        else { return Number(new Date(b.check_out)) - Number(new Date(a.check_out)) }
                                    }
                                    else if (compare == 'valor') {
                                        if (order == 'crescente') { return a.valor - b.valor }
                                        else { return b.valor - a.valor }
                                    }
                                    else if (compare == 'valor-liquido') {
                                        if (order == 'crescente') { return a.valor_liq - b.valor_liq }
                                        else { return b.valor_liq - a.valor_liq }
                                    }
                                    else return (a.id || 0) - (b.id || 0)
                                })
                                .map((e) =>
                                    <tr className="text-xs bg-white h-12 border border-zinc-200 table table-fixed w-full">
                                        <td className="text-center text-xs font-medium">
                                            {e.tipo_reserva == 'Indisponibilidade' ?
                                                '🚫' :
                                                <span className="flex items-center justify-center gap-1">
                                                    {ids.filter(ids => ids.id == e.id).map(i => i.index)}
                                                    {e.tipo_reserva == 'Continuidade' ? <svg className="w-3 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 2.54 2.54" fill-rule="evenodd"><g><circle cx="1.27" cy="1.27" r="1.27" fill="#30c46d" opacity="1" data-original="#48b02c"></circle><g fill="#fff"><path d="M1.143 1.944V.674a.127.127 0 0 1 .254 0v1.27a.127.127 0 0 1-.254 0z" fill="#ffffff" opacity="1" data-original="#ffffff"></path><path d="M.635 1.182h1.27a.127.127 0 0 1 0 .254H.635a.127.127 0 0 1 0-.254z" fill="#ffffff" opacity="1" data-original="#ffffff" ></path></g></g></svg> : null}
                                                </span>
                                            }
                                        </td>
                                        <td className="text-center text-xs font-medium">{e.acomodacao.nome}</td>
                                        <td className="text-center text-xs font-medium text-white">
                                            {e.tipo_reserva != 'Indisponibilidade' && e.tipo_reserva != 'Continuidade' ?
                                                <div className="py-1 w-full rounded-md" style={{ backgroundColor: e.canal_reserva?.cor }}>{e.canal_reserva?.nome}</div> : null}
                                            {e.tipo_reserva == 'Continuidade' ?
                                                <div className="bg-[#30C46D] py-1 w-full rounded-md">Continuidade</div> : null}
                                            {e.tipo_reserva == 'Indisponibilidade' ?
                                                <div className="bg-[#353535] py-1 w-full rounded-md">Indisponibilidade</div> : null}
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
                <tfoot className="table table-fixed w-full">
                    <tr className="text-xs bg-slate-50 h-12">
                        <td className="text-center">Total de Reserva: {
                            reservas
                                //periodo
                                .filter((e) => {
                                    if (periodo == 'm-atual') {
                                        return (new Date(e.check_in).getMonth() == date.getMonth() &&
                                            new Date(e.check_in).getFullYear() == date.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == date.getMonth() &&
                                                new Date(e.check_out).getFullYear() == date.getFullYear())
                                    }
                                    else if (periodo == 'm-passado') {
                                        const datames = date
                                        datames.setDate(date.getMonth() - 1)
                                        return (new Date(e.check_in).getMonth() == datames.getMonth() &&
                                            new Date(e.check_in).getFullYear() == datames.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == datames.getMonth() &&
                                                new Date(e.check_out).getFullYear() == datames.getFullYear())

                                    }
                                    else if (periodo == 'a-atual') {
                                        return new Date(e.check_in).getFullYear() == date.getFullYear() ||
                                            new Date(e.check_out).getFullYear() == date.getFullYear()

                                    }
                                    else if (periodo == 'a-passado') {
                                        return new Date(e.check_in).getFullYear() == (date.getFullYear() - 1) ||
                                            new Date(e.check_out).getFullYear() == (date.getFullYear() - 1)

                                    }
                                    else {
                                        return (new Date(e.check_in) >= new Date(deData) &&
                                            new Date(e.check_in) <= new Date(ateData)) &&
                                            (new Date(e.check_out) >= new Date(deData) &&
                                                new Date(e.check_out) <= new Date(ateData))
                                    }

                                })
                                //tipo de evento
                                .filter((e) => {
                                    if (evento == 'all')
                                        return e
                                    else return e.tipo_reserva.toLowerCase() == evento
                                })
                                //acomodacao
                                .filter((e) => {
                                    if (acomodacao == 'all')
                                        return e
                                    else return e.acomodacao.id == Number(acomodacao)
                                })
                                //canais de reserva
                                .filter((e) => {
                                    if (canalReserva == 'all')
                                        return e
                                    else return e.canal_reserva?.id == Number(canalReserva)
                                }).filter(e => e.tipo_reserva != 'Indisponibilidade').length
                        }</td>
                        <td className="text-center">Total Bruto: {
                            formatarMoedaBrasileira((reservas
                                //periodo
                                .filter((e) => {
                                    if (periodo == 'm-atual') {
                                        return (new Date(e.check_in).getMonth() == date.getMonth() &&
                                            new Date(e.check_in).getFullYear() == date.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == date.getMonth() &&
                                                new Date(e.check_out).getFullYear() == date.getFullYear())
                                    }
                                    else if (periodo == 'm-passado') {
                                        const datames = date
                                        datames.setDate(date.getMonth() - 1)
                                        return (new Date(e.check_in).getMonth() == datames.getMonth() &&
                                            new Date(e.check_in).getFullYear() == datames.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == datames.getMonth() &&
                                                new Date(e.check_out).getFullYear() == datames.getFullYear())

                                    }
                                    else if (periodo == 'a-atual') {
                                        return new Date(e.check_in).getFullYear() == date.getFullYear() ||
                                            new Date(e.check_out).getFullYear() == date.getFullYear()

                                    }
                                    else if (periodo == 'a-passado') {
                                        return new Date(e.check_in).getFullYear() == (date.getFullYear() - 1) ||
                                            new Date(e.check_out).getFullYear() == (date.getFullYear() - 1)

                                    }
                                    else {
                                        return (new Date(e.check_in) >= new Date(deData) &&
                                            new Date(e.check_in) <= new Date(ateData)) &&
                                            (new Date(e.check_out) >= new Date(deData) &&
                                                new Date(e.check_out) <= new Date(ateData))
                                    }

                                })
                                //tipo de evento
                                .filter((e) => {
                                    if (evento == 'all')
                                        return e
                                    else return e.tipo_reserva.toLowerCase() == evento
                                })
                                //acomodacao
                                .filter((e) => {
                                    if (acomodacao == 'all')
                                        return e
                                    else return e.acomodacao.id == Number(acomodacao)
                                })
                                //canais de reserva
                                .filter((e) => {
                                    if (canalReserva == 'all')
                                        return e
                                    else return e.canal_reserva?.id == Number(canalReserva)
                                })
                                .map(r => Number(r.valor))
                                .reduce((sum, valor) => sum + valor, 0)).toFixed(2))
                        }</td>
                        <td className="text-center">Total Líquido: {
                            formatarMoedaBrasileira((reservas
                                //periodo
                                .filter((e) => {
                                    if (periodo == 'm-atual') {
                                        return (new Date(e.check_in).getMonth() == date.getMonth() &&
                                            new Date(e.check_in).getFullYear() == date.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == date.getMonth() &&
                                                new Date(e.check_out).getFullYear() == date.getFullYear())
                                    }
                                    else if (periodo == 'm-passado') {
                                        const datames = date
                                        datames.setDate(date.getMonth() - 1)
                                        return (new Date(e.check_in).getMonth() == datames.getMonth() &&
                                            new Date(e.check_in).getFullYear() == datames.getFullYear()) ||
                                            (new Date(e.check_out).getMonth() == datames.getMonth() &&
                                                new Date(e.check_out).getFullYear() == datames.getFullYear())

                                    }
                                    else if (periodo == 'a-atual') {
                                        return new Date(e.check_in).getFullYear() == date.getFullYear() ||
                                            new Date(e.check_out).getFullYear() == date.getFullYear()

                                    }
                                    else if (periodo == 'a-passado') {
                                        return new Date(e.check_in).getFullYear() == (date.getFullYear() - 1) ||
                                            new Date(e.check_out).getFullYear() == (date.getFullYear() - 1)

                                    }
                                    else {
                                        return (new Date(e.check_in) >= new Date(deData) &&
                                            new Date(e.check_in) <= new Date(ateData)) &&
                                            (new Date(e.check_out) >= new Date(deData) &&
                                                new Date(e.check_out) <= new Date(ateData))
                                    }

                                })
                                //tipo de evento
                                .filter((e) => {
                                    if (evento == 'all')
                                        return e
                                    else return e.tipo_reserva.toLowerCase() == evento
                                })
                                //acomodacao
                                .filter((e) => {
                                    if (acomodacao == 'all')
                                        return e
                                    else return e.acomodacao.id == Number(acomodacao)
                                })
                                //canais de reserva
                                .filter((e) => {
                                    if (canalReserva == 'all')
                                        return e
                                    else return e.canal_reserva?.id == Number(canalReserva)
                                })
                                .map(r => Number(r.valor_liq))
                                .reduce((sum, valor) => sum + valor, 0)).toFixed(2))
                        }</td>
                    </tr>
                </tfoot>
            </table>
        </section>
    )
}
