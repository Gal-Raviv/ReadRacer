import React, { useState } from 'react';

const questions = [
  {
    id: 'q1',
    type: 'multiple',
    question: 'What will you do in this experiment?',
    choices: [
      'Play a video game',
      'Read a passage and answer questions',
      'Watch a movie',
      'Write an essay',
    ],
  },
  {
    id: 'q2',
    type: 'multiple',
    question: 'What does the experiment measure?',
    choices: [
      'How fast you type',
      'How well you understand what you read',
      'How many books you own',
      'Your favorite color',
    ],
  },
  {
    id: 'q3',
    type: 'short',
    question: 'What are two types of text you might read during the experiment?',
  },
];

function TutorialQuiz({ onSubmit }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
          Tutorial
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map(({ id, type, question, choices }) => (
          <div key={id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <p className="mb-4 text-lg font-medium text-gray-800">{question}</p>

            {type === 'multiple' && choices && (
              <div className="space-y-3">
                {choices.map((choice, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <input
                      type="radio"
                      name={id}
                      value={choice}
                      checked={answers[id] === choice}
                      onChange={() => handleChange(id, choice)}
                      className="text-blue-600 focus:ring-blue-500"
                      
                    />
                    <span className="text-gray-700">{choice}</span>
                  </label>
                ))}
              </div>
            )}

            {(type === 'short' || type === 'long') && (
              <textarea
                name={id}
                value={answers[id] || ''}
                onChange={(e) => handleChange(id, e.target.value)}
                rows={type === 'short' ? 3 : 6}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none text-gray-800"
                placeholder="Type your answer here..."
                
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="self-start px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
}

export default TutorialQuiz;
