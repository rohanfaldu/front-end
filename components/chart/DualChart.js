import React, { useEffect, useRef } from 'react';
import * as Chart from 'chart.js';

const DualChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar', 'Apr',  'May',  'Jun'],
        datasets: [
          {
            label: 'Series 1',
            data: [80, 70, 50, 150, 130, 60],
            borderColor: '#FFB1B7',
            backgroundColor: '#FFB1B7',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#FFB1B7',
            pointBorderColor: '#FFB1B7',
            pointRadius: 6,
            pointHoverRadius: 8,
          },
          {
            label: 'Series 2',
            data: [60, 80, 50, 60, 70, 40],
            borderColor: '#70B6C1',
            backgroundColor: '#70B6C1',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#70B6C1',
            pointBorderColor: '#70B6C1',
            pointRadius: 6,
            pointHoverRadius: 8,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: '#f0f0f0',
              lineWidth: 1
            },
            ticks: {
              color: '#666',
              font: {
                size: 12
              }
            },
            border: {
              display: false
            }
          },
          y: {
            min: 0,
            max: 200,
            grid: {
              color: '#f0f0f0',
              lineWidth: 1
            },
            ticks: {
              color: '#666',
              font: {
                size: 12
              },
              callback: function(value) {
                if (value >= 100) {
                  return (value / 10) + 'k';
                }
                return value;
              }
            },
            border: {
              display: false
            }
          }
        },
        elements: {
          point: {
            hoverBorderWidth: 0
          }
        }
      },
      plugins: [{
        afterDraw: function(chart) {
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          
          // Draw vertical reference line at "28 Feb" (4th data point, index 3)
          const xPosition = chart.scales.x.getPixelForValue(3);
          
          ctx.save();
          ctx.strokeStyle = '#9291A';
          ctx.strokeStyle = '';
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(xPosition, chartArea.top);
          ctx.lineTo(xPosition, chartArea.bottom);
          ctx.stroke();
          ctx.restore();
        }
      }]
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-96 p-4 bg-white dual">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default DualChart;