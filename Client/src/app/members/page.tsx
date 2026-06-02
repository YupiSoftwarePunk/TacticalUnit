"use client";

import React from "react";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { MainHeader } from "@/components/Header/MainHeader";

interface Member {
    rank: string;
    nickname: string;
    top_role: string;
    roles: string[];
    unit: string;
    activity_week: number;
    activity_month: number;
    activity_year: number;
    activity_total: number;
    kit: string;
    steamId: string;
    discordId: string;
    joinDate: string;
}

const MEMBERS_DATA: Member[] = [
    {
        rank: "Генерал-Майор",
        nickname: "Дениска",
        top_role: "Senior Developer",
        roles: ["Senior Developer", "Пивонос"],
        unit: "Штаб",
        activity_week: 10,
        activity_month: 45,
        activity_year: 500,
        activity_total: 1200,
        kit: "Стрелок",
        steamId: "632641236412378",
        discordId: "00000000000000000",
        joinDate: "12.04.2024"
    },
    {
        rank: "Ст. Лейтенант",
        nickname: "NikitaNet",
        top_role: "Начальник службы связи",
        roles: ["Начальник службы связи"],
        unit: "Связь",
        activity_week: 10,
        activity_month: 75,
        activity_year: 509,
        activity_total: 1300,
        kit: "Марксмен",
        steamId: "76561198000000002",
        discordId: "345678901234567890",
        joinDate: "01.09.2024"
    },
    {
        rank: "Полковник",
        nickname: "Ярек",
        top_role: "Старый пират",
        roles: ["Старый пират", "друг флинта", "Не женат"],
        unit: "Разведка",
        activity_week: 20,
        activity_month: 55,
        activity_year: 900,
        activity_total: 1280,
        kit: "Пилот",
        steamId: "76561198000000003",
        discordId: "456789012345678901",
        joinDate: "24.11.2023"
    }
];

const COLUMNS_CONFIG: ColumnConfig[] = [
    { key: "rank", label: "Звание", sortable: true, filterable: true, className: "text-text-secondary font-light" },
    { key: "top_role", label: "Наивысшая должность", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { 
        key: "roles", 
        label: "Должность", 
        sortable: false, 
        filterable: true, 
        className: "text-text-secondary text-sm italic",
        render: (value) => Array.isArray(value) ? value.join(", ") : value
    },
    { key: "unit", label: "Подразделение", sortable: false, filterable: true, className: "text-text-secondary text-sm" },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true, className: "text-text-secondary text-sm" },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true, className: "text-accent font-bold" },
    
    { key: "activity_week", label: "Активность за неделю", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "activity_month", label: "Активность за месяц", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "activity_year", label: "Активность за год", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "activity_total", label: "Активность за всё время", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "joinDate", label: "Дата вступления", sortable: true, filterable: true, className: "text-text-secondary text-sm font-mono" }
];

export default function MembersPage() {
    const handleExport = (dataToExport: Member[]) => {
        console.log("Экспорт данных:", dataToExport);
        alert("Модальное окно выбора полей для экспорта");
    };

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        alert("Скопировано: " + text);
    };

    return (
        <div className="flex flex-col h-full">
            <MainHeader />
            <main className="min-h-screen bg-bg-primary pt-24 pb-12 px-8">
                <div className="max-w-[1400px] mx-auto">
                    <header className="mb-12">
                        <h1 className="text-5xl font-header text-text-primary uppercase tracking-normal mb-2">
                            Личный состав
                        </h1>
                        <p className="text-text-secondary font-text-regular text-lg">
                            Реестр зарегистрированных бойцов подразделения [РХБЗ]
                        </p>
                    </header>

                    <section className="bg-bg-primary border border-bg-secondary p-8 shadow-2xl">
                        <UniversalTable 
                            data={MEMBERS_DATA} 
                            columns={COLUMNS_CONFIG} 
                            onExport={handleExport}
                            defaultSort={{ key: "rank", direction: "desc" }}
                            renderActions={(item: Member) => (
                                <>
                                    <button 
                                        onClick={() => copyToClipboard(item.steamId)}
                                        className="p-1 border border-bg-secondary hover:border-accent text-[10px] uppercase"
                                    >
                                        Steam_ID
                                    </button>
                                    <button 
                                        onClick={() => copyToClipboard(item.discordId)}
                                        className="p-1 border border-bg-secondary hover:border-accent text-[10px] uppercase"
                                    >
                                        Discord_ID
                                    </button>
                                </>
                            )}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}