import { useEffect, useCallback, useState } from 'react';
import { Skeleton } from '../../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

//@ts-ignore
const Card = ({ title, content }) => (
  <div className="border-gray-400 border rounded-lg p-4 mb-4">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p>{content}</p>
  </div>
);

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-52 w-72 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-4 w-72" />
      </div>
    </div>
  );
}

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

  useEffect(() => {
    const prompt = localStorage.getItem('prompt');
    console.log(prompt);
    if (prompt) handlePrompt(prompt);
    else navigate('/');
  }, [handlePrompt, navigate]);

  return (
    <div className="py-4 h-full w-full">
      <div className="h-full w-full bg-vcharBlack rounded-lg border-1 border-gray-100 flex items-center justify-center">
        {!isLoading && (
          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <div className="flex justify-between">
                  <h1 className="text-2xl font-bold mb-4">Sources</h1>
                </div>
                <Card
                  title="Sources"
                  content={sources.map((source, index) => (
                    <div key={index}>{source}</div>
                  ))}
                />
              </div>
              <div>
                <div className="flex justify-end">
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold mb-2">Images</h2>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Card title="Answer" content={answer} />
            </div>
          </div>
        )}
        {isLoading && (
          <div>
            <SkeletonCard />
          </div>
        )}
      </div>
    </div>
  );
}
