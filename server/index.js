// app.js

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function askPerplexity(inputUrl) {
  const url = 'https://api.perplexity.ai/chat/completions';
  
  const data = {
    model: 'llama-3.1-sonar-small-128k-online',
    messages: [
      { role: 'system',content: `Be concise and precise.` },
      { role: 'user', content: `Hi, Please provide summary for the shared url : ${inputUrl}.` }
    ]
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        Accept: 'application/json'
      }
    });
    console.log(response.data)
    return response.data.choices[0].message.content;
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
