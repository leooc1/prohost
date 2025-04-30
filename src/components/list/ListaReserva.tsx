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
                    }}
                        className="bg-white w-10 h-10 flex justify-center items-center rounded-lg hover:text-green-600 hover:translate-y-1 hover:duration-300 justify-self-end"
                    >
                        <svg className="w-10 h-10" fill="#16a34a" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 585.918 585.918"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M357.396,535.325c0.776,0.052,1.542,0.114,2.329,0.114h177.39c20.75,0,37.627-16.883,37.627-37.627V86.597 c0-20.743-16.877-37.628-37.627-37.628h-177.39c-0.781,0-1.553,0.07-2.329,0.118V0L11.176,46.206v492.311l346.22,47.401V535.325z M357.396,361.212h57.407v21.511h-57.407V361.212z M357.396,358.524v-21.905h57.407v21.905H357.396z M357.396,333.931v-25.13 h57.407v25.13H357.396z M357.396,306.113v-28.131h57.407v28.131H357.396z M357.396,275.688V248.89h57.407v26.798H357.396z M357.396,246.591v-26.798h56.262h1.146v26.798H357.396z M359.726,70.476h177.39c8.893,0,16.125,7.236,16.125,16.126v411.22 c0,8.888-7.232,16.127-16.125,16.127h-177.39c-0.792,0-1.563-0.121-2.329-0.243V385.018h59.706v-0.005h130.669V214.811h-0.117 v-26.409h-65.848h-2.299h-65.85v0.005h-56.262V70.711C358.162,70.594,358.929,70.476,359.726,70.476z M545.083,219.788v162.532 h-25.092V227.635h-17.228v154.684H488.41V243.525h-17.228v138.794h-12.642V259.223h-17.229v123.096h-24.21V277.977v-2.294v-26.798 v-2.299v-26.798h62.4h2.304H545.083z M481.807,217.499v-26.796h63.55v24.108h-0.273v2.688H481.807z M479.508,217.499h-62.405 h-1.144v-26.796h63.544v26.796H479.508z M98.663,321.536c7.126,0.127,15.097-1.407,19.812-3.327l3.614,19.927 c-4.399,2.226-14.268,4.462-26.974,4.121c-35.293-0.94-53.019-24.741-53.019-55.626c0-36.998,24.302-58.227,55.329-59.043 c12.263-0.329,21.67,2.097,25.933,4.328l-4.882,20.282c-4.869-2.092-11.588-3.969-19.969-3.827 c-18.528,0.309-32.715,12.422-32.715,36.824C65.791,307.152,77.843,321.186,98.663,321.536z M164.763,344.119 c-12.567-0.341-24.829-4.03-30.909-7.711l4.956-21.087c6.595,3.634,16.809,7.36,27.425,7.537 c11.556,0.2,17.722-4.683,17.722-12.225c0-7.219-5.321-11.366-18.707-16.394c-18.228-6.667-29.961-17.096-29.961-33.555 c0-19.32,15.455-34.518,41.512-35.2c12.683-0.339,22.111,2.179,28.903,5.134l-5.771,21.399c-4.569-2.176-12.633-5.315-23.625-5.134 c-10.884,0.178-16.125,5.364-16.125,11.31c0,7.307,6.212,10.482,20.609,16.042c19.99,7.52,29.523,18.271,29.523,34.784 C210.307,328.654,195.525,344.938,164.763,344.119z M288.053,345.61l-32.086-0.829l-37.772-118.466l29.103-0.748l14.551,50.26 c4.128,14.224,7.895,27.957,10.772,42.97l0.548,0.01c3.063-14.436,6.874-28.725,11.058-42.528l15.772-52.055l30.277-0.769 L288.053,345.61z"></path> </g> </g></svg>
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
                    }}
                        className="bg-white w-10 h-10 flex justify-center items-center rounded-lg hover:text-green-600 hover:translate-y-1 hover:duration-300 justify-self-end"
                    >
                        <svg className="w-10 h-10" fill="#16a34a" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 588.601 588.6"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M359.031,537.786c0.781,0.053,1.551,0.115,2.342,0.115h178.2c20.841,0,37.8-16.964,37.8-37.8V86.999 c0-20.838-16.959-37.8-37.8-37.8h-178.2c-0.791,0-1.561,0.076-2.342,0.124V0L11.228,46.417v494.564L359.031,588.6V537.786z M361.373,70.804h178.2c8.933,0,16.2,7.269,16.2,16.2v413.097c0,8.934-7.268,16.2-16.2,16.2h-178.2 c-0.802,0-1.571-0.11-2.342-0.232v-118.82h179.729V229.851H359.031V71.046C359.802,70.928,360.571,70.804,361.373,70.804z M443.818,356.749v35.1h-84.154v-35.1H443.818z M359.664,310.848V275.75h84.154v35.098H359.664z M533.361,275.75v35.098h-84.144 V275.75H533.361z M449.218,270.351V235.25h84.144v35.101H449.218z M533.361,356.749v35.1h-84.144v-35.1H533.361z M77.688,339.167 l-7.159-16.168c-2.906-6.181-4.77-10.758-6.961-15.853l-0.232-0.005c-1.616,5.01-3.57,9.486-5.967,15.467l-6.373,15.436 l-19.375-0.817l21.756-42.837l-20.994-42.124l19.514-0.545l6.719,15.66c2.294,5.255,4.023,9.5,5.875,14.401h0.221 c1.859-5.576,3.365-9.481,5.342-14.573l6.684-16.179l20.849-0.577l-22.734,43.563l23.955,46.032L77.688,339.167z M163.284,342.774 l-54.388-2.289v-90.337l19.251-0.54v74.271l35.137,1.019V342.774z M198.492,345.684c-10.832-0.464-21.347-3.744-26.552-6.908 l4.24-17.598c5.647,3.117,14.423,6.355,23.588,6.64c10.017,0.301,15.356-3.739,15.356-10.136c0-6.085-4.628-9.635-16.206-13.975 c-15.709-5.732-25.758-14.528-25.758-28.326c0-16.176,13.242-28.938,35.754-29.592c11.017-0.316,19.256,1.788,25.187,4.271 l-5.05,18.151c-3.986-1.849-11.021-4.522-20.574-4.369c-9.424,0.145-13.948,4.509-13.948,9.514c0,6.141,5.374,8.846,17.843,13.587 c17.418,6.46,25.769,15.636,25.769,29.646C238.151,333.25,225.224,346.839,198.492,345.684z M310.311,348.964l-10.035-19.195 c-4.063-7.33-6.661-12.751-9.73-18.789h-0.322c-2.251,5.911-4.986,11.185-8.34,18.246l-8.864,18.156l-26.892-1.128l30.201-50.352 l-29.138-49.599l27.092-0.752l9.368,18.457c3.204,6.199,5.605,11.211,8.192,17.004h0.324c2.587-6.597,4.693-11.219,7.465-17.247 l9.354-19.175l29.331-0.817l-31.957,51.706l33.677,54.729L310.311,348.964z"></path> </g> </g></svg>
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
