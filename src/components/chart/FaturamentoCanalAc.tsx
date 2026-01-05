import { ArcElement, Chart, Legend, PieController, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(PieController, ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function FaturamentoCanalAc({ labels, dados, colors }: { labels: string[], dados: any[], colors: string[] }) {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                const total = dados.reduce((sum, value) => sum + value, 0);

                const data = {
                    labels: labels,
                    datasets: [
                        {
                            data: dados.map(v => Number((v).toFixed(1))),
                            backgroundColor: colors,
                            hoverBackgroundColor: colors,
                        },
                    ],
                };

                const options: any = {
                    responsive: true,
                    maintainAspectRatio: false,
                    borderRadius: 6,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            display: true,
                            position: 'left',
                            maxWidth: 200,
                            labels: {
                                boxWidth: 15,
                                boxHeight: 15,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                    const percentage = (context.raw/total * 100).toFixed(0);
                                    return `${percentage}%`;
                                },
                            },
                        },
                        datalabels: {
                            formatter: (value: number) => {
                                return `R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)}`;
                            },
                            color: '#000',
                            backgroundColor: '#E6ECEF',
                            borderRadius: 2,
                            font: {
                                weight: 'medium',
                                size: 6
                            },
                        },
                    },
                };

                const myPieChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                    options: options,
                });

                return () => {
                    myPieChart.destroy();
                };
            }
        }
    }, []);

    return (
        <div className='max-h-36 w-full'>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};
