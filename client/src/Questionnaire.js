import React, { useState } from 'react';
import axios from 'axios';
import './Questionnaire.css';
import { questions } from './questions'; // Assuming questions.js is in the same directory
import SWOTResults from './SWOTResults';
import ActionPlan from './ActionPlan';
// import { questionsRu } from './questions_ru'; // Assuming questions.js is in the same directory


function Questionnaire() {
    const initialAnswers = questions.reduce((accum, question) => {
        accum[question.key] = question.test_answer;
        return accum;
    }, {});

    const [answers, setAnswers] = useState(initialAnswers);

    const [isLoading, setIsLoading] = useState(false);


    const handleInputChange = (index, value) => {

        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [index]: value
        }));
    };

    const [errors, setErrors] = useState({});

    const [feedback, setFeedback] = useState({
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        action_plan: {
            short_term: [],
            mid_term: [],
            long_term: [],
        }
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {


            const response = await axios.post('/api/submit', answers);
            const swotResult = JSON.parse(response.data.swotAnalysis.content);
            const promptText = response.data.promptText;

            // Display the result
            setIsLoading(false);
            setFeedback(swotResult);
        } catch (error) {
            setIsLoading(false);

            console.error('Failed to generate SWOT analysis:', error);
            setFeedback('There was an error generating the SWOT analysis. Please try again.');
        }
    };


    return (
        <form onSubmit={handleSubmit} className="questionnaire">
            {questions.map((question) => (
                <div key={question.id} className="question-item">
                    <label htmlFor={`question-${question.id}`}>
                        {question.prompt}
                    </label>

                    <textarea
                        id={`question-${question.id}`}
                        value={question.test_answer}
                        onChange={(e) => handleInputChange(question.key, e.target.value)}
                    />

                </div>
            ))}

            {!isLoading && <button type="submit">Submit</button>}
            {isLoading &&
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            }

            <SWOTResults feedback={feedback} />
            <ActionPlan actionPlan={feedback.action_plan} />
        </form>
    );
}

export default Questionnaire;
