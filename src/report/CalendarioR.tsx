import { useEffect, useState } from "react"

interface propsCalendario {
    data: string
    reservas: any
}

export default function CalendarioR(props: propsCalendario) {

    const [mes, setMes] = useState<{ dia: number, diaSemana: number }[][]>([]);
    const [reservaC, setReservaC] = useState<{
        dia: number,
        hora: number,
        cor: string,
        title: string,
        tipo: string
    }[]>([]);

    function separarDias(lista: { dia: number, diaSemana: number }[]) {
        const resultado = [];
        let tempArray: { dia: number, diaSemana: number }[] = [];

        lista.forEach(item => {
            if (item.diaSemana == 0) {
                tempArray.push(item);
                resultado.push(tempArray);
                tempArray = [];
            } else {
                tempArray.push(item);
            }
        });

        if (tempArray.length > 0) {
            resultado.push(tempArray);
        }

        return resultado;
    }

    const gerarDiasDoMes = (data: string) => {
        const primeiroDia = new Date(data);
        const ano = primeiroDia.getFullYear();
        const mes = primeiroDia.getMonth();


        const ultimoDia = new Date(ano, mes + 1, 0).getDate();

        const diasDoMes = [];
        for (let dia = 1; dia <= ultimoDia; dia++) {
            const dataAtual = new Date(ano, mes, dia);
            const diaSemana = dataAtual.getDay();
            diasDoMes.push({ dia, diaSemana });
        }
        return diasDoMes;
    };

    function expandirReservas(reservas: any) {
        function gerarDias(reserva: any) {
            const inicio = new Date(reserva.start);
            const fim = new Date(reserva.end);
            const dias = [];

            for (let diaAtual = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
                diaAtual <= fim;
                diaAtual.setDate(diaAtual.getDate() + 1)) {

                dias.push({
                    dia: diaAtual.getMonth() == new Date(props.data).getMonth() ? diaAtual.getDate() : 32,
                    hora: 0,
                    cor: reserva.color,
                    title: reserva.title,
                    tipo: "middle"
                });
            }

            dias[0].hora = inicio.getHours();
            dias[0].tipo = "start";
            dias[dias.length - 1].hora = fim.getHours();
            dias[dias.length - 1].tipo = "end";

            return dias;
        }

        return reservas.flatMap(gerarDias);
    }

    useEffect(() => {
        if (props.data) {
            const dias = gerarDiasDoMes(props.data);
            const calendarDays = separarDias(dias)
            setMes(calendarDays);
        }
        if (props.reservas) {
            const resCalendar = expandirReservas(props.reservas)
            setReservaC(resCalendar)
        }
    }, [props.data, props.reservas]);

    useEffect(() => {
        for (let i = 0; i < reservaC.length; i++) {
            const reserva = reservaC[i];
            const anterior = reservaC[i - 1]; // pode ser undefined no primeiro loop

            const diaCalendario = document.getElementById(`dia-${reserva.dia}`)
            const horario = reserva.hora * 100 / 24

            const ehEndComStartAntes = reserva.tipo === 'end' && anterior?.tipo === 'start'

            if (diaCalendario) {
                diaCalendario.innerHTML += `
        <div 
            style='background-color: ${reserva.cor};
            transform: translateX(
                ${reserva.tipo == 'start' ? `${horario.toFixed(0)}%` : ''}
                ${reserva.tipo == 'end' ? `-${(100 - horario).toFixed(0)}%` : ''}
                ${reserva.tipo == 'middle' ? `0%` : ''}
            );' 
            class='bg-emerald-400 py-px absolute w-full left-0
                ${reserva.tipo == 'start' ? `rounded-l-xl` : ''} 
                ${reserva.tipo == 'end' ? `rounded-r-xl` : ''}'
            title='${reserva.title}'
        >
            <p class='whitespace-nowrap overflow-hidden text-white 
                ${reserva.tipo == 'start' ? `ml-2 text-transparent` : ''} 
                ${reserva.tipo == 'end' && !ehEndComStartAntes ? `mr-2 text-transparent` : ''} 
                ${reserva.tipo == 'middle' ? `mx-2` : ''}
            '>${reserva.title}</p>
        </div>`
            }
        }
    }, [mes])

    return (
        <div className="h-full flex flex-col justify-around">
            <table>
                <thead className="w-full">
                    <tr className="text-sm h-10">
                        <th className="text-center border border-white w-28 text-white bg-[#008374] uppercase">seg</th>
                        <th className="text-center border border-white w-28 text-white bg-[#008374] uppercase">ter</th>
                        <th className="text-center border border-white w-28 text-white bg-[#008374] uppercase">qua</th>
                        <th className="text-center border border-white w-28 text-white bg-[#008374] uppercase">qui</th>
                        <th className="text-center border border-white w-28 text-white bg-[#008374] uppercase">sex</th>
                        <th className="text-center border border-white w-28 text-white bg-[#008374] uppercase">sab</th>
                        <th className="text-center border border-white w-28 text-white bg-[#008374] uppercase">dom</th>
                    </tr>
                </thead>
                <tbody className="">
                    {mes.length > 0 &&
                        mes.map(s =>
                            <tr className="text-sm h-14">
                                <td className="border border-black bg-slate-200 relative p-0 overflow-hidden"
                                    id={`dia-${s.find(d => d.diaSemana == 1)?.dia}`}>
                                    <span className="absolute top-1 right-1">{s.find(d => d.diaSemana == 1)?.dia}</span>
                                </td>
                                <td className="border border-black bg-slate-200 relative p-0 overflow-hidden"
                                    id={`dia-${s.find(d => d.diaSemana == 2)?.dia}`}>
                                    <span className="absolute top-1 right-1">{s.find(d => d.diaSemana == 2)?.dia}</span>
                                </td>
                                <td className="border border-black bg-slate-200 relative p-0 overflow-hidden"
                                    id={`dia-${s.find(d => d.diaSemana == 3)?.dia}`}>
                                    <span className="absolute top-1 right-1">{s.find(d => d.diaSemana == 3)?.dia}</span>
                                </td>
                                <td className="border border-black bg-slate-200 relative p-0 overflow-hidden"
                                    id={`dia-${s.find(d => d.diaSemana == 4)?.dia}`}>
                                    <span className="absolute top-1 right-1">{s.find(d => d.diaSemana == 4)?.dia}</span>
                                </td>
                                <td className="border border-black bg-slate-200 relative p-0 overflow-hidden"
                                    id={`dia-${s.find(d => d.diaSemana == 5)?.dia}`}>
                                    <span className="absolute top-1 right-1">{s.find(d => d.diaSemana == 5)?.dia}</span>
                                </td>
                                <td className="border border-black bg-slate-200 relative p-0 overflow-hidden"
                                    id={`dia-${s.find(d => d.diaSemana == 6)?.dia}`}>
                                    <span className="absolute top-1 right-1">{s.find(d => d.diaSemana == 6)?.dia}</span>
                                </td>
                                <td className="border border-black bg-slate-200 relative p-0 overflow-hidden"
                                    id={`dia-${s.find(d => d.diaSemana == 0)?.dia}`}>
                                    <span className="absolute top-1 right-1">{s.find(d => d.diaSemana == 0)?.dia}</span>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <ul>
                {[
                    ...new Map(
                        props.reservas.map((r: any) => [r.canal_reserva, { canal: r.canal_reserva, cor: r.color }])
                    ).values()
                ].map((r: any) => <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: r.cor }}></div>
                    <p className="text-white font-light">{r.canal}</p>
                </li>)}
            </ul>
        </div>
    );
}