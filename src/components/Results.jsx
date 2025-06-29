import React, { useState } from "react";
import PersonalResults from "./PersonalResults";
import GlobalResults from "./GlobalResults";

const Results = ({ user, onBackHome }) => {
  const [activeTab, setActiveTab] = useState("personal");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (!user && activeTab === "personal") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-xl text-gray-700 mb-4 font-medium">
          You must be logged in to view personal results.
        </h2>
        <button
          onClick={onBackHome}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Results</h1>
          <button
            onClick={onBackHome}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            className={`px-4 py-2 w-1/2 font-medium rounded-xl transition-all ${
              activeTab === "personal"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleTabClick("personal")}
          >
            Personal Results
          </button>

          <button
            className={`px-4 py-2 w-1/2 font-medium rounded-xl transition-all ${
              activeTab === "global"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleTabClick("global")}
          >
            Global Results
          </button>
        </div>

        <div className="pt-2">
          {activeTab === "personal" ? (
            <PersonalResults userId={user?.uuid} />
          ) : (
            <GlobalResults />
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
