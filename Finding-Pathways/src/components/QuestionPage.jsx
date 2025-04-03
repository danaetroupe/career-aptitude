
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionPage.css';

function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const questionsPerPage = 10;

  useEffect(() => {
    // Mock questions data since API isn't set up yet
    const mockQuestions = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      text: `Question ${i + 1}: This is a sample career assessment question.`
    }));
    setQuestions(mockQuestions);
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const progress = (Object.keys(answers).length / questions.length) * 100;

  const handleContinue = () => {
    if ((currentPage + 1) * questionsPerPage >= questions.length) {
      navigate('/results', { state: { answers } });
    } else {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="question-page">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="questions-container">
        {currentQuestions.map(question => (
          <div key={question.id} className="question-item">
            <h3>{question.text}</h3>
            <div className="answer-scale">
              <span>Disagree</span>
              {[1, 2, 3, 4, 5, 6, 7].map(value => (
                <button
                  key={value}
                  className={`scale-button ${answers[question.id] === value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, value)}
                >
                  {value}
                </button>
              ))}
              <span>Agree</span>
            </div>
          </div>
        ))}
      </div>
      <button
        className="continue-button"
        onClick={handleContinue}
        disabled={currentQuestions.some(q => !answers[q.id])}
      >
        {(currentPage + 1) * questionsPerPage >= questions.length ? 'Get Results' : 'Continue'}
      </button>
    </div>
  );
}

export default QuestionPage;
