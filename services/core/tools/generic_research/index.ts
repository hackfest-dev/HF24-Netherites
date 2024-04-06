import Tool from '../tool';

import researcher from '../researcher';

export default class GenericResearch extends Tool {
  invoke(user_prompt: string) {
    const research_context =
      'You are a general purpose research agent which will search the web to satisfy user quries';

    const response = researcher(user_prompt, research_context);

    return response;
  }
}
