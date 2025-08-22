const dash = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)" > <path d="M9 2.4578V4.58152C6.06817 5.76829 4 8.64262 4 12C4 16.4183 7.58172 20 12 20C15.3574 20 18.2317 17.9318 19.4185 15H21.5422C20.2679 19.0571 16.4776 22 12 22C6.47715 22 2 17.5228 2 12C2 7.52236 4.94289 3.73207 9 2.4578ZM12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13H11V2.04938C11.3289 2.01672 11.6625 2 12 2ZM13 4.06189V11H19.9381C19.4869 7.38128 16.6187 4.51314 13 4.06189Z"></path></svg>
const medidor = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM15.8329 7.33748C16.0697 7.17128 16.3916 7.19926 16.5962 7.40381C16.8002 7.60784 16.8267 7.92955 16.6587 8.16418C14.479 11.2095 13.2796 12.8417 13.0607 13.0607C12.4749 13.6464 11.5251 13.6464 10.9393 13.0607C10.3536 12.4749 10.3536 11.5251 10.9393 10.9393C11.3126 10.5661 12.9438 9.36549 15.8329 7.33748ZM17.5 11C18.0523 11 18.5 11.4477 18.5 12C18.5 12.5523 18.0523 13 17.5 13C16.9477 13 16.5 12.5523 16.5 12C16.5 11.4477 16.9477 11 17.5 11ZM6.5 11C7.05228 11 7.5 11.4477 7.5 12C7.5 12.5523 7.05228 13 6.5 13C5.94772 13 5.5 12.5523 5.5 12C5.5 11.4477 5.94772 11 6.5 11ZM8.81802 7.40381C9.20854 7.79433 9.20854 8.4275 8.81802 8.81802C8.4275 9.20854 7.79433 9.20854 7.40381 8.81802C7.01328 8.4275 7.01328 7.79433 7.40381 7.40381C7.79433 7.01328 8.4275 7.01328 8.81802 7.40381ZM12 5.5C12.5523 5.5 13 5.94772 13 6.5C13 7.05228 12.5523 7.5 12 7.5C11.4477 7.5 11 7.05228 11 6.5C11 5.94772 11.4477 5.5 12 5.5Z"></path></svg>
const stonks = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M5 3V19H21V21H3V3H5ZM20.2929 6.29289L21.7071 7.70711L16 13.4142L13 10.415L8.70711 14.7071L7.29289 13.2929L13 7.58579L16 10.585L20.2929 6.29289Z"></path></svg>
/* const star = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg> */
const pause = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M16 12.6667L5.77735 19.4818C5.54759 19.6349 5.23715 19.5729 5.08397 19.3431C5.02922 19.261 5 19.1645 5 19.0657V4.93426C5 4.65812 5.22386 4.43426 5.5 4.43426C5.59871 4.43426 5.69522 4.46348 5.77735 4.51823L16 11.3333V5C16 4.44772 16.4477 4 17 4C17.5523 4 18 4.44772 18 5V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V12.6667ZM7 7.73703V16.263L13.3944 12L7 7.73703Z"></path></svg>

import { useEffect, useRef, useState } from 'react'
import ph from '/prohost-logo.png'
/* import timeGridPlugin from '@fullcalendar/timegrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from "@fullcalendar/react"; */
import CalendarioR from '../report/CalendarioR'
import ComparativoResultados from '../report/ComparativoFaturamentoMensal'
import DespesasR from '../report/DespesasR'
import HistoricoFaturamento from '../report/HistoricoFaturamento'
import ListaReservaR from './ListaReservaR'
// import { set } from 'date-fns'
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
interface propsRelatorio {
    saas: number,
    acomodacao: number,
    mes: number,
    ano: number,
}

export default function RelatorioCompleto(props: propsRelatorio) {
    const apiURL = 'https://api.prohost.net.br'
    const [editPages, setEditPages] = useState([true, true, true, true, true, true, true])
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

    const generatePDF = () => {
        /* const input = pdfRef.current;

        setTimeout(() => {
            html2canvas(input, { scale: 3 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');

                const pageWidth = 297; // Width of A4 in mm
                const pageHeight = 210; // Height of A4 in mm
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * pageWidth) / canvas.width; // Proportional height

                let currentHeight = 0;
                let remainingHeight = imgHeight;

                // Add pages as needed
                while (remainingHeight > 0) {
                    pdf.addImage(
                        imgData,
                        'PNG',
                        0,
                        -currentHeight, // Offset the image to simulate cropping
                        imgWidth,
                        imgHeight
                    );
                    remainingHeight -= pageHeight;
                    currentHeight += pageHeight;

                    // Add a new page if there is still content remaining
                    if (remainingHeight > 0) pdf.addPage();
                }

                pdf.save('relatorio.pdf');
            });
        }, 1000); */
    };

    const [loaded, setLoaded] = useState<boolean>(false)
    const [nome, setNome] = useState<string>('')
    const [endereco, setEndereco] = useState<string>('')
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
        taxa_limpeza: string
        rentabilidade_imovel: string | number
    }[]>([])
    const [despesas, setDespesas] = useState<any[]>([])
    const [reservas, setReservas] = useState<any[]>([])
    const [historicoFaturamento, setHistoricoFaturamento] = useState<{
        faturamento_periodo: number,
        rentabilidade_imovel: number,
        faturamento_despesa: any[]
    }>({ faturamento_periodo: 0, rentabilidade_imovel: 0, faturamento_despesa: [] })
    const [listaReservas, setListaReservas] = useState<any[]>([])


    async function getData() {
        {
            await fetch(`${apiURL}/acomodacao/${props.saas}/${props.acomodacao}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data) => {
                    setValorImovel(data[0].valor_imovel)
                    setEndereco(data[0].endereco)
                    setAcIMG(data[0].foto)
                    setNome(data[0].nome)
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/reserva/${props.saas}/desempenho/${`${props.ano}-${('0' + props.mes).slice(-2)}-${'01'}`}/${`${props.ano}-${('0' + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}/${props.acomodacao}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data) => {
                    const reservadas = data.reservadas
                    setDadosReserva(dados => ({
                        ...dados,
                        ocupacao_do_imovel: ((reservadas) / diasDoMes(props.mes, props.ano) * 100)
                    }))
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/reserva/${props.saas}/ind-ope/${`${props.ano}-${('0' + props.mes).slice(-2)}-${'01'}`}/${`${props.ano}-${('0' + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}/${props.acomodacao}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data) => {
                    if (data.length > 0 && data[0].total_reserva)
                        setDadosReserva(dados => ({
                            ...dados,
                            novas_reservas: Number(data[0].total_reserva)
                        }))
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/movimentacao/${props.saas}/result-ac/${`${props.ano}-${('0' + props.mes).slice(-2)}-${'01'}`}/${`${props.ano}-${('0' + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}/${props.acomodacao}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data) => {
                    if (data.statusCode == 500 || data.length == 0) {
                        // setRentabilidade([{
                        //     comissao_plataforma: "0",
                        //     despesas: "0",
                        //     diaria_media: "0",
                        //     faturamento_bruto: "0",
                        //     faturamento_liquido: "0",
                        //     lucro: "0",
                        //     rentabilidade_imovel: "0",
                        // }])
                    }
                    else {
                        setDadosReserva(dados => ({
                            ...dados, faturamento: data[0].faturamento_liquido,
                        }))
                        setHistoricoFaturamento(dados => ({
                            ...dados, rentabilidade_imovel: data[0].rentabilidade_imovel,
                        }))
                    }
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/movimentacao/${props.saas}/fat-bar/${`${props.ano}-${('0' + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}/${props.acomodacao}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data: any[]) => {
                    setHistoricoFaturamento(dados => ({
                        ...dados,
                        faturamento_periodo: data.reduce((total, item) => {
                            return total + parseFloat((item.receita) || 0);
                        }, 0),
                        faturamento_despesa: data
                    }))
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/movimentacao/${props.saas}/relatorio/${props.acomodacao}/${`${props.ano}-${('0' + props.mes).slice(-2)}-${'01'}`}/${`${props.ano}-${('0' + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data: any[]) => {
                    setDespesas(data)
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/reserva/ac/${props.acomodacao}/${props.mes}/${props.ano}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data: any) => {
                    setListaReservas(data)
                    setReservas(data.map((item: any, index: any) => ({
                        title: item.hospede ? item.hospede.nome : 'Indisponibilidade',
                        start: item.check_in.slice(0, 19).replace('T', ' '),
                        end: item.check_out.slice(0, 19).replace('T', ' '),
                        hospedes: item.qtd_hospede,
                        color: item.tipo_reserva == 'Continuidade' ? '#30C46D'
                            : item.tipo_reserva == 'Indisponibilidade' ? '#353535'
                                : item.canal_reserva?.cor || '',
                        id: String(index + 1),
                        tipo: item.tipo_reserva,
                        obs: item.obs,
                        bruto: parseFloat(item.valor),
                        liquido: parseFloat(item.valor_liq),
                        comissao: parseFloat(item.comissao_ota)
                    })))
                })
                .catch(err => console.log(err))
        }
        {
            await fetch(`${apiURL}/movimentacao/${props.saas}/result-ac/${`${props.ano}-${('0' + props.mes).slice(-2)}-${'01'}`}/${`${props.ano}-${('0' + props.mes).slice(-2)}-${diasDoMes(props.mes, props.ano)}`}/${props.acomodacao}`, {
                method: 'GET'
            })
                .then(data => data.json())
                .then((data) => {
                    if (data.statusCode == 500 || data.length == 0)
                        setResultadoAcomodacoes([{
                            comissao_plataforma: "0",
                            despesas: "0",
                            diaria_media: "0",
                            faturamento_bruto: "0",
                            faturamento_liquido: "0",
                            lucro: "0",
                            taxa_limpeza: "0",
                            rentabilidade_imovel: 0,
                        }])
                    else
                        setResultadoAcomodacoes(data)
                })
                .catch(err => console.log(err))
        }
        setLoaded(true)
    }

    useEffect(() => {

        setLoaded(false)
        if (props) {
            getData()
        }
    }, [props])

    return (
        <>
            <button onClick={generatePDF} className='w-full bg-red-600 hidden'>
                Baixar como PDF
            </button>
            {loaded &&
                <div className="flex flex-col" ref={pdfRef} >
                    <section className={`flex flex-col justify-between p-10 bg-gradient-to-t h-screen relative from-white to-emerald-100`}>
                        <div className='flex items-center absolute top-1 right-1 gap-2'>
                            <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                            <p className='text-primary font-bold text-lg tracking-tight'>prohost</p>
                        </div>
                        <section className={`grid grid-cols-2`}>
                            <div>
                                <p className='text-3xl text-center font-semibold'>Parceria para locação <br />
                                    de imóvel residencial <br />
                                    por temporada <br /></p>
                                <p className='text-xl pl-10 mt-20'>Detalhamento Resultado {meses[props.mes - 1]}.{props.ano}</p>
                            </div>
                            <div className='flex justify-center items-center'>
                                <img src={ph} alt="" className='w-20 h-fit drop-shadow' />
                            </div>
                        </section>
                        <section className={`grid grid-cols-2 mt-5`}>
                            <div className='pl-10 grid gap-5'>
                                <p className='text-xl w-96'>{endereco}</p>
                                <p className='text-xl'>{('0' + new Date().getDate()).slice(-2)} de {meses[new Date().getMonth()]} de {new Date().getFullYear()}</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='tracking-widest font-semibold'>{nome}</p>
                                <img src={acIMG} alt="" className='w-fit h-44 drop-shadow' />
                            </div>
                        </section>
                    </section>
                    <section className={`flex flex-col justify-between p-10 bg-gradient-to-t h-screen relative from-white to-emerald-100`}>
                        <div className='flex items-center absolute top-1 right-1 gap-2'>
                            <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                            <p className='text-primary font-bold text-lg tracking-tight'>prohost</p>
                        </div>
                        <p className='text-3xl'>Agenda</p>
                        <hr className='brightness-0 my-5' />
                        <section className='px-5 flex flex-col'>
                            <div className='flex items-center gap-5 self-start'>
                                <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                                    {dash}
                                </div>
                                <p className='bg-slate-400 text-white px-5 py-1 w-fit'>Detalhamento do Resultado {meses[props.mes - 1]}.{props.ano} e Distribuição dos Valores</p>
                            </div>
                            <div className='flex items-center gap-5 self-end'>
                                <p className='bg-zinc-700 text-white px-5 py-1 w-fit'>Dados de Desempenho e Histórico</p>
                                <div className='bg-zinc-700 rounded-full w-fit h-fit p-2'>
                                    {medidor}
                                </div>
                            </div>
                            <div className='flex items-center gap-5 self-start'>
                                <div className='bg-indigo-700 rounded-full w-fit h-fit p-2'>
                                    {stonks}
                                </div>
                                <p className='bg-indigo-700 text-white px-5 py-1 w-fit'>Estimativa Faturamento {meses[new Date().getMonth()]}.{new Date().getFullYear()}</p>
                            </div>
                            <div className='flex items-center gap-5 self-end'>
                                <p className='bg-[#c79d33] text-white px-5 py-1 w-fit'>Status e Próximos Passos</p>
                                <div className='bg-[#c79d33] rounded-full w-fit h-fit p-2'>
                                    {pause}
                                </div>
                            </div>
                        </section>
                    </section>
                    <div className='relative'>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 0 ? !e : e))
                            setEditPages(error)
                        }} className={`absolute left-3 top-1 py-1 px-2 z-20 ${editPages[0] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[0] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section className={`${!editPages[0] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 bg-gradient-to-t h-screen
                    from-white to-emerald-100 relative`}>
                            <div className='flex items-center absolute top-1 right-1 gap-2'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-primary font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p className='text-3xl'>Dados das Reservas {meses[props.mes - 1]}.{props.ano}</p>
                            <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                                <div className='w-full h-1 bg-slate-400'></div>
                                <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                                    {dash}
                                </div>
                            </div>
                            <section className='grid grid-cols-3 gap-10'>
                                <div className='col-span-2'>
                                    <CalendarioR
                                        data={`${props.ano}-${('0' + props.mes).slice(-2)}-01 00:00:00`}
                                        reservas={reservas} />
                                </div>
                                <ul className='flex flex-col mt-24 gap-5'>
                                    <li className='flex gap-3'>
                                        <span className='text-2xl'>&#11162;</span>
                                        <span className='text-xl'>Ocupação do Imóvel</span>
                                        <span className='text-xl text-sky-600 font-semibold'>{dadosReserva.ocupacao_do_imovel.toFixed(1)}%</span>
                                    </li>
                                    <li className='flex gap-3'>
                                        <span className='text-2xl'>&#11162;</span>
                                        <span className='text-xl'>Quantidade de novas reservas</span>
                                        <span className='text-xl text-sky-600 font-semibold'>{dadosReserva.novas_reservas}</span>
                                    </li>
                                    <li className='flex gap-3'>
                                        <span className='text-2xl'>&#11162;</span>
                                        <span className='text-xl'>Faturamento</span>
                                        <span className='text-xl text-sky-600 font-semibold'>R$ {new Intl.NumberFormat('pt-BR', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(dadosReserva.faturamento))}</span>
                                    </li>
                                </ul>
                            </section>

                        </section>
                    </div>
                    <div className='relative'>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 1 ? !e : e))
                            setEditPages(error)
                        }} className={`absolute left-3 top-1 py-1 px-2 z-20 ${editPages[1] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[1] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section className={`${!editPages[1] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 bg-gradient-to-t h-screen
                    from-white to-emerald-100 relative`}>
                            <div className='flex items-center absolute top-1 right-1 gap-2'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-primary font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p className='text-3xl'>Dados das Reservas {meses[props.mes - 1]}.{props.ano}</p>
                            <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                                <div className='w-full h-1 bg-slate-400'></div>
                                <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                                    {dash}
                                </div>
                            </div>
                            <section className='grid'>
                                <ListaReservaR reservas={listaReservas} />
                            </section>

                        </section>
                    </div>
                    <div className='relative'>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 2 ? !e : e))
                            setEditPages(error)
                        }} className={`absolute left-3 top-1 py-1 px-2 z-20 ${editPages[2] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[2] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section className={`${!editPages[2] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 bg-gradient-to-t h-screen
                    from-white to-emerald-100 relative`}>
                            <div className='flex items-center absolute top-1 right-1 gap-2'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-primary font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p className='text-3xl'>Despesas Variáveis - {meses[props.mes - 1]}.{props.ano}</p>
                            <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                                <div className='w-full h-1 bg-slate-400'></div>
                                <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                                    {dash}
                                </div>
                            </div>
                            <div className='h-3/4 grid items-center'>
                                <DespesasR despesas={despesas} />
                            </div>
                        </section>
                    </div>
                    <div className='relative'>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 3 ? !e : e))
                            setEditPages(error)
                        }} className={`absolute left-3 top-1 py-1 px-2 z-20 ${editPages[3] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[3] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section className={`${!editPages[3] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 bg-gradient-to-t h-screen
                    from-white to-emerald-100 relative`}>
                            <div className='flex items-center absolute top-1 right-1 gap-2'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-primary font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p className='text-3xl'>Desempenho - Histórico de Faturamento</p>
                            <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                                <div className='w-full h-1 bg-zinc-600'></div>
                                <div className='bg-zinc-600 rounded-full w-fit h-fit p-2'>
                                    {medidor}
                                </div>
                            </div>
                            <section className='flex justify-around mt-16'>
                                <div>
                                    <div className='text-center w-40'>FATURAMENTO DO PERÍODO</div>
                                    <div className='text-end text-2xl text-blue-600'><span className='text-base pr-3'>R$</span>{new Intl.NumberFormat('pt-BR', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(Number(historicoFaturamento.faturamento_periodo))}</div>
                                </div>
                                <div className='flex items-center gap-7'>
                                    <div className='text-center w-36 text-green-600'>RENTABILIDADE DO IMÓVEL</div>
                                    <div className='flex items-center'>
                                        <div className='text-center justify-center'>FATURAMENTO DO PERÍODO <hr className='invert' /> VALOR DO IMÓVEL</div>
                                        <div className='w-28 h-28 bg-green-600 flex justify-center items-center rounded-full text-3xl text-white'>{((Number(historicoFaturamento.faturamento_periodo) / Number(valorImovel)) * 100).toFixed(1)}%</div>
                                    </div>
                                </div>
                            </section>
                            {historicoFaturamento.faturamento_despesa.length > 0 &&
                                <HistoricoFaturamento
                                    mes={props.mes}
                                    dadosFaturamento={historicoFaturamento.faturamento_despesa.map(e => (Number(e.receita)))}
                                    dadosDespesa={historicoFaturamento.faturamento_despesa.map(e => (Number(e.despesa)))} />}
                            <p>*Valor do imóvel estimado em R$ {new Intl.NumberFormat('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(Number(valorImovel))}</p>
                        </section>
                    </div>
                    <div className='relative'>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 4 ? !e : e))
                            setEditPages(error)
                        }} className={`absolute left-3 top-1 py-1 px-2 z-20 ${editPages[4] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[4] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section className={`${!editPages[4] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 bg-gradient-to-t h-screen
                    from-white to-emerald-100 relative`}>
                            <div className='flex items-center absolute top-1 right-1 gap-2'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-primary font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p className='text-3xl'>Desempenho - Comparativo Faturamento Mensal</p>
                            <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                                <div className='w-full h-1 bg-zinc-600'></div>
                                <div className='bg-zinc-600 rounded-full w-fit h-fit p-2'>
                                    {stonks}
                                </div>
                            </div>
                            {historicoFaturamento.faturamento_despesa.length > 0 &&
                                <ComparativoResultados
                                    mes={props.mes}
                                    dadosAtuais={historicoFaturamento.faturamento_despesa.map(e => (Number(e.receita)))}
                                    dadosAnteriores={historicoFaturamento.faturamento_despesa.map(e => (Number(e.receita_ano_anterior)))}
                                />}
                        </section>
                    </div>
                    <div className='relative'>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 5 ? !e : e))
                            setEditPages(error)
                        }} className={`absolute left-3 top-1 py-1 px-2 z-20 ${editPages[5] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[5] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section className={`${!editPages[5] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 bg-gradient-to-t h-screen
                    from-white to-emerald-100 relative`}>
                            <div className='flex items-center absolute top-1 right-1 gap-2'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-primary font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p className='text-3xl'>Resultado da acomodação</p>
                            <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                                <div className='w-full h-1 bg-slate-400'></div>
                                <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                                    {dash}
                                </div>
                            </div>
                            <section className="grid gap-5 mb-10 grid-cols-2">
                                <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center py-3">
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
                                </div>
                                <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center py-3">
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
                                </div>
                                <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center py-3">
                                    <div className="bg-[#FCE0E1] rounded-md w-fit py-2 px-2 ml-4">
                                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ED3E44"><path d="M17.5049 21.0027C15.5719 21.0027 14.0049 19.4357 14.0049 17.5027C14.0049 15.5697 15.5719 14.0027 17.5049 14.0027C19.4379 14.0027 21.0049 15.5697 21.0049 17.5027C21.0049 19.4357 19.4379 21.0027 17.5049 21.0027ZM17.5049 19.0027C18.3333 19.0027 19.0049 18.3312 19.0049 17.5027C19.0049 16.6743 18.3333 16.0027 17.5049 16.0027C16.6765 16.0027 16.0049 16.6743 16.0049 17.5027C16.0049 18.3312 16.6765 19.0027 17.5049 19.0027ZM6.50488 10.0027C4.57189 10.0027 3.00488 8.43574 3.00488 6.50275C3.00488 4.56975 4.57189 3.00275 6.50488 3.00275C8.43788 3.00275 10.0049 4.56975 10.0049 6.50275C10.0049 8.43574 8.43788 10.0027 6.50488 10.0027ZM6.50488 8.00275C7.33331 8.00275 8.00488 7.33117 8.00488 6.50275C8.00488 5.67432 7.33331 5.00275 6.50488 5.00275C5.67646 5.00275 5.00488 5.67432 5.00488 6.50275C5.00488 7.33117 5.67646 8.00275 6.50488 8.00275ZM19.076 3.51747L20.4902 4.93168L4.93382 20.488L3.5196 19.0738L19.076 3.51747Z"></path></svg>
                                    </div>
                                    <div className="flex flex-col ml-4">
                                        <p className="flex flex-col text-zinc-400 font-medium text-sm">Comissão das Plataformas</p>
                                        <div className="flex items-end gap-4">
                                            <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(resultadoAcomodacoes[0].comissao_plataforma))}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center py-3">
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
                                </div>
                                <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center py-3">
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
                                </div>
                                <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center py-3">
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
                                </div>
                                <div className="bg-white border-zinc-300 border rounded-lg h-full flex items-center py-3 py-3">
                                    <div className="bg-[#FEF0D0] rounded-md w-fit py-2 px-2 ml-4">
                                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FAB515"><path d="M22 11V20H20V17H4V20H2V4H4V14H12V7H18C20.2091 7 22 8.79086 22 11ZM8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13Z"></path></svg>
                                    </div>
                                    <div className="flex flex-col ml-4">
                                        <p className="flex flex-col text-zinc-400 font-medium text-sm">Diária Média</p>
                                        <div className="flex items-end gap-4">
                                            <span className="text-nowrap text-xl">R$ {new Intl.NumberFormat('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(resultadoAcomodacoes[0].diaria_media))}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </div>
                    <div className='relative'>
                        <button onClick={() => {
                            let error = editPages
                            error = (error.map((e, i) => i === 6 ? !e : e))
                            setEditPages(error)
                        }} className={`absolute left-3 top-1 py-1 px-2 z-20 ${editPages[6] ? 'bg-red-300' : 'bg-green-300'} rounded-lg pointer-events-auto`}>{editPages[6] ? 'Ocultar no relatório' : 'Mostrar no relatório'}</button>
                        <section className={`${!editPages[6] && 'pointer-events-none opacity-30'} flex flex-col justify-between p-10 bg-gradient-to-t h-screen
                    from-white to-emerald-100 relative`}>
                            <div className='flex items-center absolute top-1 right-1 gap-2'>
                                <img src={ph} alt="" className='w-4 h-fit drop-shadow' />
                                <p className='text-primary font-bold text-lg tracking-tight'>prohost</p>
                            </div>
                            <p className='text-3xl'>Status</p>
                            <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                                <div className='w-full h-1 bg-[#c79d33]'></div>
                                <div className='bg-[#c79d33] rounded-full w-fit h-fit p-2'>
                                    {pause}
                                </div>
                            </div>
                            <div className="h-[77%] grid col-span-2 gap-6">
                                <section className='flex justify-between'>
                                    <div className='h-full w-52 bg-[#c79d33] relative'>
                                        <svg className='absolute fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6177 5.9681L19.0711 4.51472L20.4853 5.92893L19.0319 7.38231C20.2635 8.92199 21 10.875 21 13C21 17.9706 16.9706 22 12 22C7.02944 22 3 17.9706 3 13C3 8.02944 7.02944 4 12 4C14.125 4 16.078 4.73647 17.6177 5.9681ZM12 20C15.866 20 19 16.866 19 13C19 9.13401 15.866 6 12 6C8.13401 6 5 9.13401 5 13C5 16.866 8.13401 20 12 20ZM11 8H13V14H11V8ZM8 1H16V3H8V1Z"></path></svg>
                                    </div>
                                    <textarea className='resize-none h-full py-2 px-2 w-3/4 border border-black'></textarea>
                                </section>
                                <section className='flex justify-between'>
                                    <div className='h-full w-52 bg-[#c79d33] relative'>
                                        <svg className='absolute fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.99974 13.0001L1.9996 11.0002L18.1715 11.0002L14.2218 7.05044L15.636 5.63623L22 12.0002L15.636 18.3642L14.2218 16.9499L18.1716 13.0002L1.99974 13.0001Z"></path></svg>
                                    </div>
                                    <textarea className='resize-none h-full py-2 px-2 w-3/4 border border-black'></textarea>
                                </section>
                            </div>
                        </section>
                    </div>
                </div>
            }
        </>
    )
}
