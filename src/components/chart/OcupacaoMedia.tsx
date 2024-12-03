import { ArcElement, Chart, Legend, PieController, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(PieController, ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function OcupacaoMedia({ dados }: { dados: number[] }) {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                const data = {
                    labels: ['Ocupado', 'Ocioso'],
                    datasets: [
                        {
                            data: [Number(dados), 100 - Number(dados)],
                            backgroundColor: ['#00D19A', '#f2f2f2'],
                            hoverBackgroundColor: ['#00D19A', '#f2f2f2'],
                            borderRadius: 4
                        },
                    ],
                };

                const options: any = {
                    circumference: 180,
                    rotation: -90,
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '90%',
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                    const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                                    const percentage = ((context.raw / total) * 100).toFixed(1);
                                    return `${percentage} %`;
                                },
                            },
                        },
                        datalabels: {
                            display: false
                        }
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
        <div className='h-28 w-48'>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};
