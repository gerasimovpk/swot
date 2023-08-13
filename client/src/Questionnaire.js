import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Questionnaire.css';
import { questions } from './questions'; // Assuming questions.js is in the same directory
import SWOTResults from './SWOTResults';
import Insights from './Insights';
import ActionPlan from './ActionPlan';
// import { questionsRu } from './questions_ru'; // Assuming questions.js is in the same directory


function Questionnaire() {
    const initialAnswers = questions.reduce((accum, question) => {
        accum[question.key] = question.test_answer;
        return accum;
    }, {});

    // const [answers, setAnswers] = useState(initialAnswers);
    const [answers, setAnswers] = useState({});

    const initialSuggestions = {
        "business scope": ["Baking or Pastry Shop", "E-commerce Store", "Digital Marketing", "Graphic Design", "Fitness", "Event Planning"],
    };
    const [lastFetchedAnswers, setLastFetchedAnswers] = useState({});
    const [suggestions, setSuggestions] = useState(initialSuggestions);

    const textAreaRefs = useRef(questions.map(() => React.createRef()));

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

    const handleBlur = (key, value) => {
        if (lastFetchedAnswers[key] !== value) {
            fetchSuggestions({ lastAnsweredQuestion: key });
            setLastFetchedAnswers(prev => ({ ...prev, [key]: value }));
        }
    }

    const [errors, setErrors] = useState({});

    const [results, setResults] = useState({});

    const areResultsEmpty = () => {
        return !results || Object.keys(results).length === 0;
    };

    const getHumanReadableAddress = async (lat, long) => {
        // TODO: check conditions for using this endpoint
        const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`;
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        let city = '';
        let country = '';

        if (data && data.address) {
            city = data.address.city || data.address.town || data.address.village || data.address.hamlet || '';
            country = data.address.country || '';
        }

        return `${city}, ${country}`;
    }
    

    const handleLocateMeClick = async () => {
        if (!navigator.geolocation) {
            setAnswers(prev => ({ ...prev, 'business location': 'Geolocation is not supported by your browser' }));
            return;
        }

        const success = async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const locationString = await getHumanReadableAddress(latitude, longitude);
            setAnswers(prev => ({ ...prev, 'business location': locationString }));
        }

        const error = () => {
            setAnswers(prev => ({ ...prev, 'business location': 'Unable to retrieve your location' }));
        }

        navigator.geolocation.getCurrentPosition(success, error);
    }

    function handleChipClick(key, suggestion) {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [key]: ((prevAnswers[key] || "") + "\n" + suggestion).trim() + ": "
        }));

        // Find the related question to get its index
        const relatedQuestionIndex = questions.findIndex(q => q.key === key);

        // Use the ref to focus the textarea and set cursor to end
        const textArea = textAreaRefs.current[relatedQuestionIndex].current;
        // textArea.focus();
        // textArea.setSelectionRange(textArea.value.length, textArea.value.length);
        // TODO: uncomment when bug with doubled suggestions is fixed

        fetchSuggestions({ lastAnsweredQuestion: key, lastAnswer: suggestion });
    }

    function getNextKeys(currentKey) {
        // Find the index of the current question
        const currentIndex = questions.findIndex(question => question.key === currentKey);

        // Handle case where the current key isn't found
        if (currentIndex === -1) return [];

        // Get the keys of the next two questions if they exist
        const nextKeys = [];

        if (questions[currentIndex + 1]) {
            nextKeys.push(questions[currentIndex + 1].key);
        }

        return nextKeys;
    }

    const fetchSuggestions = async (params) => {
        try {

            const payload = questions.reduce((acc, question) => {
                if (answers[question.key] && answers[question.key].length > 0) {
                    acc[question.key] = answers[question.key] || '';
                }
                return acc;
            }, {});

            // TODO: investigate why it's not in answers when clicked on a chip
            payload[params.lastAnsweredQuestion] = payload[params.lastAnsweredQuestion] || params.lastAnswer;

            const nextKeys = getNextKeys(params.lastAnsweredQuestion);

            nextKeys.forEach(key => {
                payload[key] = payload[key] || '';
            });

            const response = await axios.post('/api/newSuggestions', payload);
            if (response.data) {
                const newSuggestions = JSON.parse(response.data.suggestions.content);

                // Merging new chips into previous
                setSuggestions(prevSuggestions => {
                    return Object.keys(newSuggestions).reduce((merged, key) => {
                        if (prevSuggestions[key]) {
                            merged[key] = [...new Set([...prevSuggestions[key], ...newSuggestions[key]])]; // Merging arrays and removing duplicates
                        } else {
                            merged[key] = newSuggestions[key];
                        }

                        merged[key] = merged[key].slice(-10);

                        return merged;
                    }, { ...prevSuggestions });
                });

            }
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        }
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
                        ref={textAreaRefs.current[question.id]}
                        value={answers[question.key] || ''}
                        onChange={(e) => handleInputChange(question.key, e.target.value)}
                        onBlur={(e) => handleBlur(question.key, e.target.value)}
                    />

                    <div className="chip-container">
                        {question.key === "business location" ? (
                            <span className="chip" onClick={handleLocateMeClick}>
                                Locate me
                            </span>
                        ) : (
                            suggestions[question.key] && suggestions[question.key].map((suggestion, sIndex) => (
                                <span key={sIndex} className="chip" onClick={() => handleChipClick(question.key, suggestion)}>
                                    {suggestion}
                                </span>
                            ))
                        )}
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
                    <h1> {results.swot_scope} </h1>
                    <SWOTResults feedback={results} />
                    <ActionPlan actionPlan={results.action_plan} />
                </div>
            )}
        </form>
    );
}

export default Questionnaire;
