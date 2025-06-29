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
                  Global Average
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

const GlobalStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("effective"); // "effective" or "real"

  // Toggle for showing all global averages (stars)
  const [showGlobalAvg, setShowGlobalAvg] = useState(true);

  useEffect(() => {
    fetch("https://read-racer.azurewebsites.net/api/getGlobalStats")
      .then((res) => res.json())
      .then((json) => {
        setData({
          summary: json.summaryAttempts || [],
          passage: json.passageAttempts || [],
          summaryAvg: json.summaryAvg,
          passageAvg: json.passageAvg,
          leaderboardSummary: json.leaderboardSummary || [],
          leaderboardPassage: json.leaderboardPassage || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch global stats:", err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center p-6">Loading global stats...</div>;
  if (error)
    return <div className="text-center p-6 text-red-500">{error}</div>;

  // Prepare participant attempts data (always shown)
  const summaryData = data.summary.map((a) => ({
    value:
      mode === "effective"
        ? a.effectiveWPM ?? a.realWPM ?? a.readingSpeed ?? 0
        : a.realWPM ?? a.effectiveWPM ?? a.readingSpeed ?? 0,
    accuracy: a.accuracy ?? 0,
    points: a.points ?? null,
  }));

  const passageData = data.passage.map((a) => ({
    value: a.realWPM ?? a.readingSpeed ?? 0,
    accuracy: a.accuracy ?? 0,
    points: a.points ?? null,
  }));

  // Prepare global average values
  const summaryAvgValue =
    mode === "effective"
      ? data.summaryAvg?.effectiveWPM ?? data.summaryAvg?.realWPM ?? data.summaryAvg?.readingSpeed ?? 0
      : data.summaryAvg?.realWPM ?? data.summaryAvg?.effectiveWPM ?? data.summaryAvg?.readingSpeed ?? 0;

  const passageAvgValue =
    data.passageAvg?.realWPM ?? data.passageAvg?.readingSpeed ?? 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center">Global Experiment Stats</h2>

      {/* Controls: Single checkbox for global averages and mode selector */}
      <div className="mb-4 flex flex-wrap justify-center items-center gap-6">
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

      {/* Combined Scatter Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2 text-indigo-700">
          {mode === "effective"
            ? "Effective WPM (AI Summaries) vs Reading Speed (Full Passage)"
            : "Real WPM (AI Summaries) vs Reading Speed (Full Passage)"}
        </h3>
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
                if (value === "AI Summaries") return "AI Summaries (Participants)";
                if (value === "Full Passage") return "Full Passage (Participants)";
                if (value === "Avg AI Summaries") return "Average AI Summaries";
                if (value === "Avg Full Passage") return "Average Full Passage";
                return value;
              }}
            />

            {/* Participant Attempts - always visible */}
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

            {/* Global averages toggled by one checkbox */}
            {showGlobalAvg && data.summaryAvg && (
              <Scatter
                name="Avg AI Summaries"
                data={[{ value: summaryAvgValue, accuracy: data.summaryAvg.accuracy ?? 0 }]}
                fill="#ef4444"
                shape="star"
                dataKey={{ x: "value", y: "accuracy" }}
              />
            )}
            {showGlobalAvg && data.passageAvg && (
              <Scatter
                name="Avg Full Passage"
                data={[{ value: passageAvgValue, accuracy: data.passageAvg.accuracy ?? 0 }]}
                fill="#fbbf24"
                shape="star"
                dataKey={{ x: "value", y: "accuracy" }}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboards */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Leaderboard — AI Summaries (Top 10 by Points)</h3>
        <table className="w-full border rounded-xl overflow-hidden text-left mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Points</th>
              <th className="py-2 px-4">Speed (WPM)</th>
              <th className="py-2 px-4">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {data.leaderboardSummary.slice(0, 10).map((entry, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 font-bold">#{index + 1}</td>
                <td className="py-2 px-4 font-mono text-sm">{entry.userName || "Anonymous"}</td>
                <td className="py-2 px-4">{entry.points.toFixed(2)}</td>
                <td className="py-2 px-4">{Math.round(entry.readingSpeed ?? entry.realWPM ?? 0)}</td>
                <td className="py-2 px-4">{((entry.accuracy ?? 0) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mb-3">Leaderboard — Full Passages (Top 10 by Points)</h3>
        <table className="w-full border rounded-xl overflow-hidden text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Points</th>
              <th className="py-2 px-4">Speed (WPM)</th>
              <th className="py-2 px-4">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {data.leaderboardPassage.slice(0, 10).map((entry, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 font-bold">#{index + 1}</td>
                <td className="py-2 px-4 font-mono text-sm">{entry.userName || "Anonymous"}</td>
                <td className="py-2 px-4">{entry.points.toFixed(2)}</td>
                <td className="py-2 px-4">{Math.round(entry.readingSpeed ?? entry.realWPM ?? 0)}</td>
                <td className="py-2 px-4">{((entry.accuracy ?? 0) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GlobalStats;
