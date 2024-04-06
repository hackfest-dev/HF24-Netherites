import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";

import image from "../../lib/tesla-robotaxi.jpg";

//@ts-ignore
export function NewsCard({ news, index }) {
    return (
        <Card style={{ height: '120px', overflow: 'hidden', width: '700px' }}>
            <div className="flex flex-row items-center"> {/* Updated to add items-center for vertical alignment */}
                <div className="w-20 h-20 mx-auto"> {/* Adjusted margin for spacing */}
                    <img
                        src={image}
                        className="w-full h-full object-contain"
                        alt="News Image"
                    />
                </div>
                <div className="flex flex-col flex-grow"> {/* Adjusted layout to allow flex-grow for the description */}
                    <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                        <div className="flex flex-col space-y-1">
                            <CardTitle>{news.headline}</CardTitle>
                            <CardDescription>
                                {news.description}
                            </CardDescription>
                        </div>
                    </CardHeader>
                </div>
            </div>
        </Card>
    );
}
