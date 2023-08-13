import React from 'react';
import './Insights.css'

const Insights = ({ insights }) => {
    return (
        <div className="insights-container">
            <div className="insights-section">
                <h3>Something to think about</h3>
                <ul>
                    {insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Insights;
