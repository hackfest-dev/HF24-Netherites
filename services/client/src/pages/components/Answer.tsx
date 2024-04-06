import { Card } from '../../components/ui/card';

function Answer({
  prompt,
  answer,
  sources,
}: {
  prompt: string;
  answer: string;
  sources: string[];
}) {
  return (
    <div className="w-2/3 h-full flex justify-center items-start pt-10">
      <div>
        <div className="text-2xl space-grotesk">{prompt}</div>
        <div className="text-lg nato-sans mt-4">{answer}</div>
      </div>

      <div className="ml-6">
        <div>
          <h1 className="text-xl space-grotesk mb-6">Sources -</h1>
          <div>
            {sources.map((source, index) => (
              <Card
                key={index}
                className="mt-2 py-1 px-2 hover:text-purple cursor-pointer"
              >
                <a href={source}>{source}</a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Answer;
