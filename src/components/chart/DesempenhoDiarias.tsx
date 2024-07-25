import { ArcElement, Chart, Legend, PieController, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef } from 'react';

Chart.register(PieController, ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function DesempenhoDiarias({dados}:{dados:number[]}) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        const data = {
          labels: ['Reservadas', 'Ociosas (sem reserva)', 'Indisponíveis'],
          datasets: [
            {
              data: dados,
              backgroundColor: ['#2CCCA1', '#F24158', '#585555'],
              hoverBackgroundColor: ['#2CCCA1', '#F24158', '#585555'],
            },
          ],
        };

        const options: any = {
          responsive: true,
          maintainAspectRatio: false,
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
                  return `${context.raw} diárias`;
                },
              },
            },
            datalabels: {
              formatter: (value: number, context: any) => {
                const total = context.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${percentage}%`;
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
    <div className='h-28 w-full'>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};
