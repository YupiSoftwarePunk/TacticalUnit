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

  const toggleColorTheme = () => {
      const newTheme = isDark ? "light" : "dark";
      applyTheme(newTheme);
  };

  return (
    <div className="transition-all bg-bg-primary overflow-x-hidden font-sans">
      <header className="fixed top-0 z-50 w-full h-14 border-b border-bg-secondary bg-bg-primary backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl flex items-center gap-2 font-black text-text-primary hover:text-text-secondary-accent tracking-tighter uppercase border-2 border-text-secondary px-2 py-0.5 transition-colors">
              <img src="b900b76c06a65d8b.png" className="object-cover w-8 h-8 my-1" alt="" />
              РХБЗ
            </Link>
            <Link href="#" className="text-sm font-stengazeta uppercase tracking-[0.2em] text-text-primary hover:text-text-secondary-accent transition-colors">
              Обзор
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="#" className="bg-accent hover:bg-accent-hover text-black text-[10px] font-stengazeta uppercase font-black px-4 py-2 tracking-widest transition-all">
              Вступить
            </Link>
            
            <button onClick={() => {setIsDark(!isDark); toggleColorTheme()}} className="hover:opacity-70">
              {isDark ? "☀️" : "🌙"}
            </button>

            <Link href="#" className="border border-bg-secondary dark:border-[#1c1c1c] p-1.5 grayscale hover:grayscale-0">
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
          <h1 className="text-7xl md:text-9xl font-capture tracking-tighter text-text-primary uppercase leading-none">
            [РХБЗ]
          </h1>
          <p className="mt-4 text-sm md:text-lg font-stengazeta uppercase tracking-[0.5em] text-text-primary-accent text-shadow-lg text-shadow-black">
            Клан в Squad с военным RP
          </p>
        </div>
      </section>

      {/* === DESCRIPTION === */}
      <section className="max-w-3xl mx-auto px-6 py-24 border-x border-black/5 dark:border-white/5">
        <h2 className="text-xs font-stengazeta uppercase tracking-[0.3em] text-text-secondary-accent mb-6 text-[20px] font-black">О подразделении</h2>
        <p className="text-xl md:text-2xl font-sans text-text-secondary font-light leading-relaxed">
          Мы фокусируемся на глубокой симуляции боевых действий. Дисциплина — это не ограничение, а инструмент победы. В [РХБЗ] каждый боец знает свой сектор, свою задачу и своего товарища.
        </p>
      </section>

      {/* === GALLERY: ГОРДОСТЬ === */}
      <section className="py-24 bg-bg-secondary border-y border-black/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-capture text-text-primary uppercase tracking-tighter">Наша гордость</h2>
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
            className="flex overflow-x-auto gap-1 px-4 scroll-smooth snap-x snap-mandatory"
          >
            {PRIDE_MEMBERS.map((m) => (
              <div key={m.id} className="min-w-[300px] bg-bg-primary border border-bg-secondary relative group/card snap-center">
                <div className="h-64 bg-gradient-to-t from-bg-dark via-transparent to-transparent overflow-hidden">
                  <img src={m.squadImage} className="w-full h-full object-cover object-top transition-all duration-500" />
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <img src={m.discordAvatar} className="w-12 h-12 border border-bg-secondary" />
                    <div>
                      <h3 className="font-stengazeta font-black text-text-primary uppercase text-lg leading-none">{m.nickname}</h3>
                      <p className="text-[12px] font-stengazeta uppercase tracking-widest text-text-secondary-accent font-bold">{m.rank}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[9px] font-stengazeta uppercase text-text-secondary font-bold mb-2">Назначение:</p>
                    <div className="flex flex-wrap gap-2 ">
                      {m.roles.map(r => <span key={r} className="text-[10px] font-sans text-text-secondary border border-bg-secondary bg-bg-accent px-2 py-0.5 uppercase">{r}</span>)}
                    </div>
                  </div>

                  <p className="text-xs font-sans leading-relaxed text-text-secondary border-l-2 border-accent pl-3 w-70">
                    {m.reason}
                  </p>

                  <div className="mt-6 flex gap-2 ">
                    {m.awards.map((a, i) => <span key={i} className="cursor-help">{a}</span>)}
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
          <Link href="#" className="text-[12px] font-stengazeta text-text-primary uppercase font-black tracking-widest border-b-2 border-black dark:border-white pb-1 hover:text-text-secondary-accent hover:border-text-secondary-accent transition-all">
            Показать весь состав
          </Link>
        </div>
      </section>

      {/* === JOIN BUTTON === */}
      <section className="py-32 text-center">
        <Link href="#" className="inline-block relative group">
          <div className="absolute inset-0 bg-accent translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
          <div className="relative border-2 border-border-secondary bg-bg-accent px-12 py-6 text-xl font-stengazeta font-black text-text-primary uppercase tracking-widest group-hover:bg-accent group-hover:text-black transition-colors">
            Я хочу вступить
          </div>
        </Link>
      </section>
    </div>
  );
}