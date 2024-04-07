import { useEffect, useCallback, useState } from 'react';
import { Skeleton } from '../../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

import Answer from './Answer';
import AnswerSkeleton from './AnswerSkeleton';
import { io } from 'socket.io-client';

// @ts-ignore
const socket = io.connect('http://localhost:8080');
// @ts-ignore

export default function OutputContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [sources, setSources] = useState([]);

  const navigate = useNavigate();
  const handlePrompt = useCallback(async (promptValue: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // You can adjust the content type as needed
      },
    };
    setIsLoading(true);
    const response = await fetch(
      `http://172.16.16.251:8080/generate?prompt=${promptValue}`,
      options
    );

    setIsLoading(false);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();

    setSources(responseData?.sources);
    setAnswers([responseData?.response]);

    console.log(responseData);
    return responseData;
  }, []);

  const handleAutoPrompt = useCallback(async (promptValue: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // You can adjust the content type as needed
      },
    };
    setIsLoading(true);
    fetch(
      `http://172.16.16.251:8080/autonomous?prompt=${promptValue}`,
      options
    );
  }, []);

  const prompt = localStorage.getItem('prompt');
  useEffect(() => {
    const prompt = localStorage.getItem('prompt');
    console.log(prompt);
    if (prompt) handleAutoPrompt(prompt);
    else navigate('/');
  }, []);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  socket.on('tool_response', (data) => {
    // @ts-ignore

    if (data.message) return;
    console.log('socket data', data);
    setIsLoading(false);

    const removeDuplicateSources = (sources) => {
      const uniqueSources = new Map();
      sources.forEach((source) => {
        uniqueSources.set(source.url, source);
      });
      return Array.from(uniqueSources.values());
    };

    const removeDuplicateAnswers = (answers) => {
      return [...new Set(answers)];
    };

    setSources((prev) => removeDuplicateSources([...prev, ...data?.sources]));
    setAnswers((prev) => removeDuplicateAnswers([...prev, data?.response]));
  });

  return (
    <div className="py-4 h-full w-full">
      <div className="h-full w-full bg-vcharBlack rounded-lg border-1 border-gray-100 flex justify-center items-start">
        {!isLoading ? (
          <Answer prompt={prompt || ''} sources={sources} answers={answers} />
        ) : (
          <AnswerSkeleton prompt={prompt || ''} />
        )}
      </div>
    </div>
  );
}
