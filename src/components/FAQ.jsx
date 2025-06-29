import React, { useState } from 'react';

const faqData = [
  {
    question: 'What is Read Racer?',
    answer:
      'Read Racer is an educational platform that tests your reading speed and comprehension using AI-generated content. It helps you track and improve your reading performance.',
  },
  {
    question: 'How does the experiment work?',
    answer:
      'You will be randomly assigned either a full passage or a summary to read, then answer a set of questions. Your speed and accuracy are recorded for analysis.',
  },
  {
    question: 'Do I need to sign in?',
    answer:
      'Yes, signing in with Google is required to participate in the experiment. This helps us track your progress and store your results.',
  },
  {
    question: 'What happens to my data?',
    answer:
      'We store anonymized performance data to calculate global statistics. Your Google profile info is not shared and is only used to personalize your results.',
  },
  {
    question: 'What’s the difference between the tutorial and experiment?',
    answer:
      'The tutorial gives you a fixed reading and quiz sample to understand the process. The experiment uses AI-generated content and counts toward global stats.',
  },
  {
    question: 'Can I see my past results?',
    answer:
      'Yes! Visit your profile page after signing in to view your personal results and compare them to global averages.',
  },
  {
    question: 'Is this free to use?',
    answer: 'Yes, Read Racer is completely free to use. However, maintenance of the AI and the website can be costly. A donation would be appreciated!',
  },
  {
    question: 'Who made Read Racer and why?',
    answer:
      "Read Racer was created by Gal Raviv, a student at Highland Park High School, to investigate how AI-generated summaries impact reading speed and comprehension. The project uses modern tools, real-time data, and interactive experiments to find out the extent faster reading comes at the cost of accuracy."
  },

];

const FAQ = ({ onBackHome }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md my-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 transition font-medium text-gray-800"
            >
              {item.question}
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 bg-white text-gray-700 border-t">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={onBackHome}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default FAQ;
