import Link from "next/link";
import { useEffect, useState } from "react";
import { applyTheme } from "@/layouts/ThemeLayout";

export interface MainHeaderProps {
  currentTheme: "dark" | "light" | "system";
  onThemeChange: (newTheme: "dark" | "light" | "system") => void;
}

export const MainHeader = ({ currentTheme, onThemeChange }: MainHeaderProps) => {
    const handleToggle = () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    onThemeChange(nextTheme);
  };

  const isVisualDark = typeof document !== 'undefined' 
    ? document.documentElement.classList.contains('dark') 
    : currentTheme === "dark";
    
    return(
        <header className="fixed top-0 z-50 w-full h-14 border-b border-bg-secondary bg-bg-primary backdrop-blur-sm font-text">
        <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl flex items-center gap-2 text-text-primary hover:text-text-secondary-accent uppercase px-2 py-0.5 transition-colors">
              <img src="b900b76c06a65d8b.png" className="object-cover w-8 h-8 my-1" alt="" />
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
            <Link href="#" className="bg-accent hover:bg-accent-hover text-black font-text-bold px-4 py-2 transition-all">
              Вступить
            </Link>
            
            <button onClick={handleToggle} className="hover:opacity-70 text-xl transition-opacity">
              {isVisualDark ? "☀️" : "🌙"}
            </button>

            <Link href="/profile" className="border border-bg-secondary dark:border-[#1c1c1c] p-1.5 grayscale hover:grayscale-0 transition-all">
              👤
            </Link>
          </div>
        </div>
      </header>
    );
}