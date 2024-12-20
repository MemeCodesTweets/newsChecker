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
            console.log(results.results[0].summary)
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
            { role: 'user', content: `Hi, Here is a possible summary for the article. Can you search and find out if the fact is correct. : ${response}.Note that, the summary should be of a news, if it is anything else, give no as answer. Also, give first word of the answer as yes or no, depending upon the truthness of the news` }
        ]
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                Accept: 'application/json'
            }
        });
        console.log(response.data);

        if(response.status == 500)
            return "ERROR";

        return response.data;
        //^ return response.data.choices[0].message.content;

    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

app.get('/api/perplexity', async (req, res) => {
    try {
        const { question } = req.query;
        if (!question) {
            return res.status(400).json({ error: 'Question parameter is required' });
        }

        const answer = await askPerplexity(question);
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});