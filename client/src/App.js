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

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={fetchMessage}>Get Message</button>
                <p>{message}</p>
            </header>
            <Questionnaire/>
        </div>
    );
}

export default App;
