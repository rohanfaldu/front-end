import React from 'react';

const ConversionChart = () => {
  const percentage = 72;
  const convertedValue = 24400;
  
  // Calculate the stroke-dasharray for the progress arc
  // Circumference of a semicircle (π * radius)
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex items-center justify-center p-8 bg-gray-50 min-h-screen">
      <div className="relative">
        <svg width="200" height="120" viewBox="0 0 200 120" className="transform -rotate-0">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5eacba" />
              <stop offset="100%" stopColor="#a5b4fc" />
            </linearGradient>
          </defs>
          
          {/* End dot */}
          <circle
            cx={20 + 160 * (percentage / 100)}
            cy={100 - Math.sin(Math.PI * percentage / 100) * 80}
            r="6"
            fill="#5eacba"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Text content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {percentage}%
          </div>
          <div className="text-sm text-gray-600">
            Converted: <span className="font-semibold text-gray-900">{convertedValue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionChart;