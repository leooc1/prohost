import { LineController, LineElement, PointElement, CategoryScale, LinearScale, Chart, Legend, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ChartDataLabels);

export default function FaturamentoDespesas({ mes, dadosLucros, dadosDespesas }: { mes: number, dadosLucros:number[], dadosDespesas:number[] }) {
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
                            label: 'Faturamento do Ano',
                            data: dadosLucros,
                            borderColor: '#033C50',
                            backgroundColor: '#033C50',
                            fill: false,
                            tension: 0.3,
                            pointRadius: 5, 
                            pointHoverRadius: 8,
                        },
                        {
                            label: 'Despesas do Ano',
                            data: dadosDespesas,
                            borderColor: '#ED3E44',
                            backgroundColor: '#ED3E44',
                            fill: false,
                            tension: 0.3,
                            pointRadius: 5, 
                            pointHoverRadius: 8,
                        }
                    ]
                };

                const options: any = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                display: false,
                            },
                            grid: {
                                display: false,
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            maxWidth: 200,
                            labels: {
                                boxWidth: 40,
                                boxHeight: 15,
                            },
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                    return `${context.raw}`;
                                },
                            },
                        },
                        datalabels: {
                            display: function (context: any) {
                                return context.dataset.data[context.dataIndex] !== 0;
                            },
                            formatter: (value: number) => {
                                return value.toString();
                            },
                            color: '#000',
                            anchor: 'end',
                            align: 'bottom',
                            backgroundColor: '#E6ECEF',
                            borderRadius: 3,
                            font: {
                                weight: 'medium',
                                size: 6,
                            },
                        },
                    },
                };

                const myLineChart = new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: options,
                });

                return () => {
                    myLineChart.destroy();
                };
            }
        }
    }, [mes]);

    return (
        <div className='h-fit w-full'>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
