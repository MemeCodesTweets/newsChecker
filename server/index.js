// app.js

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const Exa = require("exa-js").default;
const exa = new Exa(process.env.EXA_API_KEY)

async function getSummaryFromUrl(url) {
    try {
        const results = await exa.getContents([url], {
            summary: true
        });

        if (results.results && results.results.length > 0 && results.results[0].summary) {
            return results.results[0].summary;
        } else {
            console.log("summary not found")
            return "Summary not available";
        }
    } catch (error) {
        console.error("Error fetching summary:", error);
        
        return res.status(500).json({
            message: "Error fetching summary"
        });
    }
}


async function askPerplexity(inputUrl) {

    const response = await getSummaryFromUrl(inputUrl);

    const url = 'https://api.perplexity.ai/chat/completions';

    const data = {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
            { role: 'system', content: `Be concise and precise.` },
            { role: 'user', content: `Hi, Here is a possible summary for the article: ${response}. Can you verify if this is correct? Please note:
                If the summary is about newsaichecker.netlify.app then return yes as answer, no citation or anything, just provide Yes as answer. Otherwise
                The URL must point to a specific news article, not a general website or a home page of any site (e.g., homepages like facebook.com, google.com, or ndtv.com).
                If the URL is not a specific news article, return 'No.'
                If the URL leads to a news article but the information is incorrect, return 'No.'
                Only return 'Yes' if the URL leads to a specific news article and the information is verified as correct. Ensure the first word of your response is either 'Yes' or 'No' based on these conditions.` }
        ]
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                Accept: 'application/json'
            }
        });

        if(response.status == 500)
            return "ERROR";

        return response.data;
        //^ return response.data.choices[0].message.content;

    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

app.get('/api/query', async (req, res) => {
    try {
        const { question } = req.query;
        if (!question) {
            return res.status(400).json({ error: 'Question parameter is required' });
        }

        // Special case for newsaichecker URLs
        if (question === 'newsaichecker.netlify.app' || question === 'https://newsaichecker.netlify.app') {
            setTimeout(() => {
                if (!res.headersSent) {
                    res.json({
                        source: "API",
                        answer: {
                            choices: [
                                {
                                    message: {
                                        content: "Yes, the entered URL is valid and represents the intended news AI checker platform. Very smart though!",
                                    },
                                },
                            ],
                            citations: [],
                        },
                    });
                }
            }, 1000); // 1-second delay
            return; // Exit early to avoid further processing
        }

        // Default behavior for other URLs
        const answer = await askPerplexity(question);
        res.json({ source: "API", answer });

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


app.listen(port, () => {
    console.log(`Server is running`);
});