import React, { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom Tooltip to show key info only
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white p-2 rounded shadow border text-sm">
        {payload.map((entry, index) => {
          const data = entry.payload ?? {};
          const isAverage = entry.name?.toLowerCase().includes("avg");

          return (
            <div key={index} className="mb-2 border-b last:border-b-0 pb-1">
              {isAverage && (
                <p className="text-xs text-red-600 font-semibold mb-1">
                  {entry.name.includes("Personal") ? "Personal Average" : "Global Average"}
                </p>
              )}
              <p>
                <strong>Reading Speed:</strong>{" "}
                {Math.round(data.value ?? data.readingSpeed ?? 0)} WPM
              </p>
              <p>
                <strong>Accuracy:</strong>{" "}
                {((data.accuracy ?? 0) * 100).toFixed(1)}%
              </p>
              {typeof data.points === "number" && (
                <p>
                  <strong>Points:</strong> {data.points.toFixed(2)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const PersonalResults = ({ userId }) => {
  const [summaryAttempts, setSummaryAttempts] = useState([]);
  const [fullPassageAttempts, setFullPassageAttempts] = useState([]);
  const [personalAverages, setPersonalAverages] = useState({ summary: null, full: null });
  const [globalAverages, setGlobalAverages] = useState({ summary: null, full: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("effective");

  // Show/hide toggles for averages only
  const [showPersonalAvg, setShowPersonalAvg] = useState(false);
  const [showGlobalAvg, setShowGlobalAvg] = useState(false);

  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://read-racer.azurewebsites.net/api/getUserResults?userId=${encodeURIComponent(userId)}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const results = Array.isArray(data) ? data : data.results || [];
        const summary = results.filter(
          (r) => r.useSummary === true || r.useSummary === "true" || r.useSummary === "True"
        );
        const full = results.filter(
          (r) => !(r.useSummary === true || r.useSummary === "true" || r.useSummary === "True")
        );

        setSummaryAttempts(summary);
        setFullPassageAttempts(full);

        // Set personal averages from user data
        setPersonalAverages({
          summary: data.summaryAvg || null,
          full: data.passageAvg || null,
        });

        // Fetch global averages separately for showing global avg stars
        const globalRes = await fetch(
          `https://read-racer.azurewebsites.net/api/getGlobalStats`
        );
        if (!globalRes.ok) throw new Error(`Global stats HTTP error! status: ${globalRes.status}`);
        const globalData = await globalRes.json();

        setGlobalAverages({
          summary: globalData.summaryAvg || null,
          full: globalData.passageAvg || null,
        });
      } catch (err) {
        console.error("Failed to load results:", err);
        setError(err.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  if (!userId) return <p>Please log in to see your personal results.</p>;
  if (loading) return <p>Loading your results...</p>;
  if (error) return <p className="text-red-600 font-semibold">Error: {error}</p>;

  // Prepare personal attempts data (always shown)
  const summaryData = summaryAttempts.map((a, index) => ({
    id: index,
    value:
      mode === "effective"
        ? a.effectiveWPM ?? a.realWPM ?? a.readingSpeed ?? 0
        : a.realWPM ?? a.effectiveWPM ?? a.readingSpeed ?? 0,
    accuracy: a.total > 0 ? a.score / a.total : 0,
    points: a.points ?? null,
  }));

  const passageData = fullPassageAttempts.map((a, index) => ({
    id: index + 10000,
    value: a.realWPM ?? a.readingSpeed ?? 0,
    accuracy: a.total > 0 ? a.score / a.total : 0,
    points: a.points ?? null,
  }));

  // Prepare averages values
  const personalSummaryAvgValue =
    mode === "effective"
      ? personalAverages.summary?.effectiveWPM ?? personalAverages.summary?.realWPM ?? personalAverages.summary?.readingSpeed ?? 0
      : personalAverages.summary?.realWPM ?? personalAverages.summary?.effectiveWPM ?? personalAverages.summary?.readingSpeed ?? 0;

  const personalPassageAvgValue =
    personalAverages.full?.realWPM ?? personalAverages.full?.readingSpeed ?? 0;

  const globalSummaryAvgValue =
    mode === "effective"
      ? globalAverages.summary?.effectiveWPM ?? globalAverages.summary?.realWPM ?? globalAverages.summary?.readingSpeed ?? 0
      : globalAverages.summary?.realWPM ?? globalAverages.summary?.effectiveWPM ?? globalAverages.summary?.readingSpeed ?? 0;

  const globalPassageAvgValue =
    globalAverages.full?.realWPM ?? globalAverages.full?.readingSpeed ?? 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center">Your Personal Results</h2>

      {/* Controls: toggles for averages and mode */}
      <div className="mb-4 flex flex-wrap justify-center items-center gap-6">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showPersonalAvg}
            onChange={() => setShowPersonalAvg((prev) => !prev)}
            className="form-checkbox h-5 w-5 rounded"
            style={{ accentColor: "#2563eb" }}
          />
          <span>Show Personal Averages</span>
        </label>

        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showGlobalAvg}
            onChange={() => setShowGlobalAvg((prev) => !prev)}
            className="form-checkbox h-5 w-5 rounded"
            style={{ accentColor: "#2563eb" }}
          />
          <span>Show Global Averages</span>
        </label>

        <label className="inline-flex items-center space-x-2 ml-auto">
          <span className="font-semibold">Select Graph Mode:</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border rounded p-1"
          >
            <option value="effective">Effective WPM (AI Summaries)</option>
            <option value="real">Real WPM (AI Summaries)</option>
          </select>
        </label>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="value"
            name="Reading Speed (WPM)"
            unit=" WPM"
            domain={["auto", "auto"]}
          />
          <YAxis
            type="number"
            dataKey="accuracy"
            name="Accuracy"
            domain={[0, 1]}
            tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <Legend
            formatter={(value) => {
              if (value === "AI Summaries") return "AI Summaries (Attempts)";
              if (value === "Full Passage") return "Full Passage (Attempts)";
              if (value === "Avg Personal AI Summaries") return "Personal Average AI Summaries";
              if (value === "Avg Personal Full Passage") return "Personal Average Full Passage";
              if (value === "Avg Global AI Summaries") return "Global Average AI Summaries";
              if (value === "Avg Global Full Passage") return "Global Average Full Passage";
              return value;
            }}
          />

          {/* Always show personal attempts */}
          <Scatter
            name="AI Summaries"
            data={summaryData}
            fill="#3b82f6"
            shape="circle"
            dataKey={{ x: "value", y: "accuracy" }}
          />
          <Scatter
            name="Full Passage"
            data={passageData}
            fill="#10b981"
            shape="circle"
            dataKey={{ x: "value", y: "accuracy" }}
          />

          {/* Personal averages */}
          {showPersonalAvg && personalAverages.summary && (
            <Scatter
              name="Avg Personal AI Summaries"
              data={[{ value: personalSummaryAvgValue, accuracy: personalAverages.summary.accuracy ?? 0 }]}
              fill="#ef4444"
              shape="star"
              dataKey={{ x: "value", y: "accuracy" }}
            />
          )}
          {showPersonalAvg && personalAverages.full && (
            <Scatter
              name="Avg Personal Full Passage"
              data={[{ value: personalPassageAvgValue, accuracy: personalAverages.full.accuracy ?? 0 }]}
              fill="#fbbf24"
              shape="star"
              dataKey={{ x: "value", y: "accuracy" }}
            />
          )}

          {/* Global averages */}
          {showGlobalAvg && globalAverages.summary && (
            <Scatter
              name="Avg Global AI Summaries"
              data={[{ value: globalSummaryAvgValue, accuracy: globalAverages.summary.accuracy ?? 0 }]}
              fill="#a855f7"
              shape="diamond"
              dataKey={{ x: "value", y: "accuracy" }}
            />
          )}
          {showGlobalAvg && globalAverages.full && (
            <Scatter
              name="Avg Global Full Passage"
              data={[{ value: globalPassageAvgValue, accuracy: globalAverages.full.accuracy ?? 0 }]}
              fill="#f97316"
              shape="diamond"
              dataKey={{ x: "value", y: "accuracy" }}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PersonalResults;
