import React, { useState } from 'react';
import Questionnaire from './Questionnaire';
import './App.css';


function App() {
    const [message, setMessage] = useState("");

    const fetchMessage = async () => {
        const response = await fetch('/api/hello');
        const data = await response.json();
        setMessage(data.message);
    }

    const handleScroll = () => {
        const questionnaireSection = document.getElementById("questionnaire-section");
        questionnaireSection.scrollIntoView({ behavior: "smooth" });
    }
    

    return (
        <div className="App">
            <header className="App-header">
                <h1>Discover Your Business Strengths & Get Actionable Insights</h1>
                
                <button className="scroll-button" onClick={handleScroll}>
                    ⬇️
                </button>
            </header>

            <Questionnaire/>

        </div>
    );
}

export default App;
