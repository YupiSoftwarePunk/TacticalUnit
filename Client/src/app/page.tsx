"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";


const PRIDE_MEMBERS = [
  {
    id: 1,
    nickname: "Gromov",
    rank: "Сержант",
    roles: ["Командир отделения", "Медик"],
    reason: "За выдающееся руководство отрядом в операции 'Песчаная буря'.",
    squadImage: "https://placehold.co/400x300/1a1a1a/ffffff?text=OPERATOR+01",
    discordAvatar: "https://placehold.co/80x80/222/555?text=AV",
    awards: ["🎖️", "🏅"],
  },
  {
    id: 2,
    nickname: "Sokol",
    rank: "Рядовой",
    roles: ["Снайпер", "Разведчик"],
    reason: "Уничтожение скрытой ФОБ противника в одиночку.",
    squadImage: "https://placehold.co/400x300/1a1a1a/ffffff?text=OPERATOR+02",
    discordAvatar: "https://placehold.co/80x80/222/555?text=AV",
    awards: ["🎯"],
  },
];

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`${isDark ? "dark" : ""} bg-white dark:bg-[#0a0a0a] text-black dark:text-[#d1d1d1] transition-colors duration-200`}>
      
      {/* === HEADER: СТРОГИЙ И УЗКИЙ === */}
      <header className="fixed top-0 z-50 w-full h-14 border-b border-black/10 dark:border-[#1c1c1c] bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-black tracking-tighter uppercase border-2 border-black dark:border-[#d1d1d1] px-2 py-0.5">
              РХБЗ
            </Link>
            <Link href="#" className="text-xs uppercase font-bold tracking-[0.2em] hover:text-emerald-500 transition-colors">
              Обзор
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="#" className="bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] uppercase font-black px-4 py-2 tracking-widest transition-all">
              Вступить
            </Link>
            
            <button onClick={() => setIsDark(!isDark)} className="hover:opacity-70">
              {isDark ? "☀️" : "🌙"}
            </button>

            <Link href="#" className="border border-black/20 dark:border-[#1c1c1c] p-1.5 grayscale hover:grayscale-0">
              👤
            </Link>
          </div>
        </div>
      </header>

      {/* === HERO SECTION: ТЕМНЫЙ БАННЕР === */}
      <section className="relative h-[80vh] flex items-center justify-center pt-14">
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src="https://placehold.co/1920x1080/050505/333?text=SQUAD+WARFARE" 
            className="w-full h-full object-cover opacity-50 grayscale"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase leading-none">
            [РХБЗ]
          </h1>
          <p className="mt-4 text-sm md:text-base uppercase tracking-[0.5em] text-emerald-500 font-bold">
            Клан в Squad с военным RP
          </p>
        </div>
      </section>

      {/* === DESCRIPTION === */}
      <section className="max-w-3xl mx-auto px-6 py-24 border-x border-black/5 dark:border-white/5">
        <h2 className="text-xs uppercase tracking-[0.3em] text-emerald-600 mb-6 font-black">/ О подразделении</h2>
        <p className="text-xl md:text-2xl font-light leading-relaxed">
          Мы фокусируемся на глубокой симуляции боевых действий. Дисциплина — это не ограничение, а инструмент победы. В [РХБЗ] каждый боец знает свой сектор, свою задачу и своего товарища.
        </p>
      </section>

      {/* === GALLERY: ГОРДОСТЬ (ОСТРЫЕ УГЛЫ) === */}
      <section className="py-24 bg-[#f5f5f5] dark:bg-[#0d0d0d] border-y border-black/10 dark:border-[#1c1c1c]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Наша гордость</h2>
          <span className="block w-12 h-1 bg-emerald-600 mx-auto mt-2"></span>
        </div>

        <div className="flex overflow-x-auto gap-1 px-4 scrollbar-hide">
          {PRIDE_MEMBERS.map((m) => (
            <div key={m.id} className="min-w-[300px] bg-white dark:bg-[#111] border border-black/10 dark:border-[#1c1c1c] relative group">
              {/* Squad Image */}
              <div className="h-64 bg-black overflow-hidden">
                <img src={m.squadImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>

              {/* Info Card */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img src={m.discordAvatar} className="w-12 h-12 border border-black/20 dark:border-white/20" />
                  <div>
                    <h3 className="font-black uppercase text-lg leading-none">{m.nickname}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">{m.rank}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[9px] uppercase text-gray-500 font-bold mb-2">Назначение:</p>
                  <div className="flex flex-wrap gap-2">
                    {m.roles.map(r => <span key={r} className="text-[10px] border border-black/10 dark:border-white/10 px-2 py-0.5 uppercase">{r}</span>)}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 border-l-2 border-emerald-600 pl-3">
                  {m.reason}
                </p>

                <div className="mt-6 flex gap-2">
                  {m.awards.map((a, i) => <span key={i} className="grayscale hover:grayscale-0 cursor-help">{a}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="#" className="text-[10px] uppercase font-black tracking-widest border-b-2 border-black dark:border-white pb-1 hover:text-emerald-500 hover:border-emerald-500 transition-all">
            Показать весь состав
          </Link>
        </div>
      </section>

      {/* === JOIN BUTTON === */}
      <section className="py-32 text-center">
        <Link href="#" className="inline-block relative group">
          <div className="absolute inset-0 bg-emerald-600 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
          <div className="relative border-2 border-black dark:border-white bg-white dark:bg-[#0a0a0a] px-12 py-6 text-xl font-black uppercase tracking-widest group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            Я хочу вступить
          </div>
        </Link>
      </section>

    </div>
  );
}