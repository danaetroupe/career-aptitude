
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import QuestionPage from './components/QuestionPage';
import ResultsPage from './components/ResultsPage';
import './App.css';

function LandingPage() {
  const typedRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ['Discover your ideal career path', 'Find your perfect major', 'Plan your future'],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true
    });

    return () => typed.destroy();
  }, []);

  return (
    <main className="landing-page">
      <div className="content">
        <h1>Finding Pathways</h1>
        <div className="typing-container">
          <span ref={typedRef}></span>
        </div>
        <button className="cta-button" onClick={() => navigate('/questions')}>
          Get Started
        </button>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/questions" element={<QuestionPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}
