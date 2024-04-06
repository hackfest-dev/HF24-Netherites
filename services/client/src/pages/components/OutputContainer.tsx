import { useEffect, useCallback, useState } from 'react';
import { Skeleton } from '../../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

import Answer from './Answer';
import AnswerSkeleton from './AnswerSkeleton';

// const responseData = {
//   response:
//     "Here is a technical analysis summary for Tata Motors Ltd based on the information provided:Tata Motors Ltd (TATAMOTORS) is currently trading at 1007.1, slightly down 0.44% from the previous day's close. The trading volume of 4.5 million shares is lower than the 5-period average volume of 7.7 million shares. The stock's technical strength is rated as bullish with a score of 68.2% based on analysis of various indicators:- MACD shows a strong bullish signal with the MACD line crossing above the signal line, indicating upward momentum.- Awesome Oscillator is bullish, showing a recent bullish reversal. - Stochastic RSI and Slow Stochastic are both in overbought territory above 80 but the uptrend appears strong, suggesting further upside potential.- The stock has broken out positively from its Bollinger band, a bullish signal.Moving averages show the stock trading above all key SMAs from the 5-day to 200-day, another bullish indication. Oscillators like RSI, CCI, and Momentum are also in bullish territory.Overall, the technical picture for Tata Motors looks strong based on the prevalent uptrend, bullish indicator signals, and the stock's position relative to moving averages and other technical levels like pivot points and Bollinger bands.",
//   sources: [
//     'https://in.tradingview.com/symbols/NSE-TATAMOTORS/technicals/',
//     'https://trendlyne.com/equity/technical-analysis/TATAMOTORS/1362/tata-motors-ltd/',
//     'https://www.topstockresearch.com/rt/Stock/TATAMOTORS/TechnicalAnalysis',
//   ],
// };

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      {/* <Skeleton className="h-52 w-72 rounded-xl" /> */}
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

  const prompt = localStorage.getItem('prompt');
  useEffect(() => {
    console.log(prompt);
    if (prompt) handlePrompt(prompt);
    else navigate('/');
  }, [handlePrompt, navigate, prompt]);

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
