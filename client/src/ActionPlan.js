import React from 'react';
import './ActionPlan.css';  // Create this CSS file in the next steps.

const ActionPlan = ({ actionPlan }) => {
    return (
        <div className="action-plan-container">
            <h2>Action Plan</h2>

            <div className="plan-section">
                <h3>Short Term</h3>
                <ul>
                    {actionPlan.short_term.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className="plan-section">
                <h3>Mid Term</h3>
                <ul>
                    {actionPlan.mid_term.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className="plan-section">
                <h3>Long Term</h3>
                <ul>
                    {actionPlan.long_term.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    ); 
}

export default ActionPlan;
