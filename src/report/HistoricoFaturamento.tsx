import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function HistoricoFaturamento({
  mes,
  ano,
  dadosFaturamento,
  dadosDespesa
}: {
  mes: number;
  ano: number;
  dadosFaturamento: number[];
  dadosDespesa: number[];
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
        const data: ChartData<'line', number[], string> = {
          labels: ordenarMeses(mes),
          datasets: [
            {
              type: 'line' as const,
              label: 'DESPESA TOTAL',
              data: dadosDespesa,
              borderColor: '#F0495F',
              backgroundColor: '#F0495F',
              borderWidth: 3,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              datalabels: {
                align: 'top',
                anchor: 'end',
                color: '#ED3E44',
                font: {
                  size: 10,
                  weight: 'bold'
                }
              }
            },
            {
              type: 'line' as const,
              label: 'FATURAMENTO',
              data: dadosFaturamento,
              borderColor: '#033C50',
              backgroundColor: '#033C50',
              borderWidth: 3,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              datalabels: {
                align: 'top',
                anchor: 'end',
                color: '#033C50',
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

        const chart = new Chart<any>(ctx, {
          type: 'line',
          data,
          options
        });

        return () => {
          chart.destroy();
        };
      }
    }
  }, [mes,
  ano,
  dadosFaturamento,
  dadosDespesa]);

  return (
    <div className="h-72 max-w-full bg-slate-200 rounded-lg px-1 relative">
      <div className='text-[#333] absolute left-3 top-3 font-mono font-semibold'>{ordenarMeses(mes)[0]}.{ordenarMeses(mes)[11] == 'Dez' ? ano : ano - 1} - {ordenarMeses(mes)[11]}.{ano}</div>
      <canvas ref={chartRef} style={{ maxWidth: '100%'}}></canvas>
    </div>
  );
}
