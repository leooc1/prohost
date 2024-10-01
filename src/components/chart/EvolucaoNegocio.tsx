import { LineController, LineElement, PointElement, CategoryScale, LinearScale, Chart, Legend, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ChartDataLabels);

export default function EvolucaoNegocio({ mes, ano, dadosLucros, dadosDespesas }: { mes: number, ano: number, dadosLucros:number[], dadosDespesas:number[] }) {
    const chartRef = useRef<HTMLCanvasElement>(null);

    function Meses(numero: number) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const indiceInicio = (numero + 1) % meses.length;
        const result = meses.slice(0, indiceInicio).map(mes => `${mes}/${ano}`);
        if (numero == 11)
            return meses;
        else
            return result;
    }

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                const data = {
                    labels: Meses(mes),
                    datasets: [
                        {
                            label: 'Lucro Acomodações Próprias',
                            data: dadosLucros,
                            borderColor: '#09CF9A',
                            backgroundColor: '#09CF9A',
                            fill: false,
                            tension: 0.3,
                            pointRadius: 5, // Tamanho normal dos pontos
                            pointHoverRadius: 8, // Tamanho dos pontos ao passar o mouse
                        },
                        {
                            label: 'Despesas do Negócio',
                            data: dadosDespesas,
                            borderColor: '#F0495F',
                            backgroundColor: '#F0495F',
                            fill: false,
                            tension: 0.3,
                            pointRadius: 5, // Tamanho normal dos pontos
                            pointHoverRadius: 8, // Tamanho dos pontos ao passar o mouse
                        },
                    ],
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
        <div className='h-64 w-full'>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
