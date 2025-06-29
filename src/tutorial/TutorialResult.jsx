const tutorialText = `Welcome to Read Racer!

In this tutorial, you'll experience how our experiment works.

You'll be shown either a full passage or an AI-generated summary. After reading, you'll answer a short quiz to test how well you understood the content.

The goal of this experiment is to explore how using AI summaries affects reading performance—specifically, whether they improve reading speed and how much they may reduce comprehension.

At the end, you'll see two reading speed metrics:
- Real Reading Speed (WPM): Words per Minute based on the actual number of words you read.
- Effective Reading Speed (WPM): Words per Minute calculated using the full passage length, even if you read only the summary.

By comparing these values and your quiz score, we can study the trade-off between speed and understanding.

Let’s get started!`;

const TutorialResult = ({ quizAnswers, readingTime, user, onStartExperiment }) => {
  if (!quizAnswers) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <p className="text-gray-600 text-lg">No quiz data found.</p>
      </div>
    );
  }

  const wordCount = tutorialText.trim().split(/\s+/).length;
  const { score, total } = quizAnswers;

  const wpm = readingTime ? Math.round((wordCount / readingTime) * 60) : 0;
  const points = total ? (score / total) * wpm : 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Tutorial Results</h2>

        <div className="space-y-3 text-gray-700 text-md">
          <div className="flex justify-between">
            <span>Quiz Score:</span>
            <span className="font-semibold">{score} / {total}</span>
          </div>

          <div className="flex justify-between">
            <span>Reading Speed:</span>
            <span className="font-mono font-semibold">{wpm} WPM</span>
          </div>

          <div className="flex justify-between text-lg font-medium text-blue-700 mt-4 border-t pt-4">
            <span>Total Points:</span>
            <span>{points.toFixed(2)}</span>
          </div>
        </div>

        <div className="relative group mt-8">
          <button
            onClick={user ? onStartExperiment : undefined}
            disabled={!user}
            className={`w-full px-6 py-3 text-lg rounded-xl shadow transition font-semibold ${
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
      </div>
    </div>
  );
};

export default TutorialResult;
