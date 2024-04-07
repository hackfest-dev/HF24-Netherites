export function extractJSON(inputString: string | object): object | null {
  if (typeof inputString === 'object') {
    return inputString;
  }

  try {
    return JSON.parse(inputString as string);
  } catch (error) {
    // If parsing fails, attempt to extract JSON from the string
  }

  const jsonRegex: RegExp = /{(?:[^{}\\]|\\.)*}/g;
  let jsonMatches: string[] = [];
  let match;

  while ((match = jsonRegex.exec(inputString as string)) !== null) {
    jsonMatches.push(match[0]);
  }

  if (jsonMatches.length > 0) {
    return JSON.parse(jsonMatches[0]);
  }

  return null;
}
