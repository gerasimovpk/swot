// SWOTResults.js
import React from 'react';
import './SWOTResults.css'; // This will be your CSS file for styling this component

const SWOTResults = ({ feedback }) => {
    return (
        <div className="matrix-container">
            <div className="feedback-box strengths">
                <div className="feedback-title">Strengths</div>
                <ul className="feedback-list">
                    {feedback.strengths.map((item, index) => (
                        <li key={index} className="feedback-list-item">{item}</li>
                    ))}
                </ul>
            </div>
            
            <div className="feedback-box weaknesses">
                <div className="feedback-title">Weaknesses</div>
                <ul className="feedback-list">
                    {feedback.weaknesses.map((item, index) => (
                        <li key={index} className="feedback-list-item">{item}</li>
                    ))}
                </ul>
            </div>
            
            <div className="feedback-box opportunities">
                <div className="feedback-title">Opportunities</div>
                <ul className="feedback-list">
                    {feedback.opportunities.map((item, index) => (
                        <li key={index} className="feedback-list-item">{item}</li>
                    ))}
                </ul>
            </div>
            
            <div className="feedback-box threats">
                <div className="feedback-title">Threats</div>
                <ul className="feedback-list">
                    {feedback.threats.map((item, index) => (
                        <li key={index} className="feedback-list-item">{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SWOTResults;
