
import Focus from "./components/focus-navigation"
import TextArea from "./components/text-area"


function HomePage() {

    return (
        <div className="flex items-center justify-center flex-col">

            <div>
                <h1 className="text-4xl tracking-tight lg:text-5xl p-6">
                    Where Knowledge begins
                </h1>
            </div>
            <div className="md:w-[100px] lg:w-[500px]">
                <TextArea />
                <Focus />
            </div>


        </div>
    )
}

export default HomePage
