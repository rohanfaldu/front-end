import React, { useEffect, useRef } from 'react';
import * as Chart from 'chart.js';

// Register Chart.js components
Chart.Chart.register(
  Chart.ArcElement,
  Chart.DoughnutController,
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.PointElement,
  Chart.LineElement,
  Chart.Title,
  Chart.Tooltip,
  Chart.Legend
);

const SemicircularProgressChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const percentage = 72;
    const converted = 24400;

    chartRef.current = new Chart.Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [percentage, 100 - percentage],
          backgroundColor: ['#5fb3b3', '#e6f0ff'],
          borderWidth: 0,
          cutout: '75%',
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        animation: {
          animateRotate: true,
          duration: 1500
        }
      },
      plugins: [{
        afterDraw: function (chart) {
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2 + 20;

          // Draw the main percentage text
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#2d3748';
          ctx.font = 'bold 48px Arial';
          ctx.fillText(`${percentage}%`, centerX, centerY - 20);

          // Draw the "Converted" label
          ctx.font = '16px Arial';
          ctx.fillStyle = '#666';
          ctx.fillText(`Converted: ${converted.toLocaleString()}`, centerX, centerY + 25);

          // Draw the "/" divider line at 72% position
          // Since rotation is 270° and circumference is 180°, we need to calculate properly
          // 270° rotation means we start from the left (180°)
          // The semicircle goes from 180° to 360° (or 0°)
          const startAngle = Math.PI; // 180 degrees
          const totalAngle = Math.PI; // 180 degrees for semicircle
          const progressAngle = startAngle + (percentage / 100) * totalAngle;
          
          // Get the chart's outer and inner radius
          const meta = chart.getDatasetMeta(0);
          const outerRadius = meta.data[0].outerRadius;
          const innerRadius = meta.data[0].innerRadius;
          
          // Calculate line start and end points (extending slightly beyond the arc)
          const lineStartX = centerX + Math.cos(progressAngle) * (innerRadius - 10);
          const lineStartY = centerY + Math.sin(progressAngle) * (innerRadius - 10);
          const lineEndX = centerX + Math.cos(progressAngle) * (outerRadius + 10);
          const lineEndY = centerY + Math.sin(progressAngle) * (outerRadius + 10);
          console.log(lineStartX,' >> lineStartX >>', lineStartY,'>>> lineStartY >>>', lineEndX, ' >>> lineEndX >>', lineEndY, '>>>> lineEndY >>>' )
          // Draw the "/" divider line
          ctx.beginPath();
          ctx.moveTo(230,100);
          ctx.lineTo(250,74);
          ctx.strokeStyle = '#004169';
          ctx.lineWidth = 10;
          ctx.lineCap = 'round';
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
    <div className="w-full h-80 p-8 bg-white flex items-center justify-center">
      <div className="w-72 h-72">
        <div className="semicirclechart">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default SemicircularProgressChart;