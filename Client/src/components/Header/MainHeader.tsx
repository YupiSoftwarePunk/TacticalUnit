"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { applyTheme } from "@/layouts/ThemeLayout";
import { useAuth } from "@/context/AuthContext";

export interface IHeader{
    isDark: boolean,
    changeThemeMethod: () => void
}

export const MainHeader = () => {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { user, isAuthenticated, isLoading, login, logout } = useAuth();

    const discordId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string)?.discord_id : null;

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

    
    useEffect(()=>{
      const token = localStorage.getItem('token');
      

    },
    [isAuthenticated])

    const toggleTheme = () => {
        setIsDark((prevIsDark) => {
          const nextTheme = !prevIsDark;
          applyTheme(nextTheme ? "dark" : "light");
          localStorage.setItem("theme", nextTheme ? "dark" : "light");
          return nextTheme;
        });
    };

    return(
      <div>
        <div className="h-14 flex"></div>
        <header className="fixed top-0 z-50 w-full h-14 border-b border-bg-secondary bg-bg-primary backdrop-blur-sm font-text transition-colors">
        <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl flex items-center gap-2 text-text-primary hover:text-text-secondary-accent uppercase px-2 py-0.5 transition-colors">
              <img src="/b900b76c06a65d8b.png" className="object-cover w-8 h-8 my-1" alt="РХБЗ" />
              РХБЗ
            </Link>
            <Link href="/members" className="text-xl font-text text-text-primary hover:text-text-secondary-accent transition-colors">
              Состав
            </Link>
            <Link href="/structure" className="text-xl font-text text-text-primary hover:text-text-secondary-accent transition-colors">
              Структура
            </Link>
            <Link href="/awards" className="text-xl font-text text-text-primary hover:text-text-secondary-accent transition-colors">
              Награды
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {mounted && !isLoading && (
                <>
                    {!isAuthenticated ? (
                        <button 
                            onClick={login}
                            className="bg-accent hover:bg-accent-hover text-black font-text-bold px-4 py-2 transition-all cursor-pointer"
                        >
                            Войти через Discord
                        </button>
                    ) : (
                        <div className="flex items-center space-x-4 font-text">
                            <span className="text-text-primary text-sm font-text-bold bg-bg-secondary/40 px-3 py-1 rounded border border-bg-secondary">
                                {user?.username} <span className="text-accent ml-1 text-xs">[{user?.rank}]</span>
                            </span>
                            <button 
                                onClick={logout}
                                className="text-xs text-text-secondary hover:text-accent transition-colors cursor-pointer"
                                title="Выйти из аккаунта"
                            >
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

            <Link href={`/profile/${discordId || user?.discord_id}`} className="border border-bg-secondary dark:border-[#1c1c1c] p-1.5 grayscale hover:grayscale-0 transition-all">
              👤
            </Link>
          </div>
        </div>
      </header>
      </div>
    );
}