import axios from 'axios';
import express from 'express';
import cors from 'cors';

const BROWSER_BASE_URL = 'http://localhost:3000';
const GOOGLE_BASE_URL = 'http://localhost:5000';
const RAG_BASE_URL = 'http://localhost:5002';
const LLM_BASE_URL = 'http://localhost:5001';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/generate', async (req, res) => {
  const prompt = req.query.prompt;

  let response = await axios({
    method: 'post',
    url: `${LLM_BASE_URL}/generate_response`,
    data: {
      prompt: `
        Given the following user prompt, generate a good google search query to search the web for relevant information:
      
        user prompt : ${prompt}
      `,
      schema: `{"prompt": { "type": "str", "value":"google search prompt goes here"  } }`,
      context: [],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let data = response.data;
  res.json(response.data);
  const google_query = JSON.parse(data)?.prompt;

  response = await axios({
    method: 'post',
    url: `${GOOGLE_BASE_URL}/search?q=${google_query}`,

    headers: {
      'Content-Type': 'application/json',
    },
  });

  data = response.data;

  // res.json(data);
});

app.listen(8080, () => {
  console.log('API listening on port 8080');
});

process.on('uncaughtException', (err) => {
  console.log(err);
  // process.exit(1);
});