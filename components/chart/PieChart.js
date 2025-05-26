import React from 'react';
import * as Chart from 'chart.js';

const PieChart = () => {
  const data = [
    { label: 'Purple', value: 45, color: '#775DA6' },
    { label: 'Pink', value: 45, color: '#FFB1B7' },
    { label: 'Teal', value: 10, color: '#70B6C1' }
  ];

  // Calculate angles for each segment
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const segments = data.map((item) => {
    const startAngle = currentAngle;
    const angle = (item.value / total) * 360;
    currentAngle += angle;

    return {
      ...item,
      startAngle,
      endAngle: currentAngle,
      angle
    };
  });

  // Function to create SVG path for pie segment
  const createPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Function to get text position
  const getTextPosition = (centerX, centerY, radius, startAngle, endAngle) => {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = radius * 0.7;
    return polarToCartesian(centerX, centerY, textRadius, midAngle);
  };

  const centerX = 150;
  const centerY = 150;
  const radius = 120;

  return (
    <>
      <div className="traffic-container-info">
        <h6>Traffic</h6>
        <h3>March 2020</h3>
      </div>
      <div className="traffic-container-chart">
        <div className="flex items-center justify-center p-8 bg-white piechart">
          <svg viewBox="0 0 300 300" className="pie-chart-svg">
            {segments.map((segment, index) => {
              const path = createPath(centerX, centerY, radius, segment.startAngle, segment.endAngle);
              const textPos = getTextPosition(centerX, centerY, radius, segment.startAngle, segment.endAngle);

              return (
                <g key={index}>
                  <path
                    d={path}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="16"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {segment.value}%
                  </text>
                </g>
              );
            })}
          </svg>

        </div>
      </div>
    </>
  );
};

export default PieChart;