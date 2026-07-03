'use client';
import React from "react";
import { CircleX, Cog, RefreshCw } from "lucide-react";
import { useRouter } from 'next/navigation';
import { MainHeader } from "../Header/MainHeader";

export const LoadingScreen = () => {
    return (
        <div className="flex flex-col text-text-primary bg-bg-primary w-full min-h-screen font-text-bold relative overflow-hidden">
            <MainHeader />
            <div className="flex-1 flex flex-col items-center justify-center relative px-4 select-none">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Cog className="size-40 sm:size-52 md:size-64 animate-[spin_4s_linear_infinite] opacity-5 text-text-primary" />
                </div>
                <div className="z-10 text-2xl sm:text-3xl tracking-wider animate-pulse uppercase">
                    Загрузка...
                </div>
            </div>
        </div>
    );
};

interface IErrorScreen {
    error?: string;
}

export const ErrorScreen = ({ error }: IErrorScreen) => {
    const router = useRouter();

    const textCut = (text: string) => {
        const modText = structuredClone(text);
        const displayLength = 120;

        if (modText.length > displayLength) {
            return modText.slice(0, displayLength) + "...";
        }
        return modText;
    };

    return (
        <div className="flex flex-col text-text-primary bg-bg-primary w-full min-h-screen font-text-bold relative overflow-y-auto">
            <MainHeader/>

            <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 my-auto w-full max-w-3xl mx-auto text-center gap-6 sm:gap-8">
                <div className="relative flex items-center justify-center min-h-[100px] sm:min-h-[140px] w-full">
                    <CircleX className="size-28 sm:size-40 md:size-48 text-red-600 opacity-5 animate-pulse absolute" />
                    <h2 className="z-10 text-2xl sm:text-3xl md:text-4xl tracking-wide uppercase">
                        Возникла ошибка
                    </h2>
                </div>

                {error && (
                    <div className="z-10 w-full bg-bg-secondary/40 border border-border-secondary/20 p-4 sm:p-5 backdrop-blur-sm animate-in fade-in duration-300">
                        <p className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                            Текст ошибки:
                        </p>
                        <p 
                            className="text-sm sm:text-base font-mono break-words hover:underline cursor-copy select-all selection:bg-accent/30 leading-relaxed" 
                            onClick={() => navigator.clipboard.writeText(error)}
                            title="Нажмите, чтобы скопировать">
                            {textCut(error)}
                        </p>
                    </div>
                )}
            </div>

            <div className="w-full bg-bg-secondary border-t border-border-secondary/20 py-3 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 sm:divide-x divide-border-secondary/40 text-base sm:text-lg sticky bottom-0">
                <button 
                    className="w-full sm:w-auto hover:bg-accent px-6 py-2.5 sm:py-1 hover:text-black transition-all cursor-pointer text-center uppercase tracking-wider text-sm sm:text-base" 
                    onClick={() => router.back()}
                >Назад</button>
                <a 
                    href="/" 
                    className="w-full sm:w-auto hover:bg-accent px-6 py-2.5 sm:py-1 hover:text-black transition-all text-center uppercase tracking-wider text-sm sm:text-base">
                    Главная страница
                </a>
            </div>
        </div>
    );
};