import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function ComparativoResultados({
    mes,
    ano,
    dadosAtuais,
    dadosAnteriores
}: {
    mes: number;
    ano: number;
    dadosAtuais: number[];
    dadosAnteriores: number[];
}) {
    const chartRef = useRef<HTMLCanvasElement>(null);

    function ordenarMeses(numero: number) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const indiceInicio = numero % meses.length;
        return meses.slice(indiceInicio).concat(meses.slice(0, indiceInicio));
    }

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                const data = {
                    labels: ordenarMeses(mes),
                    datasets: [
                        {
                            type: 'bar',
                            label: 'PERÍODO ANTERIOR',
                            data: dadosAnteriores,
                            backgroundColor: '#08FAB8',
                            borderRadius: 6,
                            datalabels: {
                                backgroundColor: '#08FAB8',
                                borderRadius: 5,
                                align: 'end',
                                anchor: 'end',
                                color: '#000',
                                font: {
                                    size: 10,
                                }
                            }
                        },
                        {
                            type: 'bar',
                            label: 'PERÍODO',
                            data: dadosAtuais,
                            backgroundColor: '#003447',
                            borderRadius: 6,
                            datalabels: {
                                backgroundColor: '#003447',
                                borderRadius: 5,
                                align: 'end',
                                anchor: 'end',
                                color: '#fff',
                                font: {
                                    size: 10,
                                }
                            }
                        }
                    ]
                } as any

                const options: any = {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: 10
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'COMPARATIVO FATURAMENTO MENSAL',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            color: '#333',
                            padding: {
                                top: 10,
                                bottom: 20
                            }
                        },
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                boxWidth: 15,
                                font: {
                                    size: 11
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                    return `${new Intl.NumberFormat('pt-BR', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(context.raw)}`;
                                }
                            }
                        },
                        datalabels: {
                            formatter: (value: number) => {
                                return `${Number(new Intl.NumberFormat('pt-BR', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(value)).toFixed(1)} mil`;
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value: any) {
                                    return `${value}`;
                                },
                                color: '#666',
                                font: {
                                    size: 10
                                }
                            },
                            grace: '10%'
                        }
                    }
                };

                const chart = new Chart(ctx, {
                    type: 'bar',
                    data,
                    options
                });

                return () => {
                    chart.destroy();
                };
            }
        }
    }, [mes, dadosAtuais, dadosAnteriores]);

    return (
        <div className="h-full w-full mt-20 bg-slate-200 rounded-lg relative">
            <div className='text-[#333] absolute left-3 top-3 font-mono font-semibold'>{ordenarMeses(mes)[0]}.{ano - 1} - {ordenarMeses(mes)[11]}.{ano}</div>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
