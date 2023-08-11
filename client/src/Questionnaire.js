import React, { useState, useEffect } from 'react';
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

    // const [answers, setAnswers] = useState(initialAnswers);
    const [answers, setAnswers] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!areResultsEmpty()) {
            scrollIntoResults();
        }
    }, [isLoading]);


    const handleInputChange = (index, value) => {

        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [index]: value
        }));
    };

    const [errors, setErrors] = useState({});

    const [results, setResults] = useState({});

    const areResultsEmpty = () => {
        return !results || Object.keys(results).length === 0;
    };

    function handleChipClick(key, suggestion) {
        setAnswers((answers) => ({
            ...answers,
            [key]: suggestion
        }))
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {


            const response = await axios.post('/api/submit', answers);
            const swotResult = JSON.parse(response.data.swotAnalysis.content);
            const promptText = response.data.promptText;

            // Display the result
            setIsLoading(false);
            setResults(swotResult);

        } catch (error) {
            setIsLoading(false);

            console.error('Failed to generate SWOT analysis:', error);
        }
    };

    const scrollIntoResults = () => {
        const swotResults = document.getElementById("swot-results");
        swotResults && swotResults.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <form onSubmit={handleSubmit} className="questionnaire" id="questionnaire-section" >
            {questions.map((question) => (
                <div key={question.id} className="question-item">
                    <label htmlFor={`question-${question.id}`}>
                        {question.prompt}
                    </label>

                    <textarea
                        id={`question-${question.id}`}
                        value={answers[question.key]}
                        onChange={(e) => handleInputChange(question.key, e.target.value)}
                    />

                    <div className="chip-container">
                        {question.suggestions && question.suggestions.map((suggestion, sIndex) => (
                            <span key={sIndex} className="chip" onClick={() => handleChipClick(question.key, suggestion)}>
                                {suggestion}
                            </span>
                        ))}
                    </div>

                </div>
            ))}

            {!isLoading && <button type="submit">Submit</button>}

            {isLoading &&
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            }

            {!isLoading && !areResultsEmpty() && (
                <div id="swot-results">
                    <SWOTResults feedback={results} />
                    <ActionPlan actionPlan={results.action_plan} />
                </div>
            )}
        </form>
    );
}

export default Questionnaire;
