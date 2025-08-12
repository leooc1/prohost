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
    dadosAtuais,
    dadosAnteriores
}: {
    mes: number;
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
              label: 'FATURAMENTO',
              data: dadosAtuais,
              backgroundColor: 'rgba(46, 97, 164, 0.8)',
              borderRadius: 6,
              datalabels: {
                align: 'end',
                anchor: 'end',
                color: '#033C50',
                font: {
                  size: 10,
                  weight: 'bold'
                }
              }
            },
            {
              type: 'bar',
              label: 'DESPESA TOTAL',
              data: dadosAnteriores,
              backgroundColor: 'rgba(180, 180, 180, 0.8)',
              borderRadius: 6,
              datalabels: {
                align: 'end',
                anchor: 'end',
                color: '#333',
                font: {
                  size: 10,
                  weight: 'bold'
                }
              }
            }
          ]
        };

        const options: any = {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: 10
          },
          plugins: {
            title: {
              display: true,
              text: 'FATURAMENTO E DESPESAS',
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
                return `${new Intl.NumberFormat('pt-BR', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value)}`;
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
    <div className="h-72 w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
