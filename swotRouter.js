const express = require('express');
require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const router = express.Router();

router.post('/api/submit', async (req, res) => {
    const inputData = req.body;

    let promptText = "I am analyzing a business based on the following inputs from it's owner: \r\n";

    for (let [key, value] of Object.entries(inputData)) {
        promptText += `${key}: ${value}\r\n`;
    }

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
                            She needs short-term, mid-term and long-term action plan.
                            
                            I need a response in json format:
                            {
                                strengths: [<array of strings>],
                                weaknessess: [<array of strings>],
                                opportunities: [<array of strings>],
                                threats: [<array of strings>],
                                action_plan: {
                                    short_term:  [<array of strings>],
                                    mid_term:  [<array of strings>],
                                    long_term:  [<array of strings>],
                                }
                            }`
            }, {
                role: "user",
                content: promptText
            }],
        });

        const swotResult = completion.data.choices[0].message;
        res.json({ swotAnalysis: swotResult, promptText: promptText });

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate SWOT analysis.' });
    }
});

module.exports = router;
