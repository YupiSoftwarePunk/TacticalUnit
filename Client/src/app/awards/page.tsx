"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainHeader } from "@/components/Header/MainHeader";
import { RewardService } from "@/shared/api/services/RewardService";
import { ImageService } from "@/shared/api/services/imageService";

export default function AwardsPage() {
    const [awards, setAwards] = useState<IReward[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [hasAdminPermission] = useState(true); 
    const [hasAwardPermission] = useState(true);

    useEffect(() => {
        const fetchAwards = async () => {
            try {
                setIsLoading(true);
                const data = await RewardService.getAll();
                setAwards(data);
            } 
            catch (err: any) {
                setError(err.message || "Не удалось загрузить награды");
            } 
            finally {
                setIsLoading(false);
            }
        };

        fetchAwards();
    }, []);

    return (
        <div className="flex flex-col h-full">
            <MainHeader />
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

                    {isLoading && (
                        <div className="text-center text-text-primary text-xl py-10 uppercase tracking-wider">
                            Загрузка витрины...
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-500 text-lg py-10 border border-red-500/30 bg-red-500/10 rounded">
                            Произошла ошибка: {error}
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                            {awards.map((award) => (
                                <div key={award.id} className="group relative flex flex-col items-center">
                                    <Link 
                                        href={`/awards/review-award/${award.id}`}
                                        className="relative aspect-square w-full bg-bg-secondary border border-bg-secondary overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:border-accent"
                                    >
                                        <img
                                            src={ImageService.getRewardUrl(award.id?.toString() || "")}
                                            alt={award.name}
                                            className="w-full h-full object-contain p-6 transition-all duration-500"
                                        />
                                    </Link>

                                    <div className="mt-4 text-center w-full">
                                        <h3 
                                            className="text-sm font-text-bold uppercase tracking-wider group-hover:text-accent transition-colors"
                                            style={{ color: award.color || "var(--text-primary)" }}
                                        >
                                            {award.name}
                                        </h3>

                                        {hasAwardPermission && (
                                            <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-300 ease-in-out">
                                                <Link 
                                                    href={`/awards/assign-award/${award.id}`}
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
                    )}

                    {!isLoading && !error && awards.length === 0 && (
                        <div className="text-center text-text-primary/60 text-lg py-10">
                            Награды еще не созданы.
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}