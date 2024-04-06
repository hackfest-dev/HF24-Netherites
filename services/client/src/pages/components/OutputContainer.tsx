import { useEffect, useCallback, useState } from 'react';
import { Skeleton } from '../../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

import Answer from './Answer';
import AnswerSkeleton from './AnswerSkeleton';
import { io } from 'socket.io-client';

// @ts-ignore
const socket = io.connect('http://localhost:8080');

export default function OutputContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
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
    setAnswer(responseData?.response);

    console.log(responseData);
    return responseData;
  }, []);

  const prompt = localStorage.getItem('prompt');
  useEffect(() => {
    console.log(prompt);
    if (prompt) handlePrompt(prompt);
    else navigate('/');
  }, [handlePrompt, navigate, prompt]);

  // @ts-ignore
  socket.on('tool_response', (data) => {
    // @ts-ignore
    console.log('socket data', data);
    setSources((prev) => [...prev, ...data?.sources]);
    setAnswer((prev) => {
      return prev + '\n\n\n\n' + data.response;
    });
  });

  return (
    <div className="py-4 h-full w-full">
      <div className="h-full w-full bg-vcharBlack rounded-lg border-1 border-gray-100 flex justify-center items-start">
        {!isLoading ? (
          <Answer prompt={prompt || ''} sources={sources} answer={answer} />
        ) : (
          <AnswerSkeleton prompt={prompt || ''} />
        )}
      </div>
    </div>
  );
}
