import { LoaderCircle } from "lucide-react";    

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoaderCircle className="h-12 w-12 text-orange-500 animate-spin" />
        </div>
    )
};

export default Loader;