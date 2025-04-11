import React from 'react';

const PercentageHeart = ({ percentage }) => {
    return (
        <div className="heart-container">
        {/* Background Heart (Gray) */}
        <svg className="heart-svg background" viewBox="0 0 24 24">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
               2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
               C13.09 3.81 14.76 3 16.5 3
               19.58 3 22 5.42 22 8.5
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#E0E0E0"
          />
        </svg>
      
        {/* Foreground Heart (Colored) */}
        <div className="fill-mask" style={{ height: `${percentage}%` }}>
          <svg className="heart-svg foreground" viewBox="0 0 24 24">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                 C13.09 3.81 14.76 3 16.5 3
                 19.58 3 22 5.42 22 8.5
                 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#00a8c1"
            />
          </svg>
        </div>
      
        {/* Percentage Text */}
        <div className="percentage-label">{percentage}%</div>
      
        <style jsx>{`
          .heart-container {
            position: relative;
            width: 50px;
            height: 50px;
          }
          .heart-svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .fill-mask {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            overflow: hidden;
          }
          .percentage-label {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 10px;
            font-weight: bold;
            color: white;
          }
        `}</style>
      </div>
    );
};

export default PercentageHeart;
