"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { applyTheme } from "@/layouts/ThemeLayout";

const PRIDE_MEMBERS = [
  {
    id: 1,
    nickname: "Gromov",
    rank: "Сержант",
    roles: ["Командир отделения", "Медик"],
    reason: "За выдающееся руководство отрядом в операции 'Песчаная буря'.",
    squadImage: "AK-74__163.png",
    discordAvatar: "https://placehold.co/80x80/222/555?text=AV",
    awards: ["🎖️", "🏅"],
  },
  {
    id: 2,
    nickname: "Sokol",
    rank: "Рядовой",
    roles: ["Снайпер", "Разведчик"],
    reason: "Уничтожение скрытой ФОБ противника в одиночку.",
    squadImage: "AK-74__163.png",
    discordAvatar: "https://placehold.co/80x80/222/555?text=AV",
    awards: ["🎯"],
  },
  {
    id: 3,
    nickname: "Sokol",
    rank: "Рядовой",
    roles: ["Снайпер", "Разведчик"],
    reason: "Уничтожение скрытой ФОБ противника в одиночку.",
    squadImage: "AK-74__163.png",
    discordAvatar: "https://placehold.co/80x80/222/555?text=AV",
    awards: ["🎯"],
  },
  {
    id: 4,
    nickname: "Sokol",
    rank: "Рядовой",
    roles: ["Снайпер", "Разведчик"],
    reason: "Уничтожение скрытой ФОБ противника в одиночку.",
    squadImage: "AK-74__163.png",
    discordAvatar: "https://placehold.co/80x80/222/555?text=AV",
    awards: ["🎯"],
  },
  {
    id: 5,
    nickname: "Sokol",
    rank: "Рядовой",
    roles: ["Снайпер", "Разведчик"],
    reason: "Уничтожение скрытой ФОБ противника в одиночку.",
    squadImage: "AK-74__163.png",
    discordAvatar: "https://placehold.co/80x80/222/555?text=AV",
    awards: ["🎯"],
  },
  {
    id: 6,
    nickname: "Sokol",
    rank: "Рядовой",
    roles: ["Снайпер", "Разведчик"],
    reason: "Уничтожение скрытой ФОБ противника в одиночку.",
    squadImage: "AK-74__163.png",
    discordAvatar: "https://placehold.co/80x80/222/555?text=AV",
    awards: ["🎯"],
  },
  {
    id: 7,
    nickname: "Sokol",
    rank: "Рядовой",
    roles: ["Снайпер", "Разведчик"],
    reason: "Уничтожение скрытой ФОБ противника в одиночку.",
    squadImage: "AK-74__163.png",
    discordAvatar: "https://placehold.co/80x80/222/555?text=AV",
    awards: ["🎯"],
  },
];

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    applyTheme("dark");
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollLeft();
      if (e.key === "ArrowRight") scrollRight();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mounted]);

  if (!mounted) return null;

  const toggleTheme = () => {
    setIsDark((prevIsDark) => {
      const nextTheme = !prevIsDark;
      applyTheme(nextTheme ? "dark" : "light");
      return nextTheme;
    });
  };

  return (
    <div className="transition-colors duration-300 bg-bg-primary overflow-x-hidden font-text">
      <header className="fixed top-0 z-50 w-full h-14 border-b border-bg-secondary bg-bg-primary backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl flex items-center gap-2 text-text-primary hover:text-text-secondary-accent uppercase px-2 py-0.5 transition-colors">
              <img src="b900b76c06a65d8b.png" className="object-cover w-8 h-8 my-1" alt="" />
              РХБЗ
            </Link>
            <Link href="#" className="text-xl font-text text-text-primary hover:text-text-secondary-accent transition-colors">
              Обзор
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="#" className="bg-accent hover:bg-accent-hover text-black font-text-bold px-4 py-2 transition-all">
              Вступить
            </Link>
            
            <button onClick={toggleTheme} className="hover:opacity-70 text-xl transition-opacity">
              {isDark ? "☀️" : "🌙"}
            </button>

            <Link href="/profile" className="border border-bg-secondary dark:border-[#1c1c1c] p-1.5 grayscale hover:grayscale-0 transition-all">
              👤
            </Link>
          </div>
        </div>
      </header>

      {/* === HERO SECTION === */}
      <section className="relative h-[80vh] flex items-center justify-center pt-14">
        <div className="absolute inset-0 z-0 bg-bg-primary">
          <img 
            src="image1111.png" 
            className="w-full h-full object-cover opacity-90 grayscale-25 object-center"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black opacity-70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-7xl md:text-9xl font-header text-text-white leading-none">
            [РХБЗ]
          </h1>
          <p className="text-3xl mt-4 font-text-decorative text-text-primary-accent text-shadow-lg text-shadow-black">
            Клан в Squad с военным RP
          </p>
        </div>
      </section>

      {/* === DESCRIPTION === */}
      <section className="max-w-3xl mx-auto px-6 py-24 border-x border-black/5 dark:border-white/5">
        <h2 className="text-xs font-text-bold uppercase tracking-[0.3em] text-text-secondary-accent mb-6 text-[20px] font-black">О подразделении</h2>
        <p className="text-xl md:text-2xl font-text text-text-secondary font-light leading-relaxed">
          Мы фокусируемся на глубокой симуляции боевых действий. Дисциплина — это не ограничение, а инструмент победы. В [РХБЗ] каждый боец знает свой сектор, свою задачу и своего товарища.
        </p>
      </section>

      {/* === GALLERY: ГОРДОСТЬ === */}
      <section className="py-24 bg-bg-secondary border-y border-black/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-header text-text-primary uppercase tracking-tighter">Наша гордость</h2>
          <span className="block w-12 h-1 bg-accent mx-auto mt-2"></span>
        </div>

        <div className="relative group max-w-[1600px] mx-auto">
          <button 
            onClick={scrollLeft} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-bg-primary border-2 border-accent text-text-primary hover:bg-accent hover:text-black font-black text-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
            aria-label="Листать влево"
          >
            &#10094;
          </button>

          <div 
            ref={carouselRef} 
            className="flex overflow-x-auto gap-4 px-4 py-4 scroll-smooth snap-x snap-mandatory hide-scrollbar"
          >
            {PRIDE_MEMBERS.map((m) => (
              <div key={m.id} className="w-[320px] shrink-0 bg-bg-primary border border-bg-secondary relative group/card snap-center flex flex-col shadow-md hover:shadow-lg transition-shadow">
                <div className="h-64 bg-gradient-to-t from-bg-dark via-transparent to-transparent overflow-hidden shrink-0">
                  <img src={m.squadImage} className="w-full h-full object-cover object-top transition-all duration-500" alt=""/>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center space-x-4 mb-6">
                    <img src={m.discordAvatar} className="w-12 h-12 border border-bg-secondary" alt={`${m.nickname}'s avatar`}/>
                    <div>
                      <h3 className="font-text font-black text-text-primary leading-none text-lg">{m.nickname}</h3>
                      <p className="font-text text-text-secondary-accent text-sm mt-1">{m.rank}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-text text-text-secondary mb-2">Назначение:</p>
                    <div className="flex flex-wrap gap-2">
                      {m.roles.map(r => <span key={r} className="text-[10px] font-text text-text-secondary border border-bg-secondary bg-bg-accent px-2 py-0.5 uppercase whitespace-nowrap">{r}</span>)}
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-text leading-relaxed text-text-secondary border-l-2 border-accent pl-3 w-full break-words">
                      {m.reason}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-2">
                    {m.awards.map((a, i) => <span key={i} className="cursor-help text-lg">{a}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={scrollRight} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-bg-primary border-2 border-accent text-text-primary hover:bg-accent hover:text-black font-black text-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
            aria-label="Листать вправо"
          >
            &#10095;
          </button>
        </div>

        <div className="text-center mt-12">
          <Link href="/members" className="text-[12px] font-text-bold text-text-primary uppercase font-black tracking-widest border-b-2 border-black dark:border-white pb-1 hover:text-text-secondary-accent hover:border-text-secondary-accent transition-all">
            Показать весь состав
          </Link>
        </div>
      </section>

      {/* === JOIN BUTTON === */}
      <section className="py-32 text-center">
        <Link href="#" className="inline-block relative group">
          <div className="absolute inset-0 bg-accent translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
          <div className="relative border-2 border-border-secondary bg-bg-accent px-12 py-6 text-xl font-text-bold font-black text-text-primary uppercase tracking-widest group-hover:bg-accent group-hover:text-black transition-colors">
            Я хочу вступить
          </div>
        </Link>
      </section>
    </div>
  );
}