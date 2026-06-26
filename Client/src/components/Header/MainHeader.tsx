"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { applyTheme } from "@/layouts/ThemeLayout";
import { useAuth } from "@/context/AuthContext";

export interface IHeader {
    isDark: boolean;
    changeThemeMethod: () => void;
}

export const MainHeader = () => {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, isLoading, login, logout } = useAuth();
    const [profileLink, setProfileLink] = useState<string>("");

    function userFromLocalStorage() {
        if (typeof window !== "undefined") {
            let userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string)?.discord_id : null;
            return userId;
        }
        return null;
    }

    useEffect(() => {
        setProfileLink(userFromLocalStorage());
    }, [isAuthenticated]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setIsDark(false);
            applyTheme("light");
        } 
        else {
            applyTheme("dark");
        }
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setIsDark((prevIsDark) => {
            const nextTheme = !prevIsDark;
            applyTheme(nextTheme ? "dark" : "light");
            localStorage.setItem("theme", nextTheme ? "dark" : "light");
            return nextTheme;
        });
    };

    return (
        <div>
            <div className="h-14 w-full"></div>
            <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-bg-secondary bg-bg-primary/95 backdrop-blur-sm font-text transition-colors">
                <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between relative">
                    
                    <Link href="/" className="text-xl flex items-center gap-2 text-text-primary hover:text-text-secondary-accent uppercase px-2 py-0.5 transition-colors z-50">
                        <img src="/b900b76c06a65d8b.png" className="object-cover w-8 h-8 my-1" alt="POLK" />
                        <span className="font-text-bold tracking-wider">POLK</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/members" className="text-xl font-text text-text-primary hover:text-text-secondary-accent transition-colors">
                            Состав
                        </Link>
                        <Link href="/structure" className="text-xl font-text text-text-primary hover:text-text-secondary-accent transition-colors">
                            Структура
                        </Link>
                        <Link href="/awards" className="text-xl font-text text-text-primary hover:text-text-secondary-accent transition-colors">
                            Награды
                        </Link>
                        <Link href="/reports" className="text-xl font-text text-text-primary hover:text-text-secondary-accent transition-colors">
                            Отчеты
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center space-x-6">
                        {mounted && !isLoading && (
                            <>
                                {!isAuthenticated ? (
                                    <button 
                                        onClick={login}
                                        className="bg-accent hover:bg-accent-hover text-black font-text-bold text-base px-4 py-2 transition-all cursor-pointer">
                                        Войти через Discord
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-4 font-text">
                                        <Link href={`/profile/${profileLink}`} className="text-text-primary hover:bg-bg-accent text-sm font-text-bold bg-bg-secondary px-3 py-1.5 rounded border border-bg-secondary transition-all">
                                            {user?.username} <span className="text-text-primary-accent ml-1 text-xs">[{user?.rank}]</span>
                                        </Link>
                                        <button 
                                            onClick={logout}
                                            className="text-xs text-text-secondary hover:text-text-primary-accent transition-colors cursor-pointer"
                                            title="Выйти из аккаунта">
                                            Выйти
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        
                        <button onClick={toggleTheme} className="hover:opacity-70 text-xl transition-all w-6 h-6 flex items-center justify-center cursor-pointer">
                            <span className={mounted ? "opacity-100" : "opacity-0"}>
                                {isDark ? "☀️" : "🌙"}
                            </span>
                        </button>
                    </div>

                    <div className="flex md:hidden items-center space-x-5 z-50">
                        <button onClick={toggleTheme} className="hover:opacity-70 text-lg transition-all w-6 h-6 flex items-center justify-center cursor-pointer">
                            <span className={mounted ? "opacity-100" : "opacity-0"}>
                                {isDark ? "☀️" : "🌙"}
                            </span>
                        </button>

                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="w-6 h-6 flex flex-col justify-center items-center relative focus:outline-none cursor-pointer"
                            aria-label="Переключить меню"
                        >
                            <span className={`absolute block h-0.5 w-6 bg-text-primary transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : '-translate-y-2'}`} />
                            <span className={`absolute block h-0.5 w-6 bg-text-primary transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                            <span className={`absolute block h-0.5 w-6 bg-text-primary transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-45' : 'translate-y-2'}`} />
                        </button>
                    </div>

                    <div className={`absolute top-14 left-0 w-full bg-bg-primary border-b border-bg-secondary px-6 py-6 flex flex-col gap-6 md:hidden transition-all duration-300 ease-in-out transform origin-top ${isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}`}>
                        {mounted && !isLoading && (
                            <div className="w-full border-b border-bg-secondary/40 pb-4">
                                {!isAuthenticated ? (
                                    <button 
                                        onClick={() => { login(); setIsOpen(false); }}
                                        className="w-full bg-accent hover:bg-accent-hover text-black font-text-bold text-base py-3 text-center transition-all cursor-pointer">
                                        Войти через Discord
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-2.5 w-full bg-bg-secondary/30 border border-border-secondary/20 p-4">
                                        <span className="text-[10px] uppercase tracking-widest text-text-secondary font-text-bold">Личный профиль</span>
                                        <Link 
                                            href={`/profile/${profileLink}`} 
                                            onClick={() => setIsOpen(false)}
                                            className="text-text-primary hover:text-accent text-base font-text-bold transition-all flex justify-between items-center bg-bg-secondary/80 px-4 py-3 border border-border-secondary">
                                            <span className="truncate max-w-[65%]">{user?.username}</span>
                                            <span className="text-accent text-xs font-mono px-2 py-0.5 border border-accent/30 bg-accent/5 truncate max-w-[35%]">
                                                {user?.rank}
                                            </span>
                                        </Link>
                                        <button 
                                            onClick={() => { logout(); setIsOpen(false); }}
                                            className="text-xs text-red-500 hover:text-red-400 transition-colors cursor-pointer text-left font-text-bold tracking-wider uppercase mt-1 px-1"
                                        >
                                            Выйти из системы
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <nav className="flex flex-col gap-1">
                            <Link 
                                href="/members" 
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-text-bold text-text-primary hover:text-text-secondary-accent transition-colors py-2.5 border-b border-bg-secondary/20">
                                Состав
                            </Link>
                            <Link 
                                href="/structure" 
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-text-bold text-text-primary hover:text-text-secondary-accent transition-colors py-2.5 border-b border-bg-secondary/20">
                                Структура
                            </Link>
                            <Link 
                                href="/awards" 
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-text-bold text-text-primary hover:text-text-secondary-accent transition-colors py-2.5">
                                Награды
                            </Link>
                            <Link 
                                href="/reports" 
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-text-bold text-text-primary hover:text-text-secondary-accent transition-colors py-2.5">
                                Отчеты
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
        </div>
    );
};