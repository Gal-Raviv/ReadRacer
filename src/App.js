import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import TutorialReading from './tutorial/TutorialReading';
import TutorialQuiz from './tutorial/TutorialQuiz';
import TutorialResult from './tutorial/TutorialResult';
import ExperimentReading from './experiment/ExperimentReading';
import ExperimentQuiz from './experiment/ExperimentQuiz';
import ExperimentResult from './experiment/ExperimentResult';
import { getOrCreateUserId } from './utils/user';
import FAQ from './components/FAQ';
import Results from './components/Results';
import NavBar from './components/NavBar';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import LoadingScreen from './components/LoadingScreen';
import Profile from './components/Profile';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const tutorialText = `Welcome to Read Racer!

In this tutorial, you'll experience how our experiment works.

You'll be shown either a full passage or an AI-generated summary. After reading, you'll answer a short quiz to test how well you understood the content.

The goal of this experiment is to explore how using AI summaries affects reading performance—specifically, whether they improve reading speed and how much they may reduce comprehension.

At the end, you'll see two reading speed metrics:
- Real Reading Speed (WPM): Words per Minute based on the actual number of words you read.
- Effective Reading Speed (WPM): Words per Minute calculated using the full passage length, even if you read only the summary.

By comparing these values and your quiz score, we can study the trade-off between speed and understanding.

Let’s get started!`;

const correctAnswers = {
  q1: 'Read a passage and answer questions',
  q2: 'How well you understand what you read',
  q3Keywords: ['passage', 'summary'],
};

function App() {
  const [page, setPage] = useState('home');
  const [mode, setMode] = useState(null);
  const [user, setUser] = useState(null);
  const [useSummary, setUseSummary] = useState(null);
  const [experimentAnswers, setExperimentAnswers] = useState({});
  const [experimentSummary, setExperimentSummary] = useState('');
  const [experimentQuizAnswers, setExperimentQuizAnswers] = useState(null);
  const [experimentText, setExperimentText] = useState('');
  const [experimentQuestions, setExperimentQuestions] = useState([]);
  const [experimentReadingTime, setExperimentReadingTime] = useState(null);
  const [summaryText, setSummaryText] = useState('');
  const [tutorialReadingTime, setTutorialReadingTime] = useState(null);
  const [tutorialQuizAnswers, setTutorialQuizAnswers] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Generating your reading content...");

useEffect(() => {
  const storedUserStr = localStorage.getItem("user");
  if (!storedUserStr) {
    console.log("No user found in localStorage");
    setUser(null);
    return;
  }
  try {
    const storedUser = JSON.parse(storedUserStr);
    setUser(storedUser);
  } catch (e) {
    console.error("Failed to parse stored user:", e);
    localStorage.removeItem("user");
    setUser(null);
  }
}, []);


  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const userInfo = await res.json();

      const profileRes = await fetch("https://read-racer.azurewebsites.net/api/getUserProfile", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userInfo.email }),
      });

      const profileData = await profileRes.json();


        let uuid = profileData.userId || getOrCreateUserId();
        localStorage.setItem("userId", uuid);

        const userWithProfile = {
          ...userInfo,
          uuid,
          displayName: profileData.displayName || '',
          leaderboardOptIn: profileData.leaderboardOptIn || false,
          totalExperiments: profileData.totalExperiments || 0,
          summaryExperiments: profileData.summaryExperiments || 0,
          fullPassageExperiments: profileData.fullPassageExperiments || 0,
          dateJoined: profileData.dateJoined || new Date().toISOString().slice(0, 10),
        };

        setUser(userWithProfile);
        localStorage.setItem("user", JSON.stringify(userWithProfile));
        setPage('home');
      } catch (error) {
        alert('Failed to fetch user info');
      }
    },
    onError: () => alert('Login Failed'),
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    if (page === "profile") setPage("home");
  };

  const handleNavigate = (targetPage) => {
    if (targetPage === "profile" && !user) {
      alert("Please sign in to view your profile.");
      return;
    }
    setPage(targetPage);
  };

  function startTutorial() {
    setMode('tutorial');
    setPage('reading');
  }

  function finishTutorialReading(time) {
    setTutorialReadingTime(time);
    setPage('quiz');
  }

  function submitTutorialQuiz(answers) {
    const result = checkAnswers(answers);
    setTutorialQuizAnswers({ ...answers, ...result });
    localStorage.setItem("tutorialCompleted", "true");
    setPage('finished');
  }

  async function startExperiment() {
    if (!user) {
      alert("Please sign in to participate in the experiment.");
      return;
    }

    const tutorialCompleted = localStorage.getItem("tutorialCompleted");
    if (tutorialCompleted !== "true") {
      setMode('tutorial');
      setPage('reading');
      return;
    }

    await beginExperiment();
  }

  async function beginExperiment() {
  setMode('experiment');
  setLoadingMessage("Generating your reading content...");
  setPage('loading');

  const assignedSummary = Math.random() < 0.5;
  setUseSummary(assignedSummary);

  try {
    const response = await fetch('https://read-racer.azurewebsites.net/api/generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: "any prompt or your own prompt" }),
    });
    const data = await response.json();

    setExperimentText(data.passage || data.generatedText || '');
    setExperimentQuestions(data.questions || []);
    setExperimentAnswers(data.answers || {});

    if (assignedSummary) {
      const summaryResponse = await fetch('https://read-racer.azurewebsites.net/api/summarizeText', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.passage || data.generatedText }),
      });
      const summaryData = await summaryResponse.json();

      setExperimentSummary(summaryData.summary || '');
      setSummaryText(summaryData.summary || '');
    }

    setPage('reading');
  } catch (error) {
    console.error('Error loading experiment:', error);
    alert('Failed to load experiment data. Please try again.');
    setMode(null);
    setPage('home');
  }
}


  async function submitExperimentQuiz(userAnswers) {
  setLoadingMessage("Grading your answers...");
  setPage('loading');
  try {
    const res = await fetch('https://read-racer.azurewebsites.net/api/analyzeExperimentAnswers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: userAnswers,
        questions: experimentQuestions,
        passage: experimentText
      }),
    });
    const result = await res.json();
    setExperimentQuizAnswers(result);
    setPage('finished');
  } catch (err) {
    console.error("Error submitting quiz:", err);
    alert('Failed to submit quiz. Please try again.');
    setPage('quiz');
  }
}


  function finishExperimentReading(time) {
    setExperimentReadingTime(time);
    setPage('quiz');
  }

  function checkAnswers(userAnswers) {
    let score = 0;
    const total = 3;
    if ((userAnswers.q1 || '').toLowerCase() === correctAnswers.q1.toLowerCase()) score++;
    if ((userAnswers.q2 || '').toLowerCase() === correctAnswers.q2.toLowerCase()) score++;
    const answerText = (userAnswers.q3 || '').toLowerCase();
    const containsKeyword = correctAnswers.q3Keywords.some((keyword) =>
    answerText.includes(keyword)
);

if (containsKeyword) score++;
    return { score, total, passed: score / total >= 0.8 };
  }

  function backToHome() {
    setMode(null);
    setPage('home');
    setTutorialReadingTime(null);
    setTutorialQuizAnswers(null);
    setExperimentText('');
    setExperimentQuestions([]);
    setExperimentQuizAnswers(null);
    setExperimentReadingTime(null);
    setUseSummary(null);
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <NavBar onNavigate={handleNavigate} user={user} onLogin={login} onLogout={handleLogout} activePage={page} />
      <main>
        {page === 'home' && (
          <Home onStartTutorial={startTutorial} onStartExperiment={startExperiment} user={user} />
        )}
        {page === 'profile' && user && (
          <Profile user={user} setUser={setUser} onLogout={handleLogout} onBackHome={backToHome} setPage={setPage} />
        )}
        {mode === 'tutorial' && page === 'reading' && (
          <TutorialReading text={tutorialText} onFinish={finishTutorialReading} />
        )}
        {mode === 'tutorial' && page === 'quiz' && (
          <TutorialQuiz onSubmit={submitTutorialQuiz} />
        )}
        {mode === 'tutorial' && page === 'finished' && (
          <TutorialResult quizAnswers={tutorialQuizAnswers} readingTime={tutorialReadingTime} onStartExperiment={startExperiment} user={user} />
        )}
        {mode === 'experiment' && page === 'loading' && <LoadingScreen message={loadingMessage} />}
        {mode === 'experiment' && page === 'reading' && (
          <ExperimentReading passageText={experimentText} summaryText={summaryText} onFinish={finishExperimentReading} useSummary={useSummary} />
        )}
        {mode === 'experiment' && page === 'quiz' && (
          <ExperimentQuiz questions={experimentQuestions} onSubmit={submitExperimentQuiz} />
        )}
        {mode === 'experiment' && page === 'finished' && (
          <ExperimentResult quizAnswers={experimentQuizAnswers} readingTime={experimentReadingTime}  passageText={experimentText} summaryText={summaryText} useSummary={useSummary} onBackHome={backToHome} user={user} />
        )}
        {page === 'faq' && <FAQ onBackHome={backToHome} />}
        {page === 'results' && <Results user={user} onBackHome={backToHome} />}
        {page === 'terms' && <TermsOfService />}
        {page === 'privacy' && <PrivacyPolicy />}
      </main>
    </GoogleOAuthProvider>
  );
}

export default App;
