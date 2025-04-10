
import React from 'react';
import { useLocation } from 'react-router-dom';
import './ResultsPage.css';

export default function ResultsPage() {
  const location = useLocation();
  const answers = location.state?.answers || {};

  // TODO: Calculate results based on answers
  const mockResults = {
    careers: [
      'Software Engineer',
      'Data Scientist',
      'UX Designer',
      'Product Manager',
      'Business Analyst'
    ],
    majors: [
      'Computer Science',
      'Information Systems',
      'Human-Computer Interaction',
      'Business Administration',
      'Data Analytics'
    ]
  };

  return (
    <div className="results-page">
      <h1>Your Career Profile</h1>
      <div className="results-container">
        <div className="results-section">
          <h2>Recommended Careers</h2>
          <ul>
            {mockResults.careers.map((career, index) => (
              <li key={index}>{career}</li>
            ))}
          </ul>
        </div>
        <div className="results-section">
          <h2>Suggested Majors</h2>
          <ul>
            {mockResults.majors.map((major, index) => (
              <li key={index}>{major}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
