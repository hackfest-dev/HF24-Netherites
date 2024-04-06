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
  try {
    const prompt = req.query.prompt;

    let response = await axios({
      method: 'post',
      url: `${LLM_BASE_URL}/generate_response`,
      data: {
        prompt: `
        Given the following user prompt, generate a perfect google search query to search the web to answer the user prompt:
      
        user prompt : ${prompt}
      `,
        schema: `{"prompt": { "type": "str", "value":"google search prompt goes here"  } }`,
        context: 'no context, use your known knowledge of LLM',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let data = response.data;

    const google_query = data.prompt;

    console.log('google_query:', google_query);

    response = await axios({
      method: 'post',
      url: `${GOOGLE_BASE_URL}/search?q=${google_query}`,
      data: {
        options: {
          safe: true,
          params: {},
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    data = await response.data;

    const results = data.results;

    const responses: {
      url: string;
      text: string;
    }[] = [];

    const promises: Promise<any>[] = [];
    for (let i = 0; i < results.length; i++) {
      promises.push(
        fetch(BROWSER_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: results[i]?.url,
            text: 'true',
            timeout: 6,
          }),
        })
          .then((response: Response) => response.json())
          .then((data) => {
            responses.push({
              text: data.TEXT,
              url: results[i]?.url,
            });
          })
          .catch((error: any) => console.log('error', error))
      );
    }

    await Promise.all(promises);
    console.log('Now RAG');
    // const ragPromises: Promise<any>[] = [];
    // for (let i = 0; i < results.length; i++) {
    //   console.log(i);

    //   await fetch(`${RAG_BASE_URL}/get_documents`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       query: google_query,
    //       context: results[i].text,
    //     }),
    //   })
    //     .then((response: Response) => {
    //       console.log('responsee');
    //       console.log(response);
    //       response.json();
    //     })
    //     .then((data) => {
    //       console.log(data);
    //     })
    //     .catch(() => console.log('error'));
    // }
    // console.log('started');
    // Promise.all(ragPromises)
    //   .then(() => {
    //     console.log('done');
    //   })
    //   .catch(() => {
    //     console.log('not done');
    //   });

    response = await axios({
      url: `${RAG_BASE_URL}/get_documents`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: google_query,
        context: responses,
      },
    });

    data = response.data;

    res.json(data);
  } catch (error) {
    console.log('Some error in process ');
    res.status(500).json({ message: 'Error occured', error });
  }
});

app.listen(8080, () => {
  console.log('API listening on port 8080');
});

process.on('uncaughtException', (err) => {
  console.log(err);
  // process.exit(1);
});
