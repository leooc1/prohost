import { ArcElement, Chart, Legend, PieController, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(PieController, ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function QtdeHospede({ labels, dados, colors }: { labels: string[], dados: number[], colors: string[] }) {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                const data = {
                    labels: labels.map((e) => e.concat(' hospede(s)')),
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
                    plugins: {
                        legend: {
                            display: false,
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
                                    if (labels.length == 1 && labels[0] == '')
                                        return `Nenhuma reserva`
                                    else
                                        return `${context.raw} reservas`;
                                },
                            },
                        },
                        datalabels: {
                            formatter: (value: number, context: any) => {
                                const total = context.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                if (labels.length == 1 && labels[0] == '')
                                    return `0%`
                                else
                                    return `${percentage}%`;
                            },
                            color: '#000',
                            backgroundColor: '#E6ECEF',
                            borderRadius: 3,
                            font: {
                                weight: '',
                                size: 12
                            },
                        },
                    },
                };

                const myPieChart = new Chart(ctx, {
                    type: 'pie',
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
        <div className='h-40 w-full'>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};
