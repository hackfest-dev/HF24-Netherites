import Tool from '../tool';

import researcher from '../researcher';

export default class CompetitorResearch extends Tool {
  invoke(user_prompt: string) {
    const research_context =
      `You are research agent for the stock market research for competitor analysis which will search the web to satisfy user qeuries related to competitor analysis of of a company with any specific company or all competitors or competiitons during a specific period.
       So filter the reserach for competitors of company only. You can use google advance search using params such as inurl:vs,intitle:company_name,intext:competitor, before:specific_date, after:specific_date specified by the user prompt.
       Also remove redundant informationa and focus on major competitors and their analysis. Make sure to highlight on what areas they compete and how they are different from each other.`;

    const response = researcher(user_prompt, research_context);

    return response;
  }
}
