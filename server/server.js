// Use CommonJS syntax for OpenAI
const OpenAI = require('openai').OpenAI;
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 5000;

const cors = require('cors');
// Enable CORS for frontend running on port 5173
app.use(cors({
    origin: 'http://localhost:5173', // Allow only requests from this port
    methods: ['GET', 'POST'], // Allow specific methods
}));

app.use(express.json());

// Route to handle the OpenAI request
app.post('/api/search', async (req, res) => {
    const { query } = req.body;

    try {
        console.log(`${process.env.OPENAPI_KEY}`)
        const openai = new OpenAI({
            apiKey: "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",
        });

        const response = openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { "role": "user", "content": `search on web if  this is news is correct or fake: ${query}` },
            ],
        });
        console.log("IN SERVER, getting output")    
        response.then((result) => (
            console.log(result.choices[0].message)
        ))

        // const data = response.choices[0].message;
        // console.log("------------------")
        // console.log(data); // Log the data to verify

        res.json(response);
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Error fetching data from OpenAI' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`${process.env.OPENAPI_KEY}`)
});