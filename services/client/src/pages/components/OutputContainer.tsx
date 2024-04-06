
const dummyData = {
    prompt: "Elon Musk",
    sources: ["Source 1", "Source 2", "Source 3"],
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    images: ["image1.jpg", "image2.jpg", "image3.jpg"]
};
//@ts-ignore
const Card = ({ title, content }) => (
    <div className="border-gray-400 border rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p>{content}</p>
    </div>
);

export default function OutputContainer() {
    return (
        <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-4">{dummyData.prompt}</h1>
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold mb-4">Sources</h1>
                    </div>
                    <Card title="Sources" content={dummyData.sources.map((source, index) => <div key={index}>{source}</div>)} />
                </div>
                <div>
                    <div className="flex justify-end">
                        <div className="ml-4">
                            <h2 className="text-lg font-semibold mb-2">Images</h2>
                            <div className="flex flex-wrap">
                                {dummyData.images.map((image, index) => (
                                    <img key={index} src={image} alt={`Image ${index}`} className="w-20 h-20 rounded-md object-cover mr-2 mb-2" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Card title="Answer" content={dummyData.answer} />
            </div>
        </div>
    )
}

