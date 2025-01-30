import React from 'react';

const PercentageHeart = ({ percentage }) => {
    return (
        <div className="heart-container">
            <svg width="50" height="50" viewBox="0 0 24 24" className="heart-svg">
                {/* Background heart (gray) */}
                <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#E0E0E0"
                />
                {/* Foreground heart (filled based on percentage) */}
                <defs>
                    <clipPath id="heart-clip">
                        <rect x="2" y={21.35 - ((21.35 - 3) * (percentage / 100))} width="20" height={(21.35 - 3) * (percentage / 100)} />
                    </clipPath>
                </defs>
                <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#00a8c1"
                    clipPath="url(#heart-clip)"
                />
                {/* Percentage text */}
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="6"
                    fill={"#fff"}
                    fontWeight="bold"
                >
                    {percentage}%
                </text>
            </svg>
            <style jsx>{`
                .heart-container {
                    display: inline-block;
                    position: relative;
                }
                .heart-svg {
                    display: block;
                }
            `}</style>
        </div>
    );
};

export default PercentageHeart;
