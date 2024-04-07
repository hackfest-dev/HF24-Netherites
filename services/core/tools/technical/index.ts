import Tool from '../tool';
import axios from 'axios';
export default class TechnicalAnalysis extends Tool {
  async invoke(user_prompt: string) {
    try {
      let response = undefined;
      const llmResponse = await axios.post(
        'http://localhost:5001/generate_response',
        {
          prompt: `
                Given the following user prompt, identify the company name from the given prompt and also identify the time range of information 
                the user wants the information about. eg:- for 7 days output should be 7d  and for 1 month output should be 1m also for others likely 1y, 5y, 10y etc.
              
                user prompt : ${user_prompt}
              `,
          schema: `{
                "company_name": { "type": "str", "value":"name of the company user wants to search" },
                "interval": { "type": "str", "value": "time range of information user wants to search" }
              }`,
          context: 'no context, use your known knowledge of LLM',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const company_name = llmResponse.data.company_name;
      const interval = llmResponse.data.interval;

      const tradingViewResponse = await axios.get(
        `http://localhost:5003/tradingview?company_name=${company_name}&interval=${interval}`
      );

      const values = tradingViewResponse.data.values;
      const symbol = tradingViewResponse.data.symbol;

      const research = await axios.post(
        'http://localhost:5001/generate_response',
        {
          prompt: `
                Given the following user prompt, based on the data of the values of the company's stock price, generate a technical analysis of the company's stock price.
                what the factors would affect and what would be the risks and benefits of investing in the company's stock.

                user prompt : This are the values of the stock prices and values in json format ${values}
              `,
          schema: `{"analysis": { "type": "str", "value":"technical analysis of the company's stock price" }}`,
          context: 'no context, use your known knowledge of LLM',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const analysis = research.data.analysis;

      response = {
        response: analysis,
        sources: [
          {
            title: 'TradingView',
            description: `Technical Analysis of ${company_name} `,
            url: `http://in.tradingview.com/symbols/BSE-${symbol}`,
            favicon: 'https://www.tradingview.com/static/images/favicon.ico',
          },
        ],
      };
      return response;
    } catch (error) {
      console.log('error', error);
      return {
        response: '',
        sources: [],
      };
    }
  }
}
