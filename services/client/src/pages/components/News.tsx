

import { NewsCard } from './NewsCard';
import { FaRegCompass } from 'react-icons/fa6';
export default function NewsContainer() {
    const News = [
        {
            headline: "Lorem Ipsum Dolor Sit Amet",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            author: "John Doe",
            date: "2024-04-07",
            category: "General"
        },
        {
            headline: "Sed Do Eiusmod Tempor Incididunt",
            description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            author: "Jane Smith",
            date: "2024-04-06",
            category: "Technology"
        },
        {
            headline: "Ut Enim Ad Minim Veniam",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            author: "James Johnson",
            date: "2024-04-05",
            category: "Politics"
        },
        {
            headline: "Sed Do Eiusmod Tempor Incididunt",
            description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            author: "Jane Smith",
            date: "2024-04-06",
            category: "Technology"
        },
        {
            headline: "Ut Enim Ad Minim Veniam",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            author: "James Johnson",
            date: "2024-04-05",
            category: "Politics"
        },
        {
            headline: "Sed Do Eiusmod Tempor Incididunt",
            description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            author: "Jane Smith",
            date: "2024-04-06",
            category: "Technology"
        },
        {
            headline: "Ut Enim Ad Minim Veniam",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            author: "James Johnson",
            date: "2024-04-05",
            category: "Politics"
        },
    ];
    return (

        <div className='flex flex-col w-full justify-center items-center pt-10'>
            <div className='space-x-4 pb-10 flex flex-row justify-start  '>
                <div><FaRegCompass className='w-10 h-10' /></div>
                <div className="text-4xl space-grotesk">Discover</div>
            </div>

            <div className='pt-10 w-full border-t border-gray-400'></div>
            <div className='flex flex-col overflow-y-auto'>
                {News.map((news, index) => (
                    //@ts-ignore
                    <><NewsCard news={news} index={index} key={index} />
                        <div className='p-2'> </div></>

                ))}
            </div>
        </div>

    )
}
