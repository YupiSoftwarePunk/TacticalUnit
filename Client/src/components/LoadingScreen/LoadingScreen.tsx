import { RefreshCw } from "lucide-react";

const LoadingScreen = () =>{
    return(
    <div className="flex relative text-text-primary bg-bg-primary w-screen h-screen font-text-bold">
        <div className="absolute flex w-screen h-screen">

            <RefreshCw className="flex size-120 animate-[spin_2s_linear_infinite] flex-1 align-middle opacity-10 self-center justify-center text-center"></RefreshCw>
        </div>
        <div className="flex flex-1 self-center justify-center text-center content-center  text-3xl">Загрузка...</div>
    </div>
);
}
export default LoadingScreen;