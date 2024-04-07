import axios from 'axios';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { manager, invoke_tools } from './manager';

const BROWSER_BASE_URL = 'http://localhost:3000';
const GOOGLE_BASE_URL = 'http://localhost:5000';
const RAG_BASE_URL = 'http://localhost:5002';
const LLM_BASE_URL = 'http://localhost:5001';

const app = express();

app.use(cors());
app.use(express.json());

import { extractJSON } from './utils';
import { ioConfig } from './socket';

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

    let data = extractJSON(response.data);

    // @ts-ignore
    const google_query = data?.prompt || '';

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

    // @ts-ignore
    const results = data.results;

    console.log('got results for google search');

    const responses: {
      url: string;
      text: string;
      favicon: string;
      description: string;
      title: string;
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
              favicon: results[i]?.favicons.high_res,
              description: results[i]?.description,
              title: results[i]?.title,
            });
          })
          .catch((error: any) => console.log('error', error))
      );
    }

    await Promise.all(promises);
    console.log('browser response done');

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

    // @ts-ignore
    let sources: {
      title: string;
      description: string;
      url: string;
      favicon: string;
    }[] = [];

    // @ts-ignore
    data?.forEach((result: any) => {
      sources.push({
        title: result?.title,
        description: result?.description,
        url: result?.url,
        favicon: result?.favicon,
      });
    });

    let context = '';

    context += results?.knowledge_panel?.description + '\n';
    results.forEach((result: any) => {
      context += result?.title + '\n';
      context += result?.description + '\n';
    });

    context += '\n\n';
    // @ts-ignore
    data.forEach((result: any) => {
      context += result?.text + '\n';
    });

    response = await axios({
      method: 'post',
      url: `${LLM_BASE_URL}/generate_response`,
      data: {
        prompt: `
        Given the following user prompt, generate a perfect answer to the user prompt:
      
        user prompt : ${prompt}
      `,
        schema: `{"answer": { "type": "str", "value":"answer goes here"  } }`,
        context: context,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    //@ts-ignore
    let answer = extractJSON(response.data)?.answer;

    console.log('got answer, sanitizing');

    if (!answer) {
      answer = 'Sorry, Something went wrong. Please try again later.';
    }

    res.json({
      response: answer,
      sources,
    });
  } catch (error) {
    console.log('Some error in process ', error);
    res.status(500).json({ message: 'Error occured', error });
  }
});

app.get('/autonomous', async (req, res) => {
  try {
    let prompt = req.query?.prompt;

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // @ts-ignore
    let tools = await manager(prompt);

    console.log('got tools:', tools);

    // @ts-ignore
    let responses = await invoke_tools(tools, prompt);

    res.json({
      responses,
    });
  } catch (error) {
    console.log('Some error in process ', error);
    res.json({
      response: 'Something went wrong. Please try again.',
      sources: [],
    });
  }
});

app.get('/emit', (_, res) => {
  emit('tool_response', { message: 'Hello from server' });
  res.json({ message: 'Emitted' });
});

const server = http.createServer(app);

const io = new Server(server, {
  path: '',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Authorization'],
  },
  cleanupEmptyChildNamespaces: true,
});

ioConfig(io);

export function emit(eventName: string, data: any) {
  if (io) {
    console.log('EMITTING');
    io.emit(eventName, data);
  } else {
    console.error(
      'Socket.IO is not initialized. Make sure to call initializeSocketIO with the Server instance.'
    );
  }
}

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});

process.on('uncaughtException', (err) => {
  console.log(err);
  // process.exit(1);
});
