import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ message = "Generating your reading content..." }) => {
  return (
    <div className="loading-container">
      <svg
        className="track"
        viewBox="0 0 1000 200"
        width="1000"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Track path */}
        <path
          id="motionPath"
          d="M 50 150 Q 250 0 500 100 Q 750 200 950 50"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />

        {/* Moving car image */}
        <g>
          <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
            <mpath href="#motionPath" />
          </animateMotion>
          <image
            href="/car.png"
            width="100"
            height="50"
            x="-50"
            y="-35"
          />
        </g>
      </svg>

      <div className="loading-text">{message}</div>
    </div>
  );
};

export default LoadingScreen;
