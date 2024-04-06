import { Card } from '../../components/ui/card';

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

function Answer({
  prompt,
  answer,
  sources,
}: {
  prompt: string;
  answer: string;
  sources: {
    title: string;
    description: string;
    url: string;
    favicon: string;
  }[];
}) {
  console.log(prompt, answer, sources);

  return (
    <div className="w-2/3 h-full flex justify-center items-start pt-10">
      <div className="w-2/3">
        <div className="text-2xl space-grotesk">{prompt}</div>
        <div className="text-lg nato-sans mt-4">{answer}</div>
      </div>

      <div className="ml-6 w-1/3">
        <div>
          <h1 className="text-xl space-grotesk mb-6">Sources -</h1>
          <div>
            {sources.map((source, index) => (
              <Card
                key={index}
                className="mt-2 w-full h-auto hover:text-purple cursor-pointer flex items-center px-6 py-4 text-wrap"
              >
                <img src={source.favicon} className="h-6 mr-4" />
                <a href={source.url}>
                  <div>
                    <div className="text-md noto-sans ">
                      {truncateText(source.title, 50)}
                    </div>
                    <div className="text-xs text-wrap">
                      {truncateText(source.description, 100)}
                      {/*<p>{truncateText(source.url, 50)}</p>*/}
                    </div>
                  </div>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Answer;
