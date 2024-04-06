import { useEffect, useCallback, useState } from "react";

import { useNavigate } from 'react-router-dom';

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

    const [isLoading, setIsLoading] = useState(false)
    const [answer, setAnswer] = useState('')
    const [sources, setSources] = useState([])



    const navigate = useNavigate()
    const handlePrompt = useCallback(async (promptValue: string) => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // You can adjust the content type as needed
                },

            };
            setIsLoading(true)
            const response = await fetch(`http://172.16.16.251:8080/generate?prompt=${promptValue}`, options);
            setIsLoading(false)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            setSources(responseData?.sources)
            setAnswer(responseData?.response)


            console.log(responseData)
            return responseData;
        } catch (error) {
            throw error;
        }
    }, []);

    useEffect(() => {
        const prompt = localStorage.getItem("prompt")
        console.log(prompt)
        if (prompt) handlePrompt(prompt)
        else navigate('/')
    }, []);

    return (
        <div>
            {!isLoading && <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>

                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold mb-4">Sources</h1>
                        </div>
                        <Card title="Sources" content={sources.map((source, index) => <div key={index}>{source}</div>)} />
                    </div>
                    <div>
                        <div className="flex justify-end">
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold mb-2">Images</h2>
                                <div className="flex flex-wrap">
                                    {/* {dummyData.images.map((image, index) => (
                                        <img key={index} src={image} alt={`Image ${index}`} className="w-20 h-20 rounded-md object-cover mr-2 mb-2" />
                                    ))} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Card title="Answer" content={answer} />
                </div>
            </div>}
            {isLoading && "Loading..."}
        </div>
    )
}

