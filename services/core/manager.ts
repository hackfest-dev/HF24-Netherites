import axios from 'axios';

import { extractJSON } from './utils';

import GenericResearch from './tools/generic_research';
import Tool from './tools/tool';
import { emit } from './app';
import CompetitorResearch from './tools/competitor';
import TechnicalAnalysis from './tools/technical';

const LLM_BASE_URL = 'http://localhost:5001';

const TOOLS = [
  {
    name: 'generic_researcher',
    use: 'searches the web generically to satisfy user queries',
  },
  {
    name: 'comparative_analysis',
    use: 'compares two or more companies or stocks or markets',
  },
  {
    name: 'competitive analysis',
    use: 'searches and analyses relations between for competitors of a company',
  },
  {
    name: 'technical_analysis',
    use: "generates technical analysis of a company's stock price",
  },
];

const TOOL_MAP: {
  [key: string]: Tool;
} = {
  generic_researcher: new GenericResearch(),
  competitive_analysis: new CompetitorResearch(),
  technical_analysis: new TechnicalAnalysis(),
};

const tool_info = TOOLS.map((tool) => {
  return Object.entries(tool)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}).join('\n\n');

const template = (
  user_prompt: string
) => `You are an autonomous stock, company, and market research agent. You are provided with a bunch of in house tools to help you with your research. You are supposed to use these tools to satisfy user queries. 

Your task is to understand the user query and return a list of names of tools that you would use to satisfy the user query.

USER QUERY: ${user_prompt}

TOOLS: ${tool_info}
`;

const response_schema = `{
  "tools": {
    "type": "list",
    "value": ["tool1", "tool2", "tool3"]
  }
}`;

const manager = async (user_prompt: string) => {
  const response = await axios({
    method: 'post',
    url: `${LLM_BASE_URL}/generate_response`,
    data: {
      prompt: template(user_prompt),
      schema: response_schema,
      context: 'no context, use your known knowledge of LLM',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log(response.data);
  let data = extractJSON(response.data);

  // @ts-ignore
  const tools = data?.tools || [];

  return tools;
};

const invoke_tools = async (tools: string[], user_prompt: string) => {
  const responses: {
    response: string;
    sources: {
      title: string;
      description: string;
      url: string;
      favicon: string;
    }[];
  }[] = [];

  const promises = [];

  for (const tool of tools) {
    if (TOOL_MAP[tool]) {
      promises.push(
        TOOL_MAP[tool].invoke(user_prompt).then((response) => {
          emit('tool_response', {
            tool: tool,
            ...response,
          });
          responses.push(response);
        })
      );
    }
  }

  await Promise.all(promises);

  return responses;
};

export { manager, invoke_tools };
