const open = <svg id='eye-open' className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path></svg>
const closed = <svg id='eye-closed' className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path></svg>

import html2canvas from "html2canvas"
import PptxGenJS from "pptxgenjs"
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import CalendarioR from '../report/CalendarioR'
import ComparativoResultados from '../report/ComparativoFaturamentoMensal'
import DespesasR from '../report/DespesasR'
import HistoricoFaturamento from '../report/HistoricoFaturamento'
import ListaReservaR from './ListaReservaR'
import ph from '/prohost-logo.png'
interface propsRelatorio {
    saas: number,
    acomodacao: number,
    mes: number,
    ano: number,
    imagem?: string,
    cores: { primario: string, secundario: string, letra: string },
    onReady?: () => void,
}

export default function RelatorioCompleto(props: propsRelatorio) {
    const chart = <svg className='w-10 h-fit' xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 512"><g><path fill-rule="evenodd" d="M411.867 151.37h68.62V439.5h-68.62zM72.5 439.499h68.62V329.594H72.5zm113.123 0h68.62V227.278h-68.62zm113.122 0h68.62V267.836h-68.62zM498.5 485.998c0-6.907-5.592-12.498-12.504-12.498H38.497V26.001c0-6.906-5.592-12.503-12.498-12.503s-12.498 5.597-12.498 12.503v459.997c0 6.901 5.597 12.503 12.498 12.503h459.997c6.912 0 12.504-5.602 12.504-12.503zM94.356 269.903l146.704-146.71 60.257 76.15a12.507 12.507 0 0 0 9.071 4.726 12.544 12.544 0 0 0 9.573-3.643L445.286 75.102l-1.927 13.47c-.982 6.833 3.77 13.164 10.597 14.14 6.833.982 13.174-3.77 14.151-10.603l7.229-50.605a12.477 12.477 0 0 0-3.337-10.412 12.51 12.51 0 0 0-10.259-3.796l-52.49 5.196c-6.869.681-11.891 6.801-11.21 13.67s6.801 11.875 13.67 11.204l17.699-1.748L312.21 172.821l-60.262-76.156a12.475 12.475 0 0 0-9.071-4.72 12.518 12.518 0 0 0-9.567 3.638L76.678 252.219c-4.879 4.884-4.879 12.794 0 17.683 2.439 2.439 5.639 3.659 8.839 3.659s6.394-1.22 8.839-3.659z" fill={props.cores.secundario} opacity="1" data-original="#000000" className=""></path></g></svg>

    const dash = <svg className='w-32 h-fit' xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 512"><g><path fill-rule="evenodd" d="M411.867 151.37h68.62V439.5h-68.62zM72.5 439.499h68.62V329.594H72.5zm113.123 0h68.62V227.278h-68.62zm113.122 0h68.62V267.836h-68.62zM498.5 485.998c0-6.907-5.592-12.498-12.504-12.498H38.497V26.001c0-6.906-5.592-12.503-12.498-12.503s-12.498 5.597-12.498 12.503v459.997c0 6.901 5.597 12.503 12.498 12.503h459.997c6.912 0 12.504-5.602 12.504-12.503zM94.356 269.903l146.704-146.71 60.257 76.15a12.507 12.507 0 0 0 9.071 4.726 12.544 12.544 0 0 0 9.573-3.643L445.286 75.102l-1.927 13.47c-.982 6.833 3.77 13.164 10.597 14.14 6.833.982 13.174-3.77 14.151-10.603l7.229-50.605a12.477 12.477 0 0 0-3.337-10.412 12.51 12.51 0 0 0-10.259-3.796l-52.49 5.196c-6.869.681-11.891 6.801-11.21 13.67s6.801 11.875 13.67 11.204l17.699-1.748L312.21 172.821l-60.262-76.156a12.475 12.475 0 0 0-9.071-4.72 12.518 12.518 0 0 0-9.567 3.638L76.678 252.219c-4.879 4.884-4.879 12.794 0 17.683 2.439 2.439 5.639 3.659 8.839 3.659s6.394-1.22 8.839-3.659z" fill={props.cores.secundario} opacity="1" data-original="#000000" className=""></path></g></svg>

    const blue_print = <svg className='w-32 h-fit' xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512 512"><g><path d="M486.887 129.919h-92.08l59.755-59.755c7.448-7.444 7.452-19.597 0-27.044l-26.38-26.382c-7.458-7.455-19.587-7.455-27.044 0L287.957 129.919H118.322V63.718a7.258 7.258 0 0 0-7.259-7.259H59.572c-28.748 0-52.798 23.253-52.798 52.796v179.396c0 4.01 3.249 7.259 7.259 7.259s7.259-3.249 7.259-7.259V109.254c0-21.502 17.527-38.278 38.28-38.278h44.232v324.236H59.572c-14.897 0-28.699 6.308-38.28 16.425v-85.773c0-4.01-3.249-7.259-7.259-7.259s-7.259 3.249-7.259 7.259v122.144c0 29.14 23.684 52.845 52.798 52.845h427.316c10.111 0 18.339-8.228 18.339-18.341V148.26c-.001-10.114-8.228-18.341-18.34-18.341zM328.99 200.061v40.215h-45.877v-19.542l22.094-3.244c2.633-.386 4.404-2.503 4.889-2.859l14.57-14.57zm45.635 147.165h-38.377a7.258 7.258 0 0 0-7.259 7.259v42.441H183.712v-44.617h54.395a7.258 7.258 0 0 0 7.259-7.259v-43.072h54.237a7.258 7.258 0 0 0 7.259-7.259v-39.925h108.63v142.132h-71.985v-35.182h31.118c4.01 0 7.259-3.249 7.259-7.259s-3.249-7.259-7.259-7.259zm-112.46-138.089 4.117-28.05 23.606 23.604c.186.092.366.2.551.293zm-13.731 13.731a7.249 7.249 0 0 0 6.186 2.049l13.975-2.052v17.411h-45.877v-40.215h26.107l-2.439 16.621a7.247 7.247 0 0 0 2.048 6.186zm43.911 31.926v32.666h-54.237a7.258 7.258 0 0 0-7.259 7.259v43.072h-47.136v-82.997zm12.617-55.561-32.895-32.893 113.78-113.782 32.895 32.897zM444.297 59.899l-15.291 15.288-32.895-32.895 15.291-15.291c1.742-1.742 4.773-1.737 6.512 0l26.382 26.382a4.613 4.613 0 0 1 .001 6.516zm46.411 422.614a3.826 3.826 0 0 1-3.821 3.823H59.572c-21.108 0-38.28-17.193-38.28-38.327 0-21.502 17.527-38.278 38.28-38.278h51.491a7.258 7.258 0 0 0 7.259-7.259V144.437h155.117l-16.77 16.77c-.335.486-2.433 1.955-2.859 4.889l-2.854 19.447h-35.497a7.258 7.258 0 0 0-7.259 7.259v47.474h-31.746a7.258 7.258 0 0 0-7.259 7.259v156.65a7.258 7.258 0 0 0 7.259 7.259h246.299a7.258 7.258 0 0 0 7.259-7.259v-156.65a7.258 7.258 0 0 0-7.259-7.259h-79.244v-47.474c0-3.137-2-5.783-4.785-6.798l41.567-41.567h106.598a3.826 3.826 0 0 1 3.821 3.823v334.253z" fill={props.cores.secundario} opacity="1" data-original="#000000" className=""></path></g></svg>
    const apiURL = import.meta.env.VITE_API_URL
    const [editPages, setEditPages] = useState([true, true, true, true, true, true, true])
    const [edit, setEdit] = useState([true, true, true, true, true, true, true, true])
    const [editCalendar, setEditCalendar] = useState([true, true, true, true])
    function diasDoMes(month: number, year: number) {
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
                return 0;
        }
    }
    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];
    const pdfRef = useRef(null);

    const secoes = [
        "relatorio",
        "agenda",
        "calendario",
        "detalhamento-reservas",
        "desempenho-imovel",
        "comparativo-faturamento",
        "detalhamento-despesas",
        "resultado-acomodacao",
        "final",
    ];

    const handlePrint = useReactToPrint({
        contentRef: pdfRef,
        documentTitle: "relatorio.pdf",

        // Lógica para restaurar o DOM após a impressão (ou cancelamento)
        onAfterPrint: () => {
            // const relatorio_container = document.querySelector('#relatorio-container')
            // relatorio_container?.classList.remove('w-main')
            const button_report = document.querySelectorAll('.button-report')
            button_report.forEach(e => e.classList.remove('hidden'))
            const elements = document.querySelectorAll('.opacity-30');
            elements.forEach(e => e.classList.remove('hidden'));
            const olhos = document.querySelectorAll('svg#eye-open');
            olhos.forEach(e => e.classList.remove('hidden'));
        },

        // Ajustes de estilo opcionais. Para PDF, 'landscape' é geralmente melhor.
        pageStyle: `@page { size: A4 landscape; margin: 0px; }
        
        @media print {
        body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        .no-print {
            display: none !important;
        }

        .force-print {
            display: block !important;
        }
    }`
    });

    async function clearRelatorio(type: string) {
        if (type === 'pptx') {
            for (const id of secoes) {
                const elemento = document.getElementById(id);
                // Aplica a classe apenas para PPTX
                elemento?.classList.add('w-[calc(177.77vh)]');
            }
            const elements = document.querySelectorAll('.opacity-30');
            elements.forEach(e => e.classList.add('hidden'));
            const olhos = document.querySelectorAll('svg#eye-open');
            olhos.forEach(e => e.classList.add('hidden'));
            document.body.classList.add('cursor-wait');
            await gerarPPT();
        }

        // Lógica para PDF (usando o novo handler)
        if (type === 'pdf') {
            // const relatorio_container = document.querySelector('#relatorio-container')
            // relatorio_container?.classList.add('w-main')
            const button_report = document.querySelectorAll('.button-report')
            button_report.forEach(e => e.classList.add('hidden'))
            const elements = document.querySelectorAll('.opacity-30')
            elements.forEach(e => e.classList.add('hidden'))
            const olhos = document.querySelectorAll('svg#eye-open')
            olhos.forEach(e => e.classList.add('hidden'))

            await handlePrint();
        }
    }
    async function gerarPPT() {
        const pptx = new PptxGenJS();

        for (const id of secoes) {
            const elemento = document.getElementById(id);
            if (!elemento || elemento.classList.contains('hidden')) continue;

            // Captura a div como imagem
            const canvas = await html2canvas(elemento);
            const imgData = canvas.toDataURL("image/png");

            // Adiciona slide e insere imagem
            const slide = pptx.addSlide();
            slide.addImage({
                data: imgData,
                x: 0,
                y: 0,
                // w: 10, // largura do slide (em polegadas)
                // h: 5.6, // altura do slide
                w: '100%', // largura do slide (em porcentagem)
                h: '100%', // altura do slide
            });
        }

        // Faz o download do arquivo
        pptx.writeFile({ fileName: "relatorio.pptx" }).then(() => {
            for (const id of secoes) {
                const elemento = document.getElementById(id)
                elemento?.classList.remove('w-[calc(177.77vh)]')
            }
            const elements = document.querySelectorAll('.opacity-30')
            elements.forEach(e => e.classList.remove('hidden'))
            const olhos = document.querySelectorAll('svg#eye-open')
            olhos.forEach(e => e.classList.remove('hidden'))
            document.body.classList.remove('cursor-wait')
        })

    }


    const [loaded, setLoaded] = useState<boolean>(false)
    const [nome, setNome] = useState<string>('')
    const [acIMG, setAcIMG] = useState<string>('')
    const [valorImovel, setValorImovel] = useState<string>('')
    const [dadosReserva, setDadosReserva] = useState({ ocupacao_do_imovel: 0, novas_reservas: 0, faturamento: 0 })
    const [resultadoAcomodacoes, setResultadoAcomodacoes] = useState<{
        comissao_plataforma: string
        despesas: string
        diaria_media: string
        faturamento_bruto: string
        faturamento_liquido: string
        lucro: string
        periodo: string
        taxa_limpeza: string
        rentabilidade_imovel: string | number
        comissao_reservas: string | number
        comissao_taxa_limpeza: string | number
        repasse: string | number
    }[]>([])
    const [despesas, setDespesas] = useState<any[]>([])
    const [reservas, setReservas] = useState<any[]>([])
    const [historicoFaturamento, setHistoricoFaturamento] = useState<{
        faturamento_periodo: number,
        rentabilidade_imovel: number,
        faturamento_despesa: any[]
    }>({ faturamento_periodo: 0, rentabilidade_imovel: 0, faturamento_despesa: [] })
    const [listaReservas, setListaReservas] = useState<any[]>([])

    async function getJson<T>(url: string, fallback: T): Promise<T> {
        try {
            const response = await fetch(url, { method: 'GET' })
            if (!response.ok) {
                console.log(`Erro ${response.status} em ${url}`)
                return fallback
            }
            return await response.json()
        } catch (err) {
            console.log(err)
            return fallback
        }
    }


    async function getData() {
        const dataInicio = `${props.ano}-${('0' + props.mes).slice(-2)}-01`
        const dataFim = `${props.ano}-${('0' + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`
        const resultadoPadrao = {
            comissao_plataforma: "0",
            despesas: "0",
            diaria_media: "0",
            faturamento_bruto: "0",
            faturamento_liquido: "0",
            lucro: "0",
            taxa_limpeza: "0",
            rentabilidade_imovel: 0,
            comissao_reservas: 0,
            comissao_taxa_limpeza: 0,
            repasse: 0,
            periodo: 'atual'
        }

        {
            const bySaas = await getJson<any>(`${apiURL}/acomodacao/${props.saas}/${props.acomodacao}`, null)
            let acomodacaoData = Array.isArray(bySaas) ? bySaas[0] : bySaas
            if (!acomodacaoData) {
                const byId = await getJson<any>(`${apiURL}/acomodacao/${props.acomodacao}`, null)
                acomodacaoData = Array.isArray(byId) ? byId[0] : byId
            }

            if (acomodacaoData) {
                setValorImovel(acomodacaoData.valor_imovel || '0')
                setAcIMG(acomodacaoData.foto || '')
                setNome(acomodacaoData.nome || '')
            }
        }
        {
            const data = await getJson<any[]>(`${apiURL}/movimentacao/${props.saas}/ocupacao-semana/${dataInicio}/${dataFim}/${props.acomodacao}`, [])
            if (Array.isArray(data) && data.length > 0) {
                setDadosReserva(dados => ({
                    ...dados,
                    ocupacao_do_imovel: data.map((d: any) => {
                        const totalDias = Number(d.total_dias_no_intervalo);
                        const disponiveis = totalDias - Number(d.total_indisponibilidades);
                        const taxa = disponiveis > 0 ? (Number(d.total_movimentacoes) / disponiveis) * 100 : 0;
                        return [d.dia_da_semana, taxa];
                    }).map((d) => d[1])
                        .reduce((a: any, b: any) => a + b, 0) / 7
                }))
            }
        }
        {
            const data = await getJson<any[]>(`${apiURL}/reserva/${props.saas}/ind-ope/${dataInicio}/${dataFim}/${props.acomodacao}`, [])
            if (Array.isArray(data) && data.length > 0 && data[0].total_reserva) {
                setDadosReserva(dados => ({
                    ...dados,
                    novas_reservas: Number(data[0].total_reserva)
                }))
            }
        }
        {
            const data = await getJson<any>(`${apiURL}/movimentacao/${props.saas}/result-ac/${dataInicio}/${dataFim}/${props.acomodacao}`, [])
            if (Array.isArray(data) && data.length > 0) {
                setDadosReserva(dados => ({
                    ...dados, faturamento: data[0].faturamento_liquido,
                }))
                setHistoricoFaturamento(dados => ({
                    ...dados, rentabilidade_imovel: data[0].rentabilidade_imovel,
                }))
            }
        }
        {
            const data = await getJson<any[]>(`${apiURL}/movimentacao/${props.saas}/fat-bar/${dataFim}/${props.acomodacao}`, [])
            if (Array.isArray(data)) {
                setHistoricoFaturamento(dados => ({
                    ...dados,
                    faturamento_periodo: data.slice(-12).reduce((total, item) => {
                        return total + parseFloat((item.faturamento_liquido) || 0);
                    }, 0),
                    faturamento_despesa: data
                }))
            }
        }
        {
            const data = await getJson<any[]>(`${apiURL}/movimentacao/${props.saas}/relatorio/${props.acomodacao}/${dataInicio}/${dataFim}`, [])
            setDespesas(Array.isArray(data) ? data : [])
        }
        {
            const data = await getJson<any[]>(`${apiURL}/reserva/ac/${props.acomodacao}/${props.mes}/${props.ano}`, [])
            if (Array.isArray(data)) {
                setListaReservas(data)
                setReservas(data.map((item: any, index: any) => ({
                        title: item.hospede ? item.hospede.nome : 'Indisponibilidade',
                        start: item.check_in.slice(0, 19).replace('T', ' '),
                        end: item.check_out.slice(0, 19).replace('T', ' '),
                        hospedes: item.qtd_hospede,
                        color: item.tipo_reserva == 'Continuidade' ? '#30C46D'
                            : item.tipo_reserva == 'Indisponibilidade' ? '#353535'
                                : item.canal_reserva?.cor || '',
                        canal_reserva: item.canal_reserva?.nome,
                        id: String(index + 1),
                        tipo: item.tipo_reserva,
                        obs: item.obs,
                        bruto: parseFloat(item.valor),
                        liquido: parseFloat(item.valor_liq),
                        comissao: parseFloat(item.comissao_ota)
                    })))
            } else {
                setListaReservas([])
                setReservas([])
            }
        }
        {
            const data = await getJson<any>(`${apiURL}/movimentacao/${props.saas}/comparativo-result-ac/${dataInicio}/${dataFim}/${props.acomodacao}`, [])
            if (!Array.isArray(data) || data.length == 0) {
                setResultadoAcomodacoes([resultadoPadrao])
            } else {
                const atual = data
                    .filter((d: any) => d.periodo === 'atual')
                    .map((d: any) => ({
                        comissao_plataforma: d.comissao_plataforma ?? '0',
                        despesas: d.despesas ?? '0',
                        diaria_media: d.diaria_media ?? '0',
                        faturamento_bruto: d.faturamento_bruto ?? '0',
                        faturamento_liquido: d.faturamento_liquido ?? '0',
                        lucro: d.lucro ?? '0',
                        taxa_limpeza: d.taxa_limpeza ?? '0',
                        rentabilidade_imovel: d.rentabilidade_imovel ?? 0,
                        comissao_reservas: d.comissao_reservas ?? 0,
                        comissao_taxa_limpeza: d.comissao_taxa_limpeza ?? 0,
                        repasse: d.repasse ?? 0,
                        periodo: d.periodo ?? 'atual',
                    }))
                setResultadoAcomodacoes(atual.length > 0 ? atual : [resultadoPadrao])
            }
        }
        setLoaded(true)
    }

    useEffect(() => {

        setLoaded(false)
        getData().finally(() => {
            props.onReady?.()
        })
    }, [props.saas, props.acomodacao, props.mes, props.ano])

    return (
        <>
            <div className='flex justify-center gap-10 absolute top-2 left-1/2 -translate-x-1/2'>
                {/* <button onClick={() => location.assign('/relatorio')} className='w-fit py-1 px-2 bg-blue-300'>
                    Seleção de relatório
                </button> */}
                <button onClick={() => clearRelatorio('pptx')} className='w-fit py-1 px-2 bg-orange-300'>
                    Baixar como PPTX
                </button>
                <button onClick={() => clearRelatorio('pdf')} className='w-fit py-1 px-2 bg-red-300'>
                    Baixar como PDF
                </button>
            </div>
            {loaded &&
                <div id='relatorio-container' className="flex flex-col relative gap-1" ref={pdfRef} >
                    {/* RELATORIO */}
                    <section style={{ backgroundColor: props.cores.primario }} id='relatorio' className={`flex flex-col justify-between p-10 h-screen relative bg-[${props.cores.primario}]`}>
                        <div onClick={() => {
                            const logos = document.querySelectorAll('.logo-ph')
                            if (logos[0].classList.contains('opacity-30'))
                                logos.forEach(l => {
                                    l.classList.remove('opacity-30')
                                    l.classList.add('opacity-100')
                                })
                            else
                                logos.forEach(l => {
                                    l.classList.remove('opacity-100')
                                    l.classList.add('opacity-30')
                                })
                        }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                            <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                            <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                        </div>
                        <section className='grid grid-cols-2 h-[inherit]'>
                            <section className={`grid grid-rows-3`}>
                                <div className='flex items-center gap-4'>
                                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}] text-3xl`}>Relatório de Resultados</p>
                                    <span>{chart}</span>
                                </div>
                                <div className='flex flex-col justify-center'>
                                    <p style={{ color: props.cores.secundario }} className={`text-[${props.cores.secundario}] text-3xl`}>{nome}</p>
                                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}] text-2xl`}>{meses[props.mes - 1]}.{props.ano}</p>
                                    <div className='flex justify-end'>
                                        <img src={props.imagem} className='max-w-56 max-h-28 h-28' />
                                    </div>
                                </div>
                                <div className='flex items-end'>
                                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}] text-xl`}>
                                        {('0' + new Date().getDate()).slice(-2)}.
                                        {('0' + (new Date().getMonth() + 1)).slice(-2)}.
                                        {new Date().getFullYear()}
                                    </p>
                                </div>
                            </section>
                            <section className='flex items-center pl-5'>
                                <img src={acIMG} alt={nome} className='h-fit max-h-[650px]' />
                            </section>
                        </section>
                    </section>
                    {/* AGENDA */}
                    <section style={{ backgroundColor: props.cores.primario }} id='agenda' className={`flex flex-col justify-between p-10 h-screen relative bg-[${props.cores.primario}]`}>
                        <div onClick={() => {
                            const logos = document.querySelectorAll('.logo-ph')
                            if (logos[0].classList.contains('opacity-30'))
                                logos.forEach(l => {
                                    l.classList.remove('opacity-30')
                                    l.classList.add('opacity-100')
                                })
                            else
                                logos.forEach(l => {
                                    l.classList.remove('opacity-100')
                                    l.classList.add('opacity-30')
                                })
                        }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                            <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                            <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                        </div>
                        <p style={{ color: props.cores.letra }} className={`text-3xl text-[${props.cores.letra}]`}>Agenda</p>
                        <div className='flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-10'>
                            <div style={{ backgroundColor: props.cores.primario }} className={`w-full h-px bg-[${props.cores.primario}]`}></div>
                            <img src={props.imagem} alt="" className='bg-primary max-w-56 max-h-28 h-28' />
                        </div>
                        <section className='px-5 h-full mt-20 flex flex-col justify-center'>
                            <ul className='flex flex-col gap-4'>
                                <li className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[0] ? 'opacity-100' : 'opacity-30'}`}>
                                    <span style={{ color: props.cores.secundario }} className='font-black text-secondary text-2xl'>*</span>
                                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}] text-2xl`}>Calendário do mês e resumo das reservas</p>
                                    <button className='absolute right-2 invert top-1/2 -translate-y-1/2'
                                        onClick={() => {
                                            let error = editPages
                                            error = (error.map((e, i) => i === 0 ? !e : e))
                                            setEditPages(error)
                                        }}>{editPages[0] ? open : closed}</button>
                                </li>
                                <li className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[1] ? 'opacity-100' : 'opacity-30'}`}>
                                    <span style={{ color: props.cores.secundario }} className='font-black text-secondary text-2xl'>*</span>
                                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}] text-2xl`}>Detalhamento das reservas</p>
                                    <button className='absolute right-2 top-1/2 -translate-y-1/2 invert'
                                        onClick={() => {
                                            let error = editPages
                                            error = (error.map((e, i) => i === 1 ? !e : e))
                                            setEditPages(error)
                                        }}>{editPages[1] ? open : closed}</button>
                                </li>
                                <li className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[2] ? 'opacity-100' : 'opacity-30'}`}>
                                    <span style={{ color: props.cores.secundario }} className='font-black text-secondary text-2xl'>*</span>
                                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}] text-2xl`}>Desempenho e rentabilidade do imóvel</p>
                                    <button className='absolute right-2 top-1/2 -translate-y-1/2 invert'
                                        onClick={() => {
                                            let error = editPages
                                            error = (error.map((e, i) => i === 2 ? !e : e))
                                            setEditPages(error)
                                        }}>{editPages[2] ? open : closed}</button>
                                </li>
                                <li className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[3] ? 'opacity-100' : 'opacity-30'}`}>
                                    <span style={{ color: props.cores.secundario }} className='font-black text-secondary text-2xl'>*</span>
                                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}] text-2xl`}>Comparativo do faturamento</p>
                                    <button className='absolute right-2 top-1/2 -translate-y-1/2 invert'
                                        onClick={() => {
                                            let error = editPages
                                            error = (error.map((e, i) => i === 3 ? !e : e))
                                            setEditPages(error)
                                        }}>{editPages[3] ? open : closed}</button>
                                </li>
                                <li className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[4] ? 'opacity-100' : 'opacity-30'}`}>
                                    <span style={{ color: props.cores.secundario }} className='font-black text-secondary text-2xl'>*</span>
                                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}] text-2xl`}>Detalhamento das despesas</p>
                                    <button className='absolute right-2 top-1/2 -translate-y-1/2 invert'
                                        onClick={() => {
                                            let error = editPages
                                            error = (error.map((e, i) => i === 4 ? !e : e))
                                            setEditPages(error)
                                        }}>{editPages[4] ? open : closed}</button>
                                </li>
                                <li className={`bg-zinc-400 bg-opacity-10 px-2 py-1 gap-4 h-14 rounded-lg flex items-center relative ${editPages[5] ? 'opacity-100' : 'opacity-30'}`}>
                                    <span style={{ color: props.cores.secundario }} className='font-black text-secondary text-2xl'>*</span>
                                    <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}] text-2xl`}>Resultado da acomodação e repasse</p>
                                    <button className='absolute right-2 top-1/2 -translate-y-1/2 invert'
                                        onClick={() => {
                                            let error = editPages
                                            error = (error.map((e, i) => i === 5 ? !e : e))
                                            setEditPages(error)
                                        }}>{editPages[5] ? open : closed}</button>
                                </li>
                            </ul>
                        </section>
                    </section>
                    {/* CALENDARIO DO MES E RESUMO DAS RESERVAS */}
                    <div className={`relative ${!editPages[0] && 'opacity-30'}`}>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 0 ? !e : e))
                            setEditPages(error)
                        }} className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${editPages[0] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[0] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section style={{ backgroundColor: props.cores.primario }} id='calendario' className={`${!editPages[0] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}>
                            <div onClick={() => {
                                const logos = document.querySelectorAll('.logo-ph')
                                if (logos[0].classList.contains('opacity-30'))
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-30')
                                        l.classList.add('opacity-100')
                                    })
                                else
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-100')
                                        l.classList.add('opacity-30')
                                    })
                            }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p style={{ color: props.cores.letra }} className={`text-3xl text-[${props.cores.letra}]`}>Calendário do mês e resumo das reservas</p>
                            <div className='flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8'>
                                <div style={{ backgroundColor: props.cores.primario }} className={`w-full h-px bg-[${props.cores.primario}]`}></div>
                                <img src={props.imagem} alt="" className='bg-primary max-w-56 max-h-28 h-28' />
                            </div>
                            <section className='grid grid-cols-3 gap-10 h-full mt-20 items-center'>
                                <div className='col-span-2 h-full'>
                                    <CalendarioR
                                        data={`${props.ano}-${('0' + props.mes).slice(-2)}-01 00:00:00`}
                                        reservas={reservas} />
                                </div>
                                <ul className='flex flex-col gap-5 self-start mt-6'>
                                    <li className={`flex flex-col bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg relative ${editCalendar[0] ? 'opacity-100' : 'opacity-30'}`}>
                                        <button className='absolute right-2 invert'
                                            onClick={() => {
                                                let error = editCalendar
                                                error = (error.map((e, i) => i === 0 ? !e : e))
                                                setEditCalendar(error)
                                            }}>{editCalendar[0] ? open : closed}</button>
                                        <span style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}]`}>Ocupação</span>
                                        <span style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}] font-semibold text-end pr-4`}>{dadosReserva.ocupacao_do_imovel.toFixed(1)}%</span>
                                    </li>
                                    <li className={`flex flex-col bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg relative ${editCalendar[1] ? 'opacity-100' : 'opacity-30'}`}>
                                        <button className='absolute right-2 invert'
                                            onClick={() => {
                                                let error = editCalendar
                                                error = (error.map((e, i) => i === 1 ? !e : e))
                                                setEditCalendar(error)
                                            }}>{editCalendar[1] ? open : closed}</button>
                                        <span style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}]`}>Novas reservas</span>
                                        <span style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}] font-semibold text-end pr-4`}>{dadosReserva.novas_reservas}</span>
                                    </li>
                                    <li className={`flex flex-col bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg relative ${editCalendar[2] ? 'opacity-100' : 'opacity-30'}`}>
                                        <button className='absolute right-2 invert'
                                            onClick={() => {
                                                let error = editCalendar
                                                error = (error.map((e, i) => i === 2 ? !e : e))
                                                setEditCalendar(error)
                                            }}>{editCalendar[2] ? open : closed}</button>
                                        <span style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}]`}>Diária Média</span>
                                        <span style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}] font-semibold text-end pr-4`}>R$ {new Intl.NumberFormat('pt-BR', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(resultadoAcomodacoes[0].diaria_media))}</span>
                                    </li>
                                    <li className={`flex flex-col bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg relative ${editCalendar[3] ? 'opacity-100' : 'opacity-30'}`}>
                                        <button className='absolute right-2 invert'
                                            onClick={() => {
                                                let error = editCalendar
                                                error = (error.map((e, i) => i === 3 ? !e : e))
                                                setEditCalendar(error)
                                            }}>{editCalendar[3] ? open : closed}</button>
                                        <span style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}]`}>Faturamento</span>
                                        <span style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}] font-semibold text-end pr-4`}>R$ {new Intl.NumberFormat('pt-BR', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(dadosReserva.faturamento))}</span>
                                    </li>
                                </ul>
                            </section>

                        </section>
                    </div>
                    {/* DETALHAMENTO DE RESERVAS */}
                    <div className={`relative ${!editPages[1] && 'opacity-30'}`}>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 1 ? !e : e))
                            setEditPages(error)
                        }} className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${editPages[1] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[1] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section style={{ backgroundColor: props.cores.primario }} id='detalhamento-reservas' className={`${!editPages[1] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}>
                            <div onClick={() => {
                                const logos = document.querySelectorAll('.logo-ph')
                                if (logos[0].classList.contains('opacity-30'))
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-30')
                                        l.classList.add('opacity-100')
                                    })
                                else
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-100')
                                        l.classList.add('opacity-30')
                                    })
                            }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p style={{ color: props.cores.letra }} className={`text-3xl text-[${props.cores.letra}]`}>Detalhamento de reservas</p>
                            <div className='flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8'>
                                <div style={{ backgroundColor: props.cores.primario }} className={`w-full h-px bg-[${props.cores.primario}]`}></div>
                                <img src={props.imagem} alt="" className='bg-primary max-w-56 max-h-28 h-28' />
                            </div>
                            <section className='h-full mt-20 flex items-center'>
                                <ListaReservaR reservas={listaReservas.sort((a, b) => {
                                    return new Date(a.check_in).getTime() - new Date(b.check_in).getTime();
                                })} />
                            </section>

                        </section>
                    </div>
                    {/* DESEMPENHO E RENTABILIDADE DO IMOVEL */}
                    <div className={`relative ${!editPages[2] && 'opacity-30'}`}>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 2 ? !e : e))
                            setEditPages(error)
                        }} className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${editPages[2] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[2] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section style={{ backgroundColor: props.cores.primario }} id='desempenho-imovel' className={`${!editPages[2] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}>
                            <div onClick={() => {
                                const logos = document.querySelectorAll('.logo-ph')
                                if (logos[0].classList.contains('opacity-30'))
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-30')
                                        l.classList.add('opacity-100')
                                    })
                                else
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-100')
                                        l.classList.add('opacity-30')
                                    })
                            }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p style={{ color: props.cores.letra }} className={`text-3xl text-[${props.cores.letra}]`}>Desempenho e rentabilidade do imóvel</p>
                            <div className='flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8'>
                                <div style={{ backgroundColor: props.cores.primario }} className={`w-full h-px bg-[${props.cores.primario}]`}></div>
                                <img src={props.imagem} alt="" className='bg-primary max-w-56 max-h-28 h-28' />
                            </div>
                            <section className='flex gap-10 mt-16'>
                                <div className='bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg h-fit'>
                                    <div style={{ color: props.cores.letra }} className={`w-40 text-[${props.cores.letra}]`}>Faturamento do período</div>
                                    <div style={{ color: props.cores.letra }} className={`text-end text-[${props.cores.letra}] font-medium`}><span className='text-base pr-3'>R$</span>{new Intl.NumberFormat('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(Number(historicoFaturamento.faturamento_periodo))}</div>
                                </div>
                                <div className='bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg h-fit'>
                                    <div style={{ color: props.cores.letra }} className={`w-40 text-[${props.cores.letra}]`}>Rentabilidade do imóvel</div>
                                    <div style={{ color: props.cores.letra }} className={`text-end text-[${props.cores.letra}] font-medium`}>{((Number(historicoFaturamento.faturamento_periodo) / Number(valorImovel)) * 100).toFixed(1)}%</div>
                                </div>
                            </section>
                            {historicoFaturamento.faturamento_despesa.length > 0 &&
                                <HistoricoFaturamento
                                    mes={props.mes}
                                    ano={props.ano}
                                    dadosFaturamento={historicoFaturamento.faturamento_despesa.slice(-12).map(e => (Number(e.faturamento_liquido)))}
                                    dadosDespesa={historicoFaturamento.faturamento_despesa.slice(-12).map(e => (Number(e.despesas)))} />}
                            <p style={{ color: props.cores.letra }} className={`text-[${props.cores.letra}]`}>*Valor do imóvel estimado em R$ {new Intl.NumberFormat('pt-BR', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(Number(valorImovel))}</p>
                        </section>
                    </div>
                    {/* COMPARATIVO DO FATURAMENTO */}
                    <div className={`relative ${!editPages[3] && 'opacity-30'}`}>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 3 ? !e : e))
                            setEditPages(error)
                        }} className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${editPages[3] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[3] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section style={{ backgroundColor: props.cores.primario }} id='comparativo-faturamento' className={`${!editPages[3] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}>
                            <div onClick={() => {
                                const logos = document.querySelectorAll('.logo-ph')
                                if (logos[0].classList.contains('opacity-30'))
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-30')
                                        l.classList.add('opacity-100')
                                    })
                                else
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-100')
                                        l.classList.add('opacity-30')
                                    })
                            }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p style={{ color: props.cores.letra }} className={`text-3xl text-[${props.cores.letra}]`}>Comparativo Faturamento</p>
                            <div className='flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8'>
                                <div style={{ backgroundColor: props.cores.primario }} className={`w-full h-px bg-[${props.cores.primario}]`}></div>
                                <img src={props.imagem} alt="" className='bg-primary max-w-56 max-h-28 h-28' />
                            </div>
                            {historicoFaturamento.faturamento_despesa.length > 0 &&
                                <ComparativoResultados
                                    mes={props.mes}
                                    ano={props.ano}
                                    dadosAtuais={historicoFaturamento.faturamento_despesa.slice(-12).map(e => (Number(e.faturamento_liquido)))}
                                    dadosAnteriores={historicoFaturamento.faturamento_despesa.slice(0, 12).map(e => (Number(e.faturamento_liquido)))}
                                />}
                        </section>
                    </div>
                    {/* DETALHAMENTO DAS DESPESAS */}
                    <div className={`relative ${!editPages[4] && 'opacity-30'}`}>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 4 ? !e : e))
                            setEditPages(error)
                        }} className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${editPages[4] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[4] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section style={{ backgroundColor: props.cores.primario }} id='detalhamento-despesas' className={`${!editPages[4] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}>
                            <div onClick={() => {
                                const logos = document.querySelectorAll('.logo-ph')
                                if (logos[0].classList.contains('opacity-30'))
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-30')
                                        l.classList.add('opacity-100')
                                    })
                                else
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-100')
                                        l.classList.add('opacity-30')
                                    })
                            }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p style={{ color: props.cores.letra }} className={`text-3xl text-[${props.cores.letra}]`}>Detalhamento das despesas</p>
                            <div className='flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8'>
                                <div style={{ backgroundColor: props.cores.primario }} className={`w-full h-px bg-[${props.cores.primario}]`}></div>
                                <img src={props.imagem} alt="" className='bg-primary max-w-56 max-h-28 h-28' />
                            </div>
                            <div className='h-3/4 grid items-center'>
                                <DespesasR despesas={despesas.sort((a, b) => {
                                    return new Date(a.data).getTime() - new Date(b.data).getTime();
                                })} />
                            </div>
                        </section>
                    </div>
                    {/* RESULTADO DA ACOMODACAO E REPASSE */}
                    {resultadoAcomodacoes && resultadoAcomodacoes.length > 0 && < div className={`relative ${!editPages[5] && 'opacity-30'}`}>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 5 ? !e : e))
                            setEditPages(error)
                        }} className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${editPages[5] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[5] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section style={{ backgroundColor: props.cores.primario }} id='resultado-acomodacao' className={`${!editPages[5] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}>
                            <div onClick={() => {
                                const logos = document.querySelectorAll('.logo-ph')
                                if (logos[0].classList.contains('opacity-30'))
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-30')
                                        l.classList.add('opacity-100')
                                    })
                                else
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-100')
                                        l.classList.add('opacity-30')
                                    })
                            }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p style={{ color: props.cores.letra }} className={`text-3xl text-[${props.cores.letra}]`}>Resultado da acomodação e repasse</p>
                            <div className='flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8'>
                                <div style={{ backgroundColor: props.cores.primario }} className={`w-full h-px bg-[${props.cores.primario}]`}></div>
                                <img src={props.imagem} alt="" className='bg-primary max-w-56 max-h-28 h-28' />
                            </div>
                            <section className="grid gap-2 grid-cols-3 h-full mt-20">
                                <section className="grid gap-5 grid-cols-2 col-span-2">
                                    <div className={`bg-white border-zinc-300 border rounded-lg h-full flex items-center py-1 relative ${edit[0] ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                                            <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#01AAFE"><path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path></svg>
                                        </div>
                                        <div className="flex flex-col ml-4">
                                            <p className="flex flex-col text-zinc-400 font-medium text-sm">Faturamento Bruto</p>
                                            <div className="flex items-end gap-4">
                                                <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(resultadoAcomodacoes[0].faturamento_bruto))}</span>
                                            </div>
                                        </div>
                                        <button className='absolute right-3'
                                            onClick={() => {
                                                let field = edit
                                                field = (field.map((e, i) => i === 0 ? !e : e))
                                                setEdit(field)
                                            }}>{edit[0] ? open : closed}</button>
                                    </div>
                                    <div className={`bg-white border-zinc-300 border rounded-lg h-full flex items-center py-1 relative ${edit[1] ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                                            <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 480 480"><g><path d="M416 336h-12.528a56.806 56.806 0 0 0-25.312 5.976 40.799 40.799 0 0 1-36.32 0 56.604 56.604 0 0 0-14.4-4.8L343.032 216H360a8 8 0 0 0 8-8v-32a8 8 0 0 0-8-8h-32v-24a8 8 0 0 0-2.344-5.656L288 100.688V75.84l12.128-9.696 20.712 41.432 14.32-7.152-22.256-44.504L322.8 48H352a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8h-80c-39.744.048-71.952 32.256-72 72a8 8 0 0 0 8 8h16v20.688l-21.656 21.656A8 8 0 0 0 200 128v40h-16v-64a7.906 7.906 0 0 0-.584-2.888 8.263 8.263 0 0 0-.496-.904 8.911 8.911 0 0 0-.672-1.208L152 61.2V8a8 8 0 0 0-8-8H96a8 8 0 0 0-8 8v53.2L57.752 99c-.255.385-.48.789-.672 1.208-.184.291-.35.593-.496.904A7.906 7.906 0 0 0 56 104v64H24a8 8 0 0 0-8 8v32a8 8 0 0 0 8 8h16.968l31.096 241.024A8 8 0 0 0 80 464h188.32A47.862 47.862 0 0 0 304 480h12.528a56.806 56.806 0 0 0 25.312-5.976 40.799 40.799 0 0 1 36.32 0A56.806 56.806 0 0 0 403.472 480H416c26.499-.026 47.974-21.501 48-48v-48c-.026-26.499-21.501-47.974-48-48zM328 16h16v16h-16V16zm24 168v16H240v-16h112zM216.568 64c4.013-27.535 27.606-47.965 55.432-48h40v20.16L277.192 64h-60.624zM272 80v16h-32V80h32zm-56 51.312L235.312 112h41.376L312 147.312V168h-96v-36.688zM208 184h16v56a8 8 0 0 0 4.424 7.2l48 24a9.663 9.663 0 0 1 4.92 5.688 10.289 10.289 0 0 1-.8 8 9.343 9.343 0 0 1-12.531 4.194l-.021-.01-32.48-16.24A8 8 0 0 0 224 280v80c0 8.837-7.163 16-16 16v-72h-16v72h-16v-72h-16v72h-16v-72h-16v72c-8.837 0-16-7.163-16-16V184h96zM104 16h32v40h-32V16zm-4.16 56h40.32l19.2 24H80.64l19.2-24zM72 112h96v56H72v-56zm-40 88v-16h64v16H32zm224 184v48a47.818 47.818 0 0 0 2.8 16H87.032L57.096 216H96v144c0 17.673 14.327 32 32 32h80c17.673 0 32-14.327 32-32v-67.056l20.896 10.448c12.627 6.232 27.915 1.048 34.147-11.579l.077-.157a25.896 25.896 0 0 0 1.464-19.8 25.597 25.597 0 0 0-12.96-14.992L240 235.056V216h86.904l-15.488 120H304c-26.499.026-47.974 21.501-48 48zm192 48c0 17.673-14.327 32-32 32h-12.528a40.8 40.8 0 0 1-18.152-4.288 56.903 56.903 0 0 0-50.64 0A40.8 40.8 0 0 1 316.528 464H304c-17.673 0-32-14.327-32-32v-12.32A47.75 47.75 0 0 0 304 432h12.528a56.806 56.806 0 0 0 25.312-5.976 40.799 40.799 0 0 1 36.32 0A56.806 56.806 0 0 0 403.472 432H416a47.75 47.75 0 0 0 32-12.32V432zm-32-16h-12.528a40.8 40.8 0 0 1-18.152-4.288 56.903 56.903 0 0 0-50.64 0A40.8 40.8 0 0 1 316.528 416H304c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h12.528a40.8 40.8 0 0 1 18.152 4.288 56.935 56.935 0 0 0 50.64 0A40.8 40.8 0 0 1 403.472 352H416c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32z" fill="#009ae7" opacity="1" data-original="#000000"></path><path d="M408 368h16v16h-16zM328 368h16v16h-16zM296 376h16v16h-16zM376 376h16v16h-16z" fill="#009ae7" opacity="1" data-original="#000000"></path></g></svg>
                                        </div>
                                        <div className="flex flex-col ml-4">
                                            <p className="flex flex-col text-zinc-400 font-medium text-sm">Taxa de Limpeza</p>
                                            <div className="flex items-end gap-4">
                                                <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(resultadoAcomodacoes[0].taxa_limpeza))}</span>
                                            </div>
                                        </div>
                                        <button className='absolute right-3'
                                            onClick={() => {
                                                let field = edit
                                                field = (field.map((e, i) => i === 1 ? !e : e))
                                                setEdit(field)
                                            }}>{edit[1] ? open : closed}</button>
                                    </div>
                                    <div className={`bg-white border-zinc-300 border rounded-lg h-full flex items-center py-1 relative ${edit[2] ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className="bg-[#FCE0E1] rounded-md w-fit py-2 px-2 ml-4">
                                            <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M17.5049 21.0027C15.5719 21.0027 14.0049 19.4357 14.0049 17.5027C14.0049 15.5697 15.5719 14.0027 17.5049 14.0027C19.4379 14.0027 21.0049 15.5697 21.0049 17.5027C21.0049 19.4357 19.4379 21.0027 17.5049 21.0027ZM17.5049 19.0027C18.3333 19.0027 19.0049 18.3312 19.0049 17.5027C19.0049 16.6743 18.3333 16.0027 17.5049 16.0027C16.6765 16.0027 16.0049 16.6743 16.0049 17.5027C16.0049 18.3312 16.6765 19.0027 17.5049 19.0027ZM6.50488 10.0027C4.57189 10.0027 3.00488 8.43574 3.00488 6.50275C3.00488 4.56975 4.57189 3.00275 6.50488 3.00275C8.43788 3.00275 10.0049 4.56975 10.0049 6.50275C10.0049 8.43574 8.43788 10.0027 6.50488 10.0027ZM6.50488 8.00275C7.33331 8.00275 8.00488 7.33117 8.00488 6.50275C8.00488 5.67432 7.33331 5.00275 6.50488 5.00275C5.67646 5.00275 5.00488 5.67432 5.00488 6.50275C5.00488 7.33117 5.67646 8.00275 6.50488 8.00275ZM19.076 3.51747L20.4902 4.93168L4.93382 20.488L3.5196 19.0738L19.076 3.51747Z"></path></svg>
                                        </div>
                                        <div className="flex flex-col ml-4">
                                            <p className="flex flex-col text-zinc-400 font-medium text-sm">Comissão das Reservas</p>
                                            <div className="flex items-end gap-4">
                                                <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(resultadoAcomodacoes[0].comissao_reservas))}</span>
                                            </div>
                                        </div>
                                        <button className='absolute right-3'
                                            onClick={() => {
                                                let field = edit
                                                field = (field.map((e, i) => i === 2 ? !e : e))
                                                setEdit(field)
                                            }}>{edit[2] ? open : closed}</button>
                                    </div>
                                    <div className={`bg-white border-zinc-300 border rounded-lg h-full flex items-center py-1 relative ${edit[6] ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className="bg-[#f9fce0] rounded-md w-fit py-2 px-2 ml-4">
                                            <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#edea3e"><path d="M17.5049 21.0027C15.5719 21.0027 14.0049 19.4357 14.0049 17.5027C14.0049 15.5697 15.5719 14.0027 17.5049 14.0027C19.4379 14.0027 21.0049 15.5697 21.0049 17.5027C21.0049 19.4357 19.4379 21.0027 17.5049 21.0027ZM17.5049 19.0027C18.3333 19.0027 19.0049 18.3312 19.0049 17.5027C19.0049 16.6743 18.3333 16.0027 17.5049 16.0027C16.6765 16.0027 16.0049 16.6743 16.0049 17.5027C16.0049 18.3312 16.6765 19.0027 17.5049 19.0027ZM6.50488 10.0027C4.57189 10.0027 3.00488 8.43574 3.00488 6.50275C3.00488 4.56975 4.57189 3.00275 6.50488 3.00275C8.43788 3.00275 10.0049 4.56975 10.0049 6.50275C10.0049 8.43574 8.43788 10.0027 6.50488 10.0027ZM6.50488 8.00275C7.33331 8.00275 8.00488 7.33117 8.00488 6.50275C8.00488 5.67432 7.33331 5.00275 6.50488 5.00275C5.67646 5.00275 5.00488 5.67432 5.00488 6.50275C5.00488 7.33117 5.67646 8.00275 6.50488 8.00275ZM19.076 3.51747L20.4902 4.93168L4.93382 20.488L3.5196 19.0738L19.076 3.51747Z"></path></svg>
                                        </div>
                                        <div className="flex flex-col ml-4">
                                            <p className="flex flex-col text-zinc-400 font-medium text-sm">Comissão Taxa de Limpeza</p>
                                            <div className="flex items-end gap-4">
                                                <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(resultadoAcomodacoes[0].comissao_taxa_limpeza))}</span>
                                            </div>
                                        </div>
                                        <button className='absolute right-3'
                                            onClick={() => {
                                                let field = edit
                                                field = (field.map((e, i) => i === 6 ? !e : e))
                                                setEdit(field)
                                            }}>{edit[6] ? open : closed}</button>
                                    </div>
                                    <div className={`bg-white border-zinc-300 border rounded-lg h-full flex items-center py-1 relative ${edit[3] ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className="bg-[#D1F0FF] rounded-md w-fit py-2 px-2 ml-4">
                                            <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 100 100" ><g><path d="m93.9 29.7-.6-.1v-.4c-.1-1.1-.6-2-1.4-2.7s-1.8-1-2.9-.9L72.9 27l-60.8-7.7c-2.2-.3-4.2 1.3-4.5 3.5L6.3 33.1c-.9.2-1.7.6-2.3 1.3-.7.8-1 1.9-.9 2.9l1.1 12.1-1.6 13c-.1 1.1.2 2.1.8 3 .6.8 1.4 1.3 2.4 1.5L6.7 77c.2 2.1 1.9 3.6 4 3.6h.4l61-5.5 15.9 2h.5c2 0 3.7-1.5 4-3.5l.1-.4.8-.1c1.1-.1 2-.6 2.7-1.4s1-1.9.9-2.9L95.4 51l2.1-17c.2-2-1.4-4-3.6-4.3zM9.6 23.1c.1-1 1-1.8 2-1.8h.3l51.8 6.5-55.3 5zM5 64.1c-.3-.4-.5-1-.4-1.5l.5-3.8.5 5.8c-.2-.1-.4-.3-.6-.5zm83.2 11.1-6.8-.9 9.1-.8c-.2 1.1-1.2 1.8-2.3 1.7zm6.2-4.6c-.3.4-.8.7-1.3.7h-.3l-2 .2-18.6 1.7-9.5.8-51.9 4.6c-1.1.1-2.1-.7-2.2-1.8L7.7 67l-.2-2-1.3-15.5-.8-9.4-.3-3c0-.5.1-1 .5-1.5.1-.2.3-.3.4-.4.3-.1.6-.2.9-.2l1.2-.1 64.8-5.8 9.3-.8 7-.6h.2c.5 0 .9.2 1.3.5s.7.8.7 1.3l.2 2 1.8 19.7.8 9.4.8 8.7c-.1.3-.2.9-.6 1.3zm1-36.7-1 7.9-.9-10.1h.2c1.1.1 1.9 1.1 1.7 2.2z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M86.1 38.7c-1.5.1-3-.3-4.2-1.3s-1.9-2.3-2-3.9c0-.3-.2-.5-.4-.7s-.5-.3-.7-.2l-30.5 2.7L18 38c-.5.1-1 .5-.9 1.1.1 1.5-.3 3-1.3 4.2s-2.4 1.9-3.9 2c-.3 0-.5.2-.7.4s-.2.4-.2.7l1.7 19.3.1 1c0 .5.5 1 1.1.9 1.1-.1 2.2.1 3.1.6 1.7.9 2.9 2.5 3.1 4.6 0 .3.2.5.4.7s.4.2.6.2h.1L44 71.6l7.6-.7 1.7-.1L82 68.2c.3 0 .5-.2.7-.3.2-.2.3-.5.2-.7-.1-1.5.3-3 1.3-4.2s2.4-1.9 3.9-2c.3 0 .5-.2.7-.4s.3-.5.2-.7l-1.8-20.3c-.1-.6-.5-1-1.1-.9zm-3.4 23c-1.1 1.3-1.7 2.9-1.8 4.6L51.4 69l-7.3.7-9.3.8L22 71.6c-.2-1.1-.7-2.1-1.4-2.9-.8-1-1.8-1.9-3-2.4-.9-.4-1.9-.7-2.9-.7l-1.6-18.4c3.4-.8 5.9-3.7 6-7.2l29.5-2.7L78 34.6c.4 1.7 1.3 3.1 2.6 4.3 1.3 1.1 2.9 1.7 4.6 1.8l1.7 18.4c-1.6.4-3.1 1.3-4.2 2.6z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M49.9 52.1c-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3s.1-1 .5-1.4c.3-.4.8-.7 1.3-.7s1 .1 1.4.5c.4.3.7.8.7 1.3s.5 1 1.1.9c.6 0 1-.5.9-1.1-.1-1.1-.6-2-1.4-2.7-.5-.5-1.2-.7-1.9-.9l-.1-1.1c0-.5-.5-1-1.1-.9-.5 0-1 .5-.9 1.1l.1 1.1c-.7.2-1.2.6-1.7 1.2-.7.8-1 1.8-.9 2.9s.6 2 1.4 2.7 1.9 1 2.9.9c1.1-.1 2 .7 2.1 1.8 0 .5-.1 1-.5 1.4-.3.4-.8.7-1.3.7-.5.1-1-.1-1.4-.5-.4-.3-.7-.8-.7-1.3 0-.6-.5-1-1.1-.9-.6 0-1 .5-.9 1.1.1 1.1.6 2 1.4 2.7.6.5 1.2.8 1.9.9l.1 1.1c0 .5.5.9 1 .9h.1c.5 0 1-.5.9-1.1l-.1-1.1c.7-.2 1.2-.6 1.7-1.2.7-.8 1-1.8.9-2.9s-.6-2-1.4-2.7c-.8-.6-1.8-1-2.9-.9z" fill="#01AAFE" opacity="1" data-original="#000000"></path><path d="M58.7 42.7c-2.8-2.3-6.3-3.4-9.9-3.1-7.5.7-13 7.3-12.3 14.8.3 3.6 2 6.9 4.8 9.2 2.5 2.1 5.5 3.2 8.7 3.2.4 0 .8 0 1.2-.1 7.1-.6 12.4-6.6 12.4-13.5V52c-.4-3.7-2.1-7-4.9-9.3zm-7.7 22c-3 .3-6.1-.7-8.4-2.7s-3.8-4.8-4.1-7.9c-.6-6.4 4.2-12 10.5-12.6h1.1c2.7 0 5.3.9 7.4 2.7 1.2 1 2.2 2.2 2.8 3.5.7 1.3 1.1 2.8 1.3 4.3.5 6.5-4.2 12.1-10.6 12.7zM20.9 50c-1.9 0-3.5 1.6-3.5 3.5S19 57 20.9 57s3.5-1.6 3.5-3.5c-.1-1.9-1.6-3.5-3.5-3.5zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5c-.1.8-.7 1.5-1.5 1.5zM79.1 50c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5S81 50 79.1 50zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S80 55 79.1 55z" fill="#01AAFE" opacity="1" data-original="#000000"></path></g></svg>
                                        </div>
                                        <div className="flex flex-col ml-4">
                                            <p className="flex flex-col text-zinc-400 font-medium text-sm">Faturamento Líquido</p>
                                            <div className="flex items-end gap-4">
                                                <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(resultadoAcomodacoes[0].faturamento_liquido))}</span>
                                            </div>
                                        </div>
                                        <button className='absolute right-3'
                                            onClick={() => {
                                                let field = edit
                                                field = (field.map((e, i) => i === 3 ? !e : e))
                                                setEdit(field)
                                            }}>{edit[3] ? open : closed}</button>
                                    </div>
                                    <div className={`bg-white border-zinc-300 border rounded-lg h-full flex items-center py-1 relative ${edit[4] ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className="bg-[#F8DCDC] rounded-md w-fit py-2 px-2 ml-4">
                                            <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D94D52"><path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path></svg>            </div>
                                        <div className="flex flex-col ml-4">
                                            <p className="flex flex-col text-zinc-400 font-medium text-sm">Despesas (exceto negócio)</p>
                                            <div className="flex items-end gap-4">
                                                <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(resultadoAcomodacoes[0].despesas))}</span>
                                            </div>
                                        </div>
                                        <button className='absolute right-3'
                                            onClick={() => {
                                                let field = edit
                                                field = (field.map((e, i) => i === 4 ? !e : e))
                                                setEdit(field)
                                            }}>{edit[4] ? open : closed}</button>
                                    </div>
                                    <div className={`bg-white border-zinc-300 border rounded-lg h-full flex items-center py-1 relative ${edit[5] ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className="bg-[#E0FEEA] rounded-md w-fit py-2 px-2 ml-4">
                                            <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 484.184 484.184" ><g><path d="M309.43 219.944c-19-10.5-39.2-18.5-59.2-26.8-11.6-4.8-22.7-10.4-32.5-18.2-19.3-15.4-15.6-40.4 7-50.3 6.4-2.8 13.1-3.7 19.9-4.1 26.2-1.4 51.1 3.4 74.8 14.8 11.8 5.7 15.7 3.9 19.7-8.4 4.2-13 7.7-26.2 11.6-39.3 2.6-8.8-.6-14.6-8.9-18.3-15.2-6.7-30.8-11.5-47.2-14.1-21.4-3.3-21.4-3.4-21.5-24.9-.1-30.3-.1-30.3-30.5-30.3-4.4 0-8.8-.1-13.2 0-14.2.4-16.6 2.9-17 17.2-.2 6.4 0 12.8-.1 19.3-.1 19-.2 18.7-18.4 25.3-44 16-71.2 46-74.1 94-2.6 42.5 19.6 71.2 54.5 92.1 21.5 12.9 45.3 20.5 68.1 30.6 8.9 3.9 17.4 8.4 24.8 14.6 21.9 18.1 17.9 48.2-8.1 59.6-13.9 6.1-28.6 7.6-43.7 5.7-23.3-2.9-45.6-9-66.6-19.9-12.3-6.4-15.9-4.7-20.1 8.6-3.6 11.5-6.8 23.1-10 34.7-4.3 15.6-2.7 19.3 12.2 26.6 19 9.2 39.3 13.9 60 17.2 16.2 2.6 16.7 3.3 16.9 20.1.1 7.6.1 15.3.2 22.9.1 9.6 4.7 15.2 14.6 15.4 11.2.2 22.5.2 33.7-.1 9.2-.2 13.9-5.2 13.9-14.5 0-10.4.5-20.9.1-31.3-.5-10.6 4.1-16 14.3-18.8 23.5-6.4 43.5-19 58.9-37.8 42.8-52 26.5-128.1-34.1-161.6z" fill="#61C365" opacity="1" data-original="#000000" ></path></g></svg>
                                        </div>
                                        <div className="flex flex-col ml-4">
                                            <p className="flex flex-col text-zinc-400 font-medium text-sm">Lucro das Acomodações</p>
                                            <div className="flex items-end gap-4">
                                                <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(resultadoAcomodacoes[0].lucro))}</span>
                                            </div>
                                        </div>
                                        <button className='absolute right-3'
                                            onClick={() => {
                                                let field = edit
                                                field = (field.map((e, i) => i === 5 ? !e : e))
                                                setEdit(field)
                                            }}>{edit[5] ? open : closed}</button>
                                    </div>
                                    <div className={`bg-white border-zinc-300 border rounded-lg h-full flex items-center py-1 relative ${edit[7] ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className="bg-[#fde0fe] rounded-md w-fit py-2 px-2 ml-4">
                                            <svg className="w-6 h-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14V16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM14.5946 18.8115C14.5327 18.5511 14.5 18.2794 14.5 18C14.5 17.7207 14.5327 17.449 14.5945 17.1886L13.6029 16.6161L14.6029 14.884L15.5952 15.4569C15.9883 15.0851 16.4676 14.8034 17 14.6449V13.5H19V14.6449C19.5324 14.8034 20.0116 15.0851 20.4047 15.4569L21.3971 14.8839L22.3972 16.616L21.4055 17.1885C21.4673 17.449 21.5 17.7207 21.5 18C21.5 18.2793 21.4673 18.551 21.4055 18.8114L22.3972 19.3839L21.3972 21.116L20.4048 20.543C20.0117 20.9149 19.5325 21.1966 19.0001 21.355V22.5H17.0001V21.3551C16.4677 21.1967 15.9884 20.915 15.5953 20.5431L14.603 21.1161L13.6029 19.384L14.5946 18.8115ZM18 19.5C18.8284 19.5 19.5 18.8284 19.5 18C19.5 17.1716 18.8284 16.5 18 16.5C17.1716 16.5 16.5 17.1716 16.5 18C16.5 18.8284 17.1716 19.5 18 19.5Z" fill="#c061c3"></path></svg>
                                        </div>
                                        <div className="flex flex-col ml-4">
                                            <p className="flex flex-col text-zinc-400 font-medium text-sm">Repasse Gestor</p>
                                            <div className="flex items-end gap-4">
                                                <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(Number(resultadoAcomodacoes[0].lucro) - Number(resultadoAcomodacoes[0].repasse))}</span>
                                            </div>
                                        </div>
                                        <button className='absolute right-3'
                                            onClick={() => {
                                                let field = edit
                                                field = (field.map((e, i) => i === 7 ? !e : e))
                                                setEdit(field)
                                            }}>{edit[7] ? open : closed}</button>
                                    </div>
                                </section>
                                <section className='flex items-center justify-center'>
                                    <div className='flex flex-col bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg gap-2 w-3/4'>
                                        <p style={{ color: props.cores.letra }} className={`text-2xl text-[${props.cores.letra}]`}>Repasse proprietário</p>
                                        <p style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}] font-semibold flex text-end pr-4`}>R$ <input className='bg-transparent ml-5 w-full' defaultValue={new Intl.NumberFormat('pt-BR', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(resultadoAcomodacoes[0].repasse))} type="text"
                                            onBlur={(e) => e.target.value = new Intl.NumberFormat('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(e.target.value.replace('.', '').replace(',', '.')))}
                                            onFocus={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9,]/g, "").replace(/(,.*),/g, "$1")
                                            }}
                                            onChange={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9,]/g, "").replace(/(,.*),/g, "$1")
                                            }} /></p>
                                    </div>
                                </section>
                            </section>
                        </section>
                    </div>}
                    {/* CONSIDERACOES FINAIS */}
                    <div className={`relative ${!editPages[6] && 'opacity-30'}`}>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 6 ? !e : e))
                            setEditPages(error)
                        }} className={`button-report absolute left-3 top-1 py-1 px-2 z-20 ${editPages[6] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[6] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section style={{ backgroundColor: props.cores.primario }} id='final' className={`${!editPages[6] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 h-screen bg-[${props.cores.primario}] relative`}>
                            <div onClick={() => {
                                const logos = document.querySelectorAll('.logo-ph')
                                if (logos[0].classList.contains('opacity-30'))
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-30')
                                        l.classList.add('opacity-100')
                                    })
                                else
                                    logos.forEach(l => {
                                        l.classList.remove('opacity-100')
                                        l.classList.add('opacity-30')
                                    })
                            }} className='flex items-center absolute bottom-1 right-2 gap-2 logo-ph cursor-pointer'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-white font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p style={{ color: props.cores.letra }} className={`text-3xl text-[${props.cores.letra}]`}>Considerações finais</p>
                            <div className='flex items-center gap-4 absolute w-full left-1/2 -translate-x-1/2 px-8'>
                                <div style={{ backgroundColor: props.cores.primario }} className={`w-full h-px bg-[${props.cores.primario}]`}></div>
                                <img src={props.imagem} alt="" className='bg-primary max-w-56 max-h-28 h-28' />
                            </div>
                            <div className="h-[77%] grid col-span-2 gap-6">
                                <section className='flex justify-between bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-2xl'>
                                    <div className='h-full w-52 relative flex flex-col justify-around items-center'>
                                        {dash}
                                        <p style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}] text-center`}>Resumo e<br /> resultados</p>
                                    </div>
                                    <textarea style={{ whiteSpace: "pre-line" }} className='resize-none h-full py-2 px-2 w-3/4 border border-black rounded-xl bg-slate-100 overflow-clip'></textarea>
                                </section>
                                <section className='flex justify-between  bg-zinc-400 bg-opacity-10 px-2 py-1 rounded-lg'>
                                    <div className='h-full w-52 relative flex flex-col justify-around items-center'>
                                        {blue_print}
                                        <p style={{ color: props.cores.letra }} className={`text-xl text-[${props.cores.letra}] text-center`}>Próximos<br /> passos</p>
                                    </div>
                                    <textarea style={{ whiteSpace: "pre-line" }} className='resize-none h-full py-2 px-2 w-3/4 border border-black rounded-xl bg-slate-100 overflow-clip'></textarea>
                                </section>
                            </div>
                        </section>
                    </div>
                </div >
            }
        </>
    )
}