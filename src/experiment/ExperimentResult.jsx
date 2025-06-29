import { useEffect, useState } from "react";
import { getOrCreateUserId } from "../utils/user";

const ExperimentResult = ({
  quizAnswers,
  readingTime,
  passageText,
  summaryText,
  useSummary,
  onBackHome,
  user,
}) => {
  // ... your existing code

  const [filteredOut, setFilteredOut] = useState(false);  // new state for filter feedback
    const { total = {}, mcq = {}, saq_laq = {} } = quizAnswers || {};

  const totalScore = total.score ?? 0;
  const totalPossible = total.total ?? ((mcq.total ?? 0) + (saq_laq.total ?? 0));

  const passageWordCount = passageText ? passageText.trim().split(/\s+/).length : 0;
  const summaryWordCount = summaryText ? summaryText.trim().split(/\s+/).length : 0;

  const realWpm = readingTime
    ? Math.round(((useSummary ? summaryWordCount : passageWordCount) / readingTime) * 60)
    : 0;

  const effectiveWpm = readingTime && passageWordCount
    ? Math.round((passageWordCount / readingTime) * 60)
    : 0;

  const points = totalPossible
    ? (totalScore / totalPossible) * effectiveWpm
    : 0;


  useEffect(() => {
    if (!quizAnswers) return;

    async function sendLog() {
      const userId = getOrCreateUserId();
      if (!userId) {
        console.warn("[ExperimentResult] Missing userId; skipping logging");
        return;
      }

      try {
        const response = await fetch(
          "https://read-racer.azurewebsites.net/api/saveExperimentResult",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              email: user?.email,
              useSummary,
              readingTime,
              effectiveWPM: effectiveWpm,
              realWPM: realWpm,
              score: totalScore,
              total: totalPossible,
              points,
              userName:
                user?.displayName ||
                localStorage.getItem("displayName") ||
                "Anonymous",
              leaderboardOptIn:
                user?.leaderboardOptIn ?? (localStorage.getItem("leaderboardOptIn") === "true"),
            }),
          }
        );

        if (!response.ok) {
          setFilteredOut(false);
        } else {
          const json = await response.json();
          if (json.success === false && json.reason) {
            setFilteredOut(true);  // flag filtered out
          } else {
            setFilteredOut(false);
          }
        }
      } catch (err) {
        setFilteredOut(false);
      }
    }

    sendLog();
  }, [quizAnswers, readingTime, passageText, summaryText]);

  if (!quizAnswers) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <p className="text-gray-600 text-lg">No quiz data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Results</h2>

        {filteredOut && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
            Your results were <strong>not saved</strong> because your reading speed
            was too high or your score was too low. Please ensure you read carefully.
          </div>
        )}

        {/* existing results display here */}
        <div className="space-y-3 text-gray-700 text-md">
          {/* ... your existing results display */}
          <div className="flex justify-between">
            <span>Multiple Choice:</span>
            <span className="font-semibold">
              {mcq.score ?? 0} / {mcq.total ?? 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Short Answer:</span>
            <span className="font-semibold">
              {saq_laq.score ?? 0} / {saq_laq.total ?? 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Score:</span>
            <span className="font-bold">
              {totalScore} / {totalPossible}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Real Reading Speed:</span>
            <span className="font-mono font-semibold">
              {realWpm ? `${realWpm} WPM` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Effective Reading Speed:</span>
            <span className="font-mono font-semibold">
              {effectiveWpm ? `${effectiveWpm} WPM` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-lg font-medium text-blue-700 mt-4 border-t pt-4">
            <span>Total Points:</span>
            <span>{points.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onBackHome}
          className="mt-8 w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ExperimentResult;
