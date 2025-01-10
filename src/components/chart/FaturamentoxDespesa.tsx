import { BarController, BarElement, CategoryScale, LinearScale, Chart, Legend, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ChartDataLabels);

export default function FaturamentoxDespesa({mes, dadosAtuais, dadosPassado}:{mes:number, dadosAtuais:number[], dadosPassado:number[]}) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    function ordenarMeses(numero:number) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const indiceInicio = (numero + 1) % meses.length;
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
                            backgroundColor: '#033C50',
                            borderRadius: 5
                        },
                        {
                            label: 'Despesas do Ano',
                            data: dadosPassado,
                            backgroundColor: '#ED3E44',
                            borderRadius: 5
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
                            }
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
                                    return `R$ ${context.raw}`;
                                },
                            },
                        },
                        datalabels: {
                            display: function (context: any) {
                                return context.dataset.data[context.dataIndex] != 0;
                            },
                            formatter: (value: number) => {
                                return value.toString();
                            },
                            color: '#000',
                            anchor: 'end', 
                            align: 'bottom',  
                            backgroundColor: '#E6ECEF',
                            borderRadius: 2,
                            font: {
                                weight: 'medium',
                                size: 6
                            },
                        }
                    },
                };

                const myBarChart = new Chart(ctx, {
                    type: 'bar',
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
