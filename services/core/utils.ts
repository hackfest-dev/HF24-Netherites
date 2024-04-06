export function extractJSON(inputString: string | object): object | null {
  // Check if the input string itself is a JavaScript object
  if (typeof inputString === 'object') {
    return inputString; // If it's a JavaScript object, return it directly
  }

  // Check if the input string itself is valid JSON
  try {
    return JSON.parse(inputString as string); // If it's valid JSON, return the parsed object
  } catch (error) {
    // If not, continue
  }

  // If the input string is not valid JSON, try to find JSON within it
  const jsonRegex: RegExp = /{(?:[^{}\\]|\\.)*}/g; // Regex to match JSON objects

  let jsonMatches: string[] = [];
  let match;
  // Iterate through the string to find all matches
  while ((match = jsonRegex.exec(inputString as string)) !== null) {
    jsonMatches.push(match[0]);
  }

  // If there are multiple matches, return the first one parsed as JSON
  if (jsonMatches.length > 0) {
    return JSON.parse(jsonMatches[0]);
  }

  // If no valid JSON is found, return null
  return null;
}
