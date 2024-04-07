import axios from 'axios';

const BROWSER_BASE_URL = 'http://localhost:3000';
const GOOGLE_BASE_URL = 'http://localhost:5000';
const RAG_BASE_URL = 'http://localhost:5002';
const LLM_BASE_URL = 'http://localhost:5001';

import template from './template';

import { extractJSON } from '../../utils';

async function researcher(user_prompt: string, research_context: string) {
  try {
    let response = await axios({
      method: 'post',
      url: `${LLM_BASE_URL}/generate_response`,
      data: {
        prompt: template(user_prompt, research_context),
        schema: `{"prompt": { "type": "str", "value":"google search query based on research context and user prompt"  } }`,
        context: 'No context, use your known knowledge of LLM',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let data = response.data;
    const google_query = data.prompt;
    console.log('google query generated:', google_query);

    if (!google_query) {
      throw new Error('Google query not generated');
    }

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

    console.log('google search done');

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

    console.log('got results from rag');

    data = response.data;

    // @ts-ignore
    let sources: {
      title: string;
      description: string;
      url: string;
      favicon: string;
    }[] = [];

    if (typeof data === 'object') {
      data?.forEach((result: any) => {
        const existingSourceIndex = sources.findIndex(
          (source) => source.url === result?.url
        );

        if (existingSourceIndex === -1) {
          sources.push({
            title: result?.title,
            description: result?.description,
            url: result?.url,
            favicon: result?.favicon,
          });
        } else {
          sources[existingSourceIndex] = {
            ...sources[existingSourceIndex],
            title: result?.title,
            description: result?.description,
          };
        }
      });
    }

    let context = '';

    context += results?.knowledge_panel?.description + '\n';
    results.forEach((result: any) => {
      context += result?.title + '\n';
      context += result?.description + '\n';
    });

    context += '\n\n';
    data.forEach((result: any) => {
      context += result?.text + '\n';
    });

    response = await axios({
      method: 'post',
      url: `${LLM_BASE_URL}/generate_response`,
      data: {
        prompt: user_prompt,
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

    return {
      response: answer,
      sources,
    };
  } catch (error) {
    throw error;
  }
}

export default researcher;
