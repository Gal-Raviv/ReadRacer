import React, { useState, useEffect } from 'react';

function TutorialReading({ text, onFinish }) {
  const [time, setTime] = useState(0);
  const [isReading, setIsReading] = useState(true);

  useEffect(() => {
    if (!isReading) return;

    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [isReading]);

  const handleFinish = () => {
    setIsReading(false);
    onFinish(time);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Tutorial
        </h2>

        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200">
          {text}
        </div>

        <div className="text-sm text-gray-500">
          Time elapsed: <span className="font-mono">{time} seconds</span>
        </div>

        <button
          onClick={handleFinish}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Done Reading
        </button>
      </div>
    </div>
  );
}

export default TutorialReading;
