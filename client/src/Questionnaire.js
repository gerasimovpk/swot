import React, { useState } from 'react';
import './Questionnaire.css';

function Questionnaire() {
    const [answers, setAnswers] = useState({
        strength: "",
        weakness: "",
        opportunity: "",
        threat: ""
    });

    const [errors, setErrors] = useState({});

    const [feedback, setFeedback] = useState("");

    const validateAnswers = () => {
        let validationErrors = {};

        if (!answers.strength.trim()) {
            validationErrors.strength = "Please describe the strengths of your business.";
        }
        if (!answers.weakness.trim()) {
            validationErrors.weakness = "Please describe the weaknesses of your business.";
        }
        // ... Add similar checks for other fields ...

        return validationErrors;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateAnswers();
        if (Object.keys(validationErrors).length > 0) {
            
            setErrors(validationErrors);
            return; // Exit if there are validation errors
        }

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(answers),
            });
            
            const data = await response.json();
            setFeedback("Your answers have been successfully submitted! Thank you." + data.message);
        } catch (error) {
            console.error("Error submitting questionnaire:", error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <label>
                What do you believe your business excels at?
                <textarea
                    name="strength"
                    value={answers.strength}
                    onChange={handleChange}
                />
                {errors.strength && <p className="error-text">{errors.strength}</p>}
            </label>

            <label>
                What areas of your business do you feel need improvement?
                <textarea
                    name="weakness"
                    value={answers.weakness}
                    onChange={handleChange}
                />
                {errors.weakness && <p className="error-text">{errors.weakness}</p>}
            </label>

            {/* ... Add more questions similarly ... */}

            <button type="submit">Submit</button>
            <p className="feedback-text">{feedback}</p>
        </form>

        
    );
}

export default Questionnaire;
