const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require('cors');

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // Allow only requests from this port
    methods: ['GET', 'POST'], // Allow specific methods
}));
// Endpoint to handle requests
app.post("/api/query", async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        console.log("API Key:");

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer {}`, //^ add api key here
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                model: "llama-3.1-sonar-small-128k-online",
                messages: [
                    { role: "system", content: "Be precise and concise." },
                    { role: "user", content: query }
                ],
                max_tokens: "Optional",
                temperature: 0.2,
                top_p: 0.9,
                search_domain_filter: ["perplexity.ai"],
                return_images: false,
                return_related_questions: false,
                search_recency_filter: "month",
                top_k: 0,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 1
            }),
        };

        // Make the API call to Perplexity
        const response = await axios.post('https://api.perplexity.ai/chat/completions', options.data, { headers: options.headers });

        console.log('-------------------------------')
        // console.log(response.cdata);

        res.json(response.data);


    } catch (error) {
        console.log("Error calling Perplexity API:", error);
        res.status(500).json({ error: "Failed to fetch data from Perplexity API" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
