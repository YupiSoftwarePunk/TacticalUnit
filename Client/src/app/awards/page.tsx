"use client";

import { useState } from "react";
import Link from "next/link";
import { MainHeader } from "@/components/Header/MainHeader";

interface Award {
    id: string;
    title: string;
    image: string;
    slug: string;
}

<div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
const AWARDS_DATA: Award[] = [
    { id: "1", title: "За отвагу I степени", image: "-_-.jpg", slug: "bravery-1" },
    { id: "2", title: "Мастер маскировки", image: "-_-.jpg", slug: "master-scout" },
    { id: "3", title: "Ветеран РХБЗ", image: "-_-.jpg", slug: "veteran" },
    { id: "4", title: "Лучший медик", image: "-_-.jpg", slug: "best-medic" },
    { id: "5", title: "Огневая поддержка", image: "-_-.jpg", slug: "fire-support" },
    { id: "6", title: "Снайперская элита", image: "-_-.jpg", slug: "sniper-elite" },
];

export default function AwardsPage() {
    const [hasAdminPermission] = useState(true);
    const [hasAwardPermission] = useState(true);


    return (
        <div className="flex flex-col h-full">
            <MainHeader></MainHeader>
            <div className="min-h-screen bg-bg-primary transition-colors duration-300 font-text pb-20">

            <main className="max-w-[1200px] mx-auto pt-32 px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-5xl font-header text-text-primary uppercase tracking-wider">
                    Витрина наград
                    </h1>
                    <span className="block w-20 h-1 bg-accent mt-2"></span>
                </div>

                {hasAdminPermission && (
                    <Link 
                    href="/awards/create-award" 
                    className="relative group inline-block"
                    >
                    <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                    <div className="relative border border-border-secondary bg-bg-accent px-6 py-3 text-sm font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black">
                        + Ввести новую награду
                    </div>
                    </Link>
                )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {AWARDS_DATA.map((award) => (
                    <div key={award.id} className="group relative flex flex-col items-center">
                    <Link 
                        href={`/awards/${award.slug}`}
                        className="relative aspect-square w-full bg-bg-secondary border border-bg-secondary overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:border-accent"
                    >
                        <img 
                        src={award.image} 
                        alt={award.title}
                        className="w-full h-full object-contain p-6 transition-all duration-500"
                        />
                    </Link>

                    <div className="mt-4 text-center w-full">
                        <h3 className="text-sm font-text-bold text-text-primary uppercase tracking-wider group-hover:text-accent transition-colors">
                        {award.title}
                        </h3>

                        {hasAwardPermission && (
                        <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-300 ease-in-out">
                            <Link 
                            href={`/awards/${award.slug}`}
                            className="inline-block mt-2 text-[10px] font-black text-accent uppercase tracking-widest border-b border-accent hover:text-text-primary hover:border-text-primary transition-all"
                            >
                            Наградить бойцов
                            </Link>
                        </div>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            </main>
            </div>
            </div>
    );
}