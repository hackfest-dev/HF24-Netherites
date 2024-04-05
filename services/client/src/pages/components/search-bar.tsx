import { Input } from "@/components/ui/input"

function Searchbar() {
    return (
        <div>
            <Input
                type="search"
                placeholder="New Thread"
                className="md:w-[100px] lg:w-[220px] rounded-3xl" // Adding rounded-md class
            />
        </div>
    )
}

export default Searchbar
