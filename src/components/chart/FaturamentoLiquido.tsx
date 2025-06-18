import { BarController, BarElement, CategoryScale, LinearScale, Chart, Legend, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ChartDataLabels);

export default function FaturamentoLiquido({ mes, dadosAtuais, dadosPassado }: { mes: number, dadosAtuais: number[], dadosPassado: number[] }) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    function ordenarMeses(numero: number) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const indiceInicio = (numero) % meses.length;
        const primeiraParte = meses.slice(indiceInicio);
        const segundaParte = meses.slice(0, indiceInicio);
        return primeiraParte.concat(segundaParte);
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
                            data: dadosAtuais,
                            borderColor: '#033C50',
                            backgroundColor: '#033C50',
                            fill: false,
                            tension: 0.3,
                            pointRadius: 5, 
                            pointHoverRadius: 8,
                        },
                        {
                            label: 'Faturamento do Ano Anterior',
                            data: dadosPassado,
                            borderColor: '#08CE99',
                            backgroundColor: '#08CE99',
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
                                display: false
                            },
                            grace: '10%'
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            maxWidth: 200,
                            labels: {
                                boxWidth: 40,
                                boxHeight: 15,
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                    return `R$ ${new Intl.NumberFormat('pt-BR', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(context.raw)}`;
                                },
                            },
                        },
                        datalabels: {
                            display: function (context: any) {
                                return context.dataset.data[context.dataIndex] != 0;
                            },
                            formatter: (value: number) => {
                                return `R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)}`;
                            },
                            color: '#000',
                            anchor: 'end',
                            align: 'top',
                            backgroundColor: '',
                            borderRadius: 2,
                            font: {
                                weight: 'medium',
                                size: 6
                            },
                        }
                    },
                };

                const myBarChart = new Chart(ctx, {
                    // type: 'bar',
                    type: 'line',
                    data: data,
                    options: options,
                });

                return () => {
                    myBarChart.destroy();
                };
            }
        }
    }, []);

    return (
        <div className='h-72 w-full'>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
