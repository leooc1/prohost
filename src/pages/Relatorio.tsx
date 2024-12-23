
const dash = <svg className='w-14 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)" > <path d="M9 2.4578V4.58152C6.06817 5.76829 4 8.64262 4 12C4 16.4183 7.58172 20 12 20C15.3574 20 18.2317 17.9318 19.4185 15H21.5422C20.2679 19.0571 16.4776 22 12 22C6.47715 22 2 17.5228 2 12C2 7.52236 4.94289 3.73207 9 2.4578ZM12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13H11V2.04938C11.3289 2.01672 11.6625 2 12 2ZM13 4.06189V11H19.9381C19.4869 7.38128 16.6187 4.51314 13 4.06189Z"></path></svg>
const medidor = <svg className='w-14 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM15.8329 7.33748C16.0697 7.17128 16.3916 7.19926 16.5962 7.40381C16.8002 7.60784 16.8267 7.92955 16.6587 8.16418C14.479 11.2095 13.2796 12.8417 13.0607 13.0607C12.4749 13.6464 11.5251 13.6464 10.9393 13.0607C10.3536 12.4749 10.3536 11.5251 10.9393 10.9393C11.3126 10.5661 12.9438 9.36549 15.8329 7.33748ZM17.5 11C18.0523 11 18.5 11.4477 18.5 12C18.5 12.5523 18.0523 13 17.5 13C16.9477 13 16.5 12.5523 16.5 12C16.5 11.4477 16.9477 11 17.5 11ZM6.5 11C7.05228 11 7.5 11.4477 7.5 12C7.5 12.5523 7.05228 13 6.5 13C5.94772 13 5.5 12.5523 5.5 12C5.5 11.4477 5.94772 11 6.5 11ZM8.81802 7.40381C9.20854 7.79433 9.20854 8.4275 8.81802 8.81802C8.4275 9.20854 7.79433 9.20854 7.40381 8.81802C7.01328 8.4275 7.01328 7.79433 7.40381 7.40381C7.79433 7.01328 8.4275 7.01328 8.81802 7.40381ZM12 5.5C12.5523 5.5 13 5.94772 13 6.5C13 7.05228 12.5523 7.5 12 7.5C11.4477 7.5 11 7.05228 11 6.5C11 5.94772 11.4477 5.5 12 5.5Z"></path></svg>
const stonks = <svg className='w-14 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M5 3V19H21V21H3V3H5ZM20.2929 6.29289L21.7071 7.70711L16 13.4142L13 10.415L8.70711 14.7071L7.29289 13.2929L13 7.58579L16 10.585L20.2929 6.29289Z"></path></svg>
const star = <svg className='w-14 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg>
const pause = <svg className='w-14 h-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M16 12.6667L5.77735 19.4818C5.54759 19.6349 5.23715 19.5729 5.08397 19.3431C5.02922 19.261 5 19.1645 5 19.0657V4.93426C5 4.65812 5.22386 4.43426 5.5 4.43426C5.59871 4.43426 5.69522 4.46348 5.77735 4.51823L16 11.3333V5C16 4.44772 16.4477 4 17 4C17.5523 4 18 4.44772 18 5V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V12.6667ZM7 7.73703V16.263L13.3944 12L7 7.73703Z"></path></svg>

import { useRef } from 'react'
import ph from '/prohost-logo.png'
/* import timeGridPlugin from '@fullcalendar/timegrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from "@fullcalendar/react"; */
import CalendarioR from '../report/CalendarioR';
import DespesasR from '../report/DespesasR';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

export default function Relatorio() {
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

    return (
        <>
            <button onClick={generatePDF} className='bg-red-600'>
                Baixar como PDF
            </button>
            <div className="flex flex-col" ref={pdfRef} >
                <section className='flex flex-col justify-between p-10 bg-gradient-to-b h-[966px]
                from-pink-300 to-black'>
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
                        <div></div>
                    </section>
                </section>
                <section className='flex flex-col justify-between p-10 bg-gradient-to-b h-[966px]
                from-pink-300 to-black'>
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
                            <p className='bg-red-800 text-white px-5 py-1 w-fit'>Desempenho – Média de avaliações por quesitos</p>
                            <div className='bg-red-800 rounded-full w-fit h-fit p-2'>
                                {star}
                            </div>
                        </div>
                        <div className='flex items-center gap-5 self-start'>
                            <div className='bg-[#c79d33] rounded-full w-fit h-fit p-2'>
                                {pause}
                            </div>
                            <p className='bg-[#c79d33] text-white px-5 py-1 w-fit'>Status e Próximos Passos</p>
                        </div>
                    </section>
                </section>
                <section className='flex flex-col justify-between p-10 bg-gradient-to-b h-[966px]
                from-pink-300 to-black'>
                    <p className='text-3xl'>Dados das Reservas Agosto.2024</p>
                    <div className='flex items-center'>
                        <div className='w-full h-1 bg-slate-400'></div>
                        <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                            {dash}
                        </div>
                    </div>
                    <section className='grid grid-cols-3 gap-10'>
                        <div className='col-span-2'>
                            {/* <FullCalendar
                                contentHeight={'auto'}
                                initialDate={'2024-12-01'}
                                headerToolbar={{
                                    start: '',
                                    center: '',
                                    end: 'prev,next'
                                }}
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                initialView="dayGridMonth"
                                locale={ptBrLocale}
                                //reservas que buscaria do banco
                                events={[
                                    {
                                        resourceId: '1',
                                        title: 'leonardo',
                                        start: '2024-12-02T12:00:00',
                                        end: '2024-12-05T10:00:00',
                                        hospedes: 3,
                                        color: '#90baff',
                                        id: '1',
                                        tipo: 'Reserva',
                                        obs: '',
                                        bruto: 200.00,
                                        liquido: 150.00,
                                        comissao: 50.00
                                    },
                                    {
                                        resourceId: '1',
                                        title: 'leonardo',
                                        start: '2024-12-06T12:00:00',
                                        end: '2024-12-09T10:00:00',
                                        hospedes: 3,
                                        color: '#78acff',
                                        id: '2',
                                        tipo: 'Reserva',
                                        obs: '',
                                        bruto: 200.00,
                                        liquido: 150.00,
                                        comissao: 50.00
                                    },
                                    {
                                        resourceId: '1',
                                        title: 'leonardo',
                                        start: '2024-12-09T12:00:00',
                                        end: '2024-12-16T10:00:00',
                                        hospedes: 3,
                                        color: '#4c91ff',
                                        id: '3',
                                        tipo: 'Reserva',
                                        obs: '',
                                        bruto: 200.00,
                                        liquido: 150.00,
                                        comissao: 50.00
                                    },
                                    {
                                        resourceId: '1',
                                        title: 'leonardo',
                                        start: '2024-12-17T12:00:00',
                                        end: '2024-12-21T10:00:00',
                                        hospedes: 3,
                                        color: '#307fff',
                                        id: '4',
                                        tipo: 'Reserva',
                                        obs: '',
                                        bruto: 200.00,
                                        liquido: 150.00,
                                        comissao: 50.00
                                    },
                                    {
                                        resourceId: '1',
                                        title: 'leonardo',
                                        start: '2024-12-22T12:00:00',
                                        end: '2024-12-26T10:00:00',
                                        hospedes: 3,
                                        color: '#1d74ff',
                                        id: '5',
                                        tipo: 'Reserva',
                                        obs: '',
                                        bruto: 200.00,
                                        liquido: 150.00,
                                        comissao: 50.00
                                    },
                                ]}
                                eventClick={(e) => {
                                    console.log(e);
                                }}
                                eventContent={function (arg) {
                                    const title = arg.event.title;
                                    const numGuests = arg.event.extendedProps.hospedes;
                                    const tipo = arg.event.extendedProps.tipo;
                                    const obs = arg.event.extendedProps.obs;
                                    if (tipo === 'Continuidade') {
                                        return {
                                            html: `
                                <div class='flex overflow-hidden items-center flex-nowrap p-1 h-full relative gap-4'>
                                    <svg class="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 2.54 2.54" fill-rule="#000000">
                                        <g>
                                            <circle cx="1.27" cy="1.27" r="1.27" fill="#ffffff" opacity="1" data-original="#ffffff"></circle>
                                            <g fill="#000">
                                                <path d="M1.143 1.944V.674a.127.127 0 0 1 .254 0v1.27a.127.127 0 0 1-.254 0z" fill="#30C46D" opacity="1" data-original="#30C46D"></path>
                                                <path d="M.635 1.182h1.27a.127.127 0 0 1 0 .254H.635a.127.127 0 0 1 0-.254z" fill="#30C46D" opacity="1" data-original="#30C46D"></path>
                                            </g>
                                        </g>
                                    </svg>
                                    <div class='gs-event-title'>${tipo}</div>
                                </div>
                                `
                                        };
                                    } else if (tipo === 'Indisponibilidade') {
                                        return {
                                            html: `
                                <div class='flex overflow-hidden items-center flex-nowrap p-1 h-full relative gap-4'>
                                    <svg class="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 426.667 426.667" style="enable-background:new 0 0 512 512" xml:space="preserve">
                                        <g>
                                            <path d="M213.333 0C95.467 0 0 95.467 0 213.333s95.467 213.333 213.333 213.333S426.667 331.2 426.667 213.333 331.2 0 213.333 0zM42.667 213.333c0-94.293 76.373-170.667 170.667-170.667 39.467 0 75.627 13.547 104.533 35.947L78.613 317.867c-22.4-28.907-35.946-65.067-35.946-104.534zM213.333 384c-39.467 0-75.627-13.547-104.533-35.947L348.053 108.8C370.453 137.707 384 173.867 384 213.333 384 307.627 307.627 384 213.333 384z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                        </g>
                                    </svg>
                                    <div class='gs-event-title'>${obs}</div>
                                </div>
                                `
                                        };
                                    } else {
                                        return {
                                            html: `
                                <div class='flex overflow-hidden justify-between items-center flex-nowrap py-1 px-2 h-full relative gap-4'>
                                    <div class='gs-event-title'>${title}</div>
                                    <div class='flex'>
                                        <svg class="w-5 h-fit" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                                            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                                        </svg>${numGuests}
                                    </div>
                                </div>
                                `
                                        };
                                    }
                                }}
                            /> */}
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
                                    ,]} />
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
                <section className='flex flex-col justify-between p-10 bg-gradient-to-b h-[966px]
                from-pink-300 to-black'>
                    <p className='text-3xl'>Despesas Variáveis - Agosto.2024</p>
                    <div className='flex items-center'>
                        <div className='w-full h-1 bg-slate-400'></div>
                        <div className='bg-slate-400 rounded-full w-fit h-fit p-2'>
                            {dash}
                        </div>
                    </div>
                    <DespesasR />
                </section>
            </div>
        </>
    )
}
