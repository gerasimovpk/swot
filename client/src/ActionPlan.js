import React from 'react';
import './ActionPlan.css';  // Create this CSS file in the next steps.

const ActionPlan = ({ actionPlan }) => {
    return (
        <div className="action-plan-container">
            <h2>Action Plan</h2>

            <div className="plan-section">
                <h3>Short Term</h3>
                {actionPlan.short_term.map((plan, index) => (
                    <div key={index}>
                        <h4>Priority: {plan.track}</h4>
                        <ul>
                            {plan.actions.map((action, aIndex) => (
                                <li key={aIndex}>{action}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="plan-section">
                <h3>Mid Term</h3>
                {actionPlan.mid_term.map((plan, index) => (
                    <div key={index}>
                        <h4>Priority: {plan.track}</h4>
                        <ul>
                            {plan.actions.map((action, aIndex) => (
                                <li key={aIndex}>{action}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="plan-section">
                <h3>Long Term</h3>
                {actionPlan.long_term.map((plan, index) => (
                    <div key={index}>
                        <h4>Priority: {plan.track}</h4>
                        <ul>
                            {plan.actions.map((action, aIndex) => (
                                <li key={aIndex}>{action}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default ActionPlan;
