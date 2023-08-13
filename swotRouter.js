const express = require('express');
const SWOT = require('./swotModel.js');

require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const router = express.Router();

router.post('/api/newSuggestions', async (req, res) => {
    const inputData = req.body;

    let promptText = `In JSON there're user's answers about their business.
    Generate short suggestions for potential user's answers where they're empty.  
    Exclude keys which have non-empty values.: \r\n`;

    // for (let [key, value] of Object.entries(inputData)) {
        // promptText += `${key}: ${value}\r\n`;
    // }
    // promptText += "I want results in Russian language.";

    promptText += JSON.stringify(inputData);

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                "role": "system",
                "content": `User is struggling to write everything manually.
                            Based on the answers for some of the questions, I need very short suggestions for chips for other questions.
                            
                            I need a response in json format with the keys at the top level. for example:
                            {
                                "key": [<Array of strings> (can't be empty)]
                            
                            }

                            In your response you can use only keys from initial user request, excluding keys which have values.                    
                            "key" should be exact the same as in user request, not modified, without case changes, or added underscores.
                            `
            }, {
                role: "user",
                content: promptText
            }],
        });

        const suggestions = completion.data.choices[0].message;
        res.json({ suggestions: suggestions, promptText: promptText });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate SWOT analysis.' });
    }
});

router.post('/api/submit', async (req, res) => {
    const inputData = req.body;

    let promptText = "I am analyzing a business based on the following inputs from it's owner: \r\n";

    // for (let [key, value] of Object.entries(inputData)) {
    //     promptText += `${key}: ${value}\r\n`;
    // }

    promptText += JSON.stringify(inputData);


    promptText += "Given these details, provide a SWOT analysis in a defined format. \r\n";
    promptText += "Avoid general conclusions or references, be specific and refer to the given case and given details.";
    // promptText += "I want results in Russian language.";

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                "role": "system",
                "content": `You are an expert in SWOT. I'll ask you to make SWOT analysis based on context from the user.
                            Ansewrs are intended for Small Business Owner/Entrepreneur. 
                            She doesn't have extensive knowledge of SWOT analysis, so she requires clear explanations and actionable insights from the application.
                            She needs specific answers connected to her business.
                            
                            Also, define swot_scope as you understood it.
                            Also, she needs short-term, mid-term and long-term action plan.
                            
                            I need a response in json format:
                            {
                                swot_scope: <string>,
                                strengths: [<array of strings>],
                                weaknessess: [<array of strings>],
                                opportunities: [<array of strings>],
                                threats: [<array of strings>],
                                action_plan: {
                                    short_term: [{
                                        "priority": <string>,
                                        "actions: [<specific granular actions, array of strings>]
                                    }],
                                    mid_term: [{
                                        "priority": <string>,
                                        "actions: [<specific granular actions, array of strings>]
                                    }],
                                    long_term: [{
                                        "priority": <string>,
                                        "actions: [<specific granular actions, array of strings>]
                                    }],
                                }
                            }`
            }, {
                role: "user",
                content: promptText
            }],
        });

        const swotResult = completion.data.choices[0].message;
        res.json({ swotAnalysis: swotResult, promptText: promptText });

        const swotInstance = new SWOT({
            request: inputData,
            response: JSON.parse(swotResult.content),
        });

        await swotInstance.save();

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate SWOT analysis.' });
    }
});

module.exports = router;
