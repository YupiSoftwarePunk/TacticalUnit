import { CircleX, Cog, RefreshCw } from "lucide-react";
import { useRouter } from 'next/navigation';

export const LoadingScreen = () =>{



    return(
    <div className="flex  text-text-primary bg-bg-primary w-screen h-screen font-text-bold overflow-clip">
        {/* <div className="absolute flex h-screen w-[400vh] max-h-screen overflow-clip">
            <div className="absolute flex h-screen mt-[-50vh] w-[400vh]  opacity-20 animate-[moveAndReturn_10s_linear_infinite] max-h-screen">

                <div className="flex flex-1 rotate-25 h-[200%] bg-accent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-transparent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-accent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-transparent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-accent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-transparent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-accent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-transparent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-accent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-transparent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-accent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-transparent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-accent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-transparent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-accent"></div>
                <div className="flex flex-1 rotate-25 h-[200%] bg-transparent"></div>
            </div>
        </div> */}

        <div className="absolute flex w-screen h-screen content-center justify-center">
            <Cog className="flex size-50 animate-[spin_2s_linear_infinite] align-middle opacity-10 self-center justify-center text-center"></Cog>
        </div>
        <div className="flex z-10 flex-1 self-center justify-center text-center content-center  text-3xl">Загрузка...</div>
    </div>
);
}
interface IErrorScreen{
    error? : string
}
export const ErrorScreen = ({error} : IErrorScreen) =>{
    const router = useRouter();


    return(
    <div className="flex absolute flex-col gap-20 align-middle content-center justify-center text-text-primary bg-bg-primary w-screen h-screen font-text-bold overflow-clip">
        
        <div className="flex relative content-center justify-center">
            
            <div className="absolute flex self-center content-center justify-center">
                <CircleX className="flex size-50 align-middle text-red-600 opacity-5 animate-pulse self-center justify-center text-center"></CircleX>
            </div>
            <div className="absolute z-10 flex-1 self-center justify-center text-center content-center  text-3xl">Возникла ошибка</div>
        {
            error &&
            <div className="flex top-40 absolute max-w-120 self-center z-10 text-xl cursor-copy" onClick={()=>{navigator.clipboard.writeText(error)}}>
                Текст ошибки: {error}
            </div>
        }
        
        </div>
        <div className="bg-bg-secondary bottom-5 flex self-center absolute text-xl px-6 py-2 gap-0 text-text-primary">
            <button className="hover:bg-accent px-5 hover:text-black transition-all cursor-pointer" onClick={()=>{router.back()}}>Назад</button>
            <div className="flex border-r"/>
            <a href="/" className="hover:bg-accent px-5 hover:text-black transition-all" >Главная страница</a>
        </div>
    </div>
);
}