import { ArcElement, Chart, Legend, PieController, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(PieController, ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function FaturamentoCanal({ labels, dados, colors }: { labels: string[], dados: number[], colors: string[] }) {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                const data = {
                    labels: labels,
                    datasets: [
                        {
                            data: dados,
                            backgroundColor: colors,
                            hoverBackgroundColor: colors,
                        },
                    ],
                };

                const options: any = {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
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
                                    return `R$ ${context.raw.toFixed(2)}`;
                                },
                            },
                        },
                        datalabels: {
                            formatter: (value: number) => {
                                return `R$ ${value.toFixed(2)}`;
                            },
                            color: '#000',
                            backgroundColor: '#E6ECEF',
                            borderRadius: 3,
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

                // Cleanup function to destroy the chart instance when the component is unmounted
                return () => {
                    myPieChart.destroy();
                };
            }
        }
    }, []);

    return (
        <div className='max-h-52 w-full'>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};
