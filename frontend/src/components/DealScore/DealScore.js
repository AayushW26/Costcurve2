import React from 'react';
import './DealScore.css';

const DealScore = ({ score = 0, description }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return '#27ae60'; // Green
    if (score >= 6) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent Deal';
    if (score >= 6) return 'Good Deal';
    if (score >= 4) return 'Fair Deal';
    return 'Poor Deal';
  };

  const getScoreDescription = (score) => {
    if (description) return description;
    
    if (score >= 8) return 'This is an excellent deal! Price is near all-time low.';
    if (score >= 6) return 'Good deal with decent savings potential.';
    if (score >= 4) return 'Fair price, consider waiting for better deals.';
    return 'Not the best time to buy. Price may drop further.';
  };

  return (
    <div className="deal-score-widget">
      <h4>Deal Score</h4>
      
      <div className="score-display">
        <div 
          className="score-circle"
          style={{ '--score-color': getScoreColor(score) }}
        >
          <div className="score-number">{score.toFixed(1)}</div>
          <div className="score-max">/10</div>
        </div>
        
        <div className="score-info">
          <div 
            className="score-label"
            style={{ color: getScoreColor(score) }}
          >
            {getScoreLabel(score)}
          </div>
          <div className="score-description">
            {getScoreDescription(score)}
          </div>
        </div>
      </div>

      <div className="score-breakdown">
        <div className="breakdown-item">
          <span className="breakdown-label">Price vs History:</span>
          <div className="breakdown-bar">
            <div 
              className="breakdown-fill"
              style={{ 
                width: `${Math.min(score * 10, 100)}%`,
                backgroundColor: getScoreColor(score)
              }}
            ></div>
          </div>
        </div>
        
        <div className="breakdown-item">
          <span className="breakdown-label">Market Comparison:</span>
          <div className="breakdown-bar">
            <div 
              className="breakdown-fill"
              style={{ 
                width: `${Math.min((score - 1) * 12, 100)}%`,
                backgroundColor: getScoreColor(score)
              }}
            ></div>
          </div>
        </div>
        
        <div className="breakdown-item">
          <span className="breakdown-label">Timing:</span>
          <div className="breakdown-bar">
            <div 
              className="breakdown-fill"
              style={{ 
                width: `${Math.min((score + 1) * 9, 100)}%`,
                backgroundColor: getScoreColor(score)
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="score-tips">
        <h5>💡 Tips:</h5>
        <ul>
          <li>Set price alerts for better deals</li>
          <li>Check back during sales seasons</li>
          <li>Consider refurbished alternatives</li>
        </ul>
      </div>
    </div>
  );
};

export default DealScore;