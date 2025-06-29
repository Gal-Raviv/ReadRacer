import React from 'react';

const Home = ({ onStartTutorial, onStartExperiment, user }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Read Racer</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Test your reading speed and comprehension. Choose between a guided tutorial or a real-time experiment with AI-generated content.
      </p>

      <div className="flex flex-col gap-4 items-center w-full max-w-xs">
        <div className="relative group w-full">
          <button
            onClick={user ? onStartExperiment : undefined}
            disabled={!user}
            className={`w-full py-4 text-lg rounded-xl shadow transition font-semibold ${
              user
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Start Experiment
          </button>
          {!user && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 text-xs text-white bg-black bg-opacity-80 rounded-md p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none text-center z-10">
              Please sign in to participate in the experiment
            </div>
          )}
        </div>

        <button
          onClick={onStartTutorial}
          className="w-3/4 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Start Tutorial
        </button>
      </div>
    </div>
  );
};

export default Home;
