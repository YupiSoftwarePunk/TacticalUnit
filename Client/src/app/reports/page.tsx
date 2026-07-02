"use client";

import React, { useState, useEffect } from "react";
import { MainHeader } from "@/components/Header/MainHeader";
import { SubdivisionService } from "@/shared/api/services/SubdivisionService";
import { PostService } from "@/shared/api/services/postService";

export default function ReportsPage() {
    const [subdivisions, setSubdivisions] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [isMetaLoading, setIsMetaLoading] = useState<boolean>(true);

    const [metric, setMetric] = useState<string>("Активность");
    const [coverage, setCoverage] = useState<string>("Весь клан");
    const [subdivisionId, setSubdivisionId] = useState<number | string>("");
    const [postId, setPostId] = useState<number | string>("");
    const [depth, setDepth] = useState<string>("Боец");
    const [timeInterval, setTimeInterval] = useState<string>("За этот месяц");

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsMetaLoading(true);
        
        Promise.all([
            SubdivisionService.getAll(),
            PostService.getAll()
        ])
            .then(([subsRes, postsRes]) => {
                const subsData = Array.isArray(subsRes) ? subsRes : (subsRes as any)?.value || [];
                const postsData = Array.isArray(postsRes) ? postsRes : (postsRes as any)?.value || [];
                setSubdivisions(subsData);
                setPosts(postsData);

                if (subsData.length > 0) setSubdivisionId(subsData[0].id);
                if (postsData.length > 0) setPostId(postsData[0].id);
            })
            .catch((err) => {
                console.error("Не удалось загрузить списки из штаба:", err);
                setError("Ошибка загрузки конфигурационных списков подразделений/должностей");
            })
            .finally(() => {
                setIsMetaLoading(false);
            });
    }, []);

    const formatDateToDotNotation = (dateStr: string): string => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day}.${month}.${year}`;
    };

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setError(null);
        setImageSrc(null);

        const payload: Record<string, any> = {
            Metric: metric,
            Coverage: coverage,
        };

        if (coverage === "Подразделение") {
            payload["SubdivisionId"] = Number(subdivisionId);
        }
        else if (coverage === "Должность") {
            payload["PostId"] = Number(postId);
        }

        payload["Depth"] = depth;
        payload["Time Interval"] = timeInterval;

        if (timeInterval === "Указать даты") {
            payload["StartDate"] = formatDateToDotNotation(startDate);
            payload["EndDate"] = formatDateToDotNotation(endDate);
        }

        try {
            // Вызов эндпоинта генерации
        } 
        catch (err: any) {
            console.error("Ошибка при генерации отчёта:", err);
            setError(err.message || "Не удалось отправить конфигурацию отчёта");
        } 
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-bg-primary transition-colors duration-300 font-text pb-20 flex flex-col overflow-x-hidden">
            <MainHeader />

            <main className="max-w-[1400px] w-full mx-auto pt-28 px-6 flex-shrink-0">
                <div className="mb-8">
                    <h1 className="text-sm font-text uppercase tracking-widest text-text-secondary">
                        Генерация отчётности
                    </h1>
                    <span className="block w-12 h-0.5 bg-accent mt-1.5"></span>
                </div>

                <div className="bg-bg-secondary border border-border-secondary/40 p-6 shadow-sm mb-8 transition-colors duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary">
                                Метрика
                            </label>
                            <select
                                value={metric}
                                onChange={(e) => setMetric(e.target.value)}
                                className="w-full bg-bg-primary border border-border-secondary/30 p-2 text-sm text-text-primary focus:border-accent outline-none cursor-pointer rounded-none"
                            >
                                <option value="Активность">Активность</option>
                                <option value="Благодарности">Благодарности</option>
                                <option value="Выговора">Выговора</option>
                                <option value="Награждение">Награждение</option>
                                <option value="Численность бойцов">Численность бойцов</option>
                                <option value="Уволенные">Уволенные</option>
                                <option value="Ушедшие в отставку">Ушедшие в отставку</option>
                                <option value="Уволенные и ушедшие в отставку">Уволенные и ушедшие в отставку</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary">
                                Охват
                            </label>
                            <select
                                value={coverage}
                                onChange={(e) => setCoverage(e.target.value)}
                                className="w-full bg-bg-primary border border-border-secondary/30 p-2 text-sm text-text-primary focus:border-accent outline-none cursor-pointer rounded-none"
                            >
                                <option value="Весь клан">Весь клан</option>
                                <option value="Подразделение">Подразделение</option>
                                <option value="Должность">Должность</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary">
                                Глубина
                            </label>
                            <select
                                value={depth}
                                onChange={(e) => setDepth(e.target.value)}
                                className="w-full bg-bg-primary border border-border-secondary/30 p-2 text-sm text-text-primary focus:border-accent outline-none cursor-pointer rounded-none"
                            >
                                <option value="Подразделение верхнего уровня">Подразделение верхнего уровня</option>
                                <option value="Подразделение нижнего уровня">Подразделение нижнего уровня</option>
                                <option value="Должность">Должность</option>
                                <option value="Боец">Боец</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary">
                                Временной промежуток
                            </label>
                            <select
                                value={timeInterval}
                                onChange={(e) => setTimeInterval(e.target.value)}
                                className="w-full bg-bg-primary border border-border-secondary/30 p-2 text-sm text-text-primary focus:border-accent outline-none cursor-pointer rounded-none"
                            >
                                <option value="Всё время">Всё время</option>
                                <option value="Последние 365 дней">Последние 365 дней</option>
                                <option value="Последние 30 дней">Последние 30 дней</option>
                                <option value="Последние 7 дней">Последние 7 дней</option>
                                <option value="За этот год">За этот год</option>
                                <option value="За этот месяц">За этот месяц</option>
                                <option value="За эту неделю">За эту неделю</option>
                                <option value="Указать даты">Указать даты</option>
                            </select>
                        </div>
                    </div>

                    {(coverage === "Подразделение" || coverage === "Должность" || timeInterval === "Указать даты") && (
                        <div className="mt-6 pt-6 border-t border-border-secondary/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">

                            {coverage === "Подразделение" && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-text-bold uppercase tracking-widest text-accent">
                                        Выберите подразделение
                                    </label>
                                    <select
                                        value={subdivisionId}
                                        onChange={(e) => setSubdivisionId(Number(e.target.value))}
                                        disabled={isMetaLoading}
                                        className="w-full bg-bg-primary border border-accent/40 p-2 text-sm text-text-primary focus:border-accent outline-none cursor-pointer rounded-none disabled:opacity-50"
                                    >
                                        {isMetaLoading ? (
                                            <option>Загрузка подразделений...</option>
                                        ) : subdivisions.length === 0 ? (
                                            <option>Подразделений не найдено</option>
                                        ) : (
                                            subdivisions.map((sub) => (
                                                <option key={sub.id} value={sub.id}>
                                                    {sub.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            )}

                            {coverage === "Должность" && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-text-bold uppercase tracking-widest text-accent">
                                        Выберите должность
                                    </label>
                                    <select
                                        value={postId}
                                        onChange={(e) => setPostId(Number(e.target.value))}
                                        disabled={isMetaLoading}
                                        className="w-full bg-bg-primary border border-accent/40 p-2 text-sm text-text-primary focus:border-accent outline-none cursor-pointer rounded-none disabled:opacity-50"
                                    >
                                        {isMetaLoading ? (
                                            <option>Загрузка должностей...</option>
                                        ) : posts.length === 0 ? (
                                            <option>Должностей не найдено</option>
                                        ) : (
                                            posts.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            )}

                            {timeInterval === "Указать даты" && (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-text-bold uppercase tracking-widest text-accent">
                                            Дата начала
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-bg-primary border border-accent/40 p-1.5 text-sm text-text-primary focus:border-accent outline-none rounded-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-text-bold uppercase tracking-widest text-accent">
                                            Дата конца
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full bg-bg-primary border border-accent/40 p-1.5 text-sm text-text-primary focus:border-accent outline-none rounded-none"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className="mt-5">
                        <p className="text-[11px] text-text-secondary/60 leading-relaxed font-text italic">
                            * Если уровень «глубины» будет выше «охвата», то будет выбрана минимальная глубина. 
                            Например, при «глубине» «Подразделение верхнего уровня» и «охвате» «Должность», 
                            всё равно будут отображаться данные по должности.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-8">
                    <button
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                        className="relative group inline-block disabled:opacity-50 disabled:pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                        <div className="relative border border-border-secondary bg-bg-secondary px-6 py-2.5 text-xs font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black cursor-pointer">
                            {isLoading ? "Формирование..." : "Сформировать"}
                        </div>
                    </button>

                    <div className="w-full min-h-[400px] border border-dashed border-border-secondary/30 bg-bg-secondary/40 flex items-center justify-center p-4 transition-all duration-300">
                        {isLoading && (
                            <div className="text-center text-text-secondary font-text uppercase tracking-widest text-xs animate-pulse">
                                Штаб обрабатывает данные конфигурации...
                            </div>
                        )}

                        {error && (
                            <div className="text-center text-red-500 font-text uppercase tracking-widest text-xs">
                                Ошибка: {error}
                            </div>
                        )}

                        {!isLoading && !error && imageSrc && (
                            <div className="max-w-full h-auto animate-in fade-in duration-500 shadow-md border border-border-secondary/20 bg-bg-primary p-2">
                                <img
                                    src={imageSrc}
                                    alt="Сгенерированный отчёт клана"
                                    className="object-contain max-h-[700px] w-full"
                                />
                            </div>
                        )}

                        {!isLoading && !error && !imageSrc && (
                            <div className="text-center text-text-secondary/40 font-text uppercase tracking-widest text-xs selection:bg-transparent">
                                Место для сгенерированного отчёта
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}