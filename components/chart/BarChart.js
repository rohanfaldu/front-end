import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MultiGroupChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [timeFilter, setTimeFilter] = useState('monthly');

  const rawData = {
    daily: {
      labels: data?.daily?.labels || [],
      datasets: [
        {
          label: 'Likes',
          data: data?.daily?.likes || [],
          backgroundColor: '#775DA6',
          borderRadius: 20,
          borderSkipped: false
        },
        {
          label: 'Comments',
          data: data?.daily?.comments || [],
          backgroundColor: '#70B6C1',
          borderRadius: 20,
          borderSkipped: false
        },
        {
          label: 'chat',
          data: data?.daily?.chat || [],
          backgroundColor: '#FFB1B7',
          borderRadius: 20,
          borderSkipped: false
        }
      ]
    },
    weekly: {
      labels: data?.weekly?.labels || [],
      datasets: [
        {
          label: 'Likes',
          data: data?.weekly?.likes || [],
          backgroundColor: '#775DA6',
          borderRadius: 20,
          borderSkipped: false
        },
        {
          label: 'Comments',
          data: data?.weekly?.comments || [],
          backgroundColor: '#70B6C1',
          borderRadius: 20,
          borderSkipped: false
        },
        {
          label: 'chat',
          data: data?.weekly?.chat || [],
          backgroundColor: '#FFB1B7',
          borderRadius: 20,
          borderSkipped: false
        }
      ]
    },
    monthly: {
      labels: data?.monthly?.labels || [],
      datasets: [
        {
          label: 'Likes',
          data: data?.monthly?.likes || [],
          backgroundColor: '#775DA6',
          borderRadius: 20,
          borderSkipped: false
        },
        {
          label: 'Comments',
          data: data?.monthly?.comments || [],
          backgroundColor: '#70B6C1',
          borderRadius: 20,
          borderSkipped: false
        },
        {
          label: 'chat',
          data: data?.monthly?.chat || [],
          backgroundColor: '#FFB1B7',
          borderRadius: 20,
          borderSkipped: false
        }
      ]
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        stacked: false,
        grid: { display: false }
      },
      y: {
        stacked: false,
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    }
  };

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data: rawData[timeFilter],
      options: chartOptions
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [timeFilter, data]);

//   useEffect(() => {
//   const ctx = chartRef.current?.getContext('2d');
//   if (!ctx) return;

//   const currentData = rawData[timeFilter];

//   if (!currentData || currentData.labels.length === 0 || currentData.datasets.every(ds => ds.data.length === 0)) {
//     return;  // Skip if no data
//   }

//   if (chartInstance.current) {
//     chartInstance.current.destroy();
//   }

//   chartInstance.current = new ChartJS(ctx, {
//     type: 'bar',
//     data: currentData,
//     options: chartOptions
//   });

//   return () => {
//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//       chartInstance.current = null;
//     }
//   };
// }, [timeFilter, data]);


  return (
    <div className="mb-12">
      <div className="bar-chart-intro-sec">
        <div className="inner-title-sec outer-title-sec">
          <h6>Statistics</h6>
          <h3>Total Summary Of Activity</h3>
        </div>

        <div className="inner-filter-sec">
          {['daily', 'weekly', 'monthly'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`bar-filter-btn ${timeFilter === filter ? 'active' : ''}`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bar-chart-graph" style={{ height: '400px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default MultiGroupChart;
