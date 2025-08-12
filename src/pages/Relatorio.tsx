
const dash = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)" > <path d="M9 2.4578V4.58152C6.06817 5.76829 4 8.64262 4 12C4 16.4183 7.58172 20 12 20C15.3574 20 18.2317 17.9318 19.4185 15H21.5422C20.2679 19.0571 16.4776 22 12 22C6.47715 22 2 17.5228 2 12C2 7.52236 4.94289 3.73207 9 2.4578ZM12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13H11V2.04938C11.3289 2.01672 11.6625 2 12 2ZM13 4.06189V11H19.9381C19.4869 7.38128 16.6187 4.51314 13 4.06189Z"></path></svg>
const medidor = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM15.8329 7.33748C16.0697 7.17128 16.3916 7.19926 16.5962 7.40381C16.8002 7.60784 16.8267 7.92955 16.6587 8.16418C14.479 11.2095 13.2796 12.8417 13.0607 13.0607C12.4749 13.6464 11.5251 13.6464 10.9393 13.0607C10.3536 12.4749 10.3536 11.5251 10.9393 10.9393C11.3126 10.5661 12.9438 9.36549 15.8329 7.33748ZM17.5 11C18.0523 11 18.5 11.4477 18.5 12C18.5 12.5523 18.0523 13 17.5 13C16.9477 13 16.5 12.5523 16.5 12C16.5 11.4477 16.9477 11 17.5 11ZM6.5 11C7.05228 11 7.5 11.4477 7.5 12C7.5 12.5523 7.05228 13 6.5 13C5.94772 13 5.5 12.5523 5.5 12C5.5 11.4477 5.94772 11 6.5 11ZM8.81802 7.40381C9.20854 7.79433 9.20854 8.4275 8.81802 8.81802C8.4275 9.20854 7.79433 9.20854 7.40381 8.81802C7.01328 8.4275 7.01328 7.79433 7.40381 7.40381C7.79433 7.01328 8.4275 7.01328 8.81802 7.40381ZM12 5.5C12.5523 5.5 13 5.94772 13 6.5C13 7.05228 12.5523 7.5 12 7.5C11.4477 7.5 11 7.05228 11 6.5C11 5.94772 11.4477 5.5 12 5.5Z"></path></svg>
const stonks = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M5 3V19H21V21H3V3H5ZM20.2929 6.29289L21.7071 7.70711L16 13.4142L13 10.415L8.70711 14.7071L7.29289 13.2929L13 7.58579L16 10.585L20.2929 6.29289Z"></path></svg>
const star = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg>
const pause = <svg className='w-20 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M16 12.6667L5.77735 19.4818C5.54759 19.6349 5.23715 19.5729 5.08397 19.3431C5.02922 19.261 5 19.1645 5 19.0657V4.93426C5 4.65812 5.22386 4.43426 5.5 4.43426C5.59871 4.43426 5.69522 4.46348 5.77735 4.51823L16 11.3333V5C16 4.44772 16.4477 4 17 4C17.5523 4 18 4.44772 18 5V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V12.6667ZM7 7.73703V16.263L13.3944 12L7 7.73703Z"></path></svg>

import { useEffect, useRef, useState } from 'react'
import ph from '/prohost-logo.png'
/* import timeGridPlugin from '@fullcalendar/timegrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from "@fullcalendar/react"; */
import CalendarioR from '../report/CalendarioR';
import DespesasR from '../report/DespesasR';
import HistoricoFaturamento from '../report/HistoricoFaturamento'
import ComparativoResultados from '../report/ComparativoFaturamentoMensal'
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

export default function Relatorio() {
    const [editPages, setEditPages] = useState([true, true, true, true, true])
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

    useEffect(() => { }, [editPages])

    return (
        <>
            <button onClick={generatePDF} className='w-full bg-red-600 hidden'>
                Baixar como PDF
            </button>
            <div className="flex flex-col" ref={pdfRef} >
                <section className={`flex flex-col justify-between p-10 bg-gradient-to-t h-screen relative from-white to-emerald-100`}>
                    <section className={`grid grid-cols-2`}>
                        <div>
                            <p className='text-3xl text-center font-semibold'>Parceria para locação <br />
                                de imóvel residencial <br />
                                por temporada <br /></p>
                            <p className='text-xl pl-10 mt-20'>Detalhamento Resultado Agosto.2024</p>
                        </div>
                        <div className='flex justify-center items-center'>
                            <img src={ph} alt="" className='w-40 h-fit drop-shadow' />
                        </div>
                    </section>
                    <section className={`grid grid-cols-2 mt-5`}>
                        <div className='pl-10 grid gap-5'>
                            <p className='text-xl'>Avenida Visconde de Pirajá 121 Apto 701 <br />
                                CEP: 22.410-001 Rio de Janeiro - RJ</p>
                            <p className='text-xl'>05 de Setembro de 2024</p>
                        </div>
                    </section>
                </section>
                <section className={`flex flex-col justify-between p-10 bg-gradient-to-t h-screen relative from-white to-emerald-100`}>
                    <p className='text-3xl'>Agenda</p>
                    <hr className='brightness-0 my-5' />
                    <section className='px-5 flex flex-col'>
                        <div className='flex items-center gap-5 self-start'>
                            <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                                {dash}
                            </div>
                            <p className='bg-slate-400 text-white px-5 py-1 w-fit'>Detalhamento do Resultado Agosto.2024 e Distribuição dos Valores</p>
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
                            <p className='bg-indigo-700 text-white px-5 py-1 w-fit'>Estimativa Faturamento Setembro.2024</p>
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
                        <p className='text-3xl'>Dados das Reservas Agosto.2024</p>
                        <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                            <div className='w-full h-1 bg-slate-400'></div>
                            <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                                {dash}
                            </div>
                        </div>
                        <section className='grid grid-cols-3 gap-10'>
                            <div className='col-span-2'>
                                <CalendarioR
                                    data='2024-12-01 00:00:00'
                                    reservas={[
                                        {
                                            title: 'leonardo',
                                            start: '2024-12-02 12:00:00',
                                            end: '2024-12-05 10:00:00',
                                            hospedes: 3,
                                            color: '#90baff',
                                            id: '1',
                                            tipo: 'Reserva',
                                            obs: '',
                                            bruto: 0,
                                            liquido: 0,
                                            comissao: 0
                                        },
                                        {
                                            title: 'leonardo',
                                            start: '2024-12-06 12:00:00',
                                            end: '2024-12-09 10:00:00',
                                            hospedes: 3,
                                            color: '#78acff',
                                            id: '2',
                                            tipo: 'Reserva',
                                            obs: '',
                                            bruto: 0,
                                            liquido: 0,
                                            comissao: 0
                                        },
                                        {
                                            title: 'leonardo',
                                            start: '2024-12-09 12:00:00',
                                            end: '2024-12-16 10:00:00',
                                            hospedes: 3,
                                            color: '#4c91ff',
                                            id: '3',
                                            tipo: 'Reserva',
                                            obs: '',
                                            bruto: 0,
                                            liquido: 0,
                                            comissao: 0
                                        },
                                        {
                                            title: 'leonardo',
                                            start: '2024-12-17 12:00:00',
                                            end: '2024-12-24 20:00:00',
                                            hospedes: 3,
                                            color: '#4c91ff',
                                            id: '3',
                                            tipo: 'Reserva',
                                            obs: '',
                                            bruto: 0,
                                            liquido: 0,
                                            comissao: 0
                                        },
                                        {
                                            title: 'leonardo',
                                            start: '2024-12-24 15:00:00',
                                            end: '2024-12-27 11:00:00',
                                            hospedes: 3,
                                            color: '#4c91ff',
                                            id: '3',
                                            tipo: 'Reserva',
                                            obs: '',
                                            bruto: 0,
                                            liquido: 0,
                                            comissao: 0
                                        }
                                    ]} />
                            </div>
                            <ul className='flex flex-col mt-24 gap-5'>
                                <li className='flex gap-3'>
                                    <span className='text-2xl'>&#11162;</span>
                                    <span className='text-xl'>Ocupação do Imóvel</span>
                                    <span className='text-xl text-sky-600 font-semibold'>87%</span>
                                </li>
                                <li className='flex gap-3'>
                                    <span className='text-2xl'>&#11162;</span>
                                    <span className='text-xl'>Quantidade de novas reservas</span>
                                    <span className='text-xl text-sky-600 font-semibold'>6</span>
                                </li>
                                <li className='flex gap-3'>
                                    <span className='text-2xl'>&#11162;</span>
                                    <span className='text-xl'>Faturamento</span>
                                    <span className='text-xl text-sky-600 font-semibold'>R$ 22.523,33</span>
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
                        <p className='text-3xl'>Despesas Variáveis - Agosto.2024</p>
                        <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                            <div className='w-full h-1 bg-slate-400'></div>
                            <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                                {dash}
                            </div>
                        </div>
                        <DespesasR />
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
                                <div className='text-end text-2xl text-blue-600'><span className='text-base pr-3'>R$</span>313.253</div>
                            </div>
                            <div className='text-center w-36 text-green-600'>RENTABILIDADE DO IMÓVEL</div>
                            <div className='flex items-center'>
                                <div className='text-center justify-center'>FATURAMENTO DO PERÍODO <hr className='invert' /> VALOR DO IMÓVEL</div>
                                <div className='w-28 h-28 bg-green-600 flex justify-center items-center rounded-full text-3xl text-white'>20.9%</div>
                            </div>
                        </section>
                        <HistoricoFaturamento
                            mes={8}
                            dadosFaturamento={[19017, 22033, 30640, 35793, 34865, 37482, 21289, 19578, 20491, 19064, 30476, 22523]}
                            dadosDespesa={[1224, 1750, 1138, 1399, 1893, 1442, 1452, 2176, 1244, 1036, 226, 1393]} />
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
                        <p className='text-3xl'>Desempenho - Comparativo Faturamento Mensal</p>
                        <div className='flex w-11/12 items-center absolute left-1/2 -translate-x-1/2 top-16'>
                            <div className='w-full h-1 bg-zinc-600'></div>
                            <div className='bg-zinc-600 rounded-full w-fit h-fit p-2'>
                                {stonks}
                            </div>
                        </div>
                        <ComparativoResultados
                            mes={3}
                            dadosAtuais={[25943, 19017, 22033, 30640, 35793, 34865, 37482, 21289, 19578, 20491, 19064, 30476]}
                            dadosAnteriores={[19290, 37121, 23814, 22176, 34392, 36465, 37962, 21289, 19578, 20421, 19063, 28485]}
                        />
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
        </>
    )
}
