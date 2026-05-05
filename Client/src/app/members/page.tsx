"use client";

import React from "react";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";

interface Member {
    rank: string;
    nickname: string;
    roles: string[];
    kit: string;
    steamId: string;
    discordId: string;
    activity: number;
}

const MEMBERS_DATA: Member[] = [
    {
        rank: "Генерал-Майор",
        nickname: "Дениска",
        roles: ["Senior C# разработчик", "Пивонос"],
        kit: "Стрелок",
        steamId: "76561198000000001",
        discordId: "234567890123456789",
        activity: 100
    },
    {
        rank: "Ст. Лейтенант",
        nickname: "NikitaNet",
        roles: ["Начальник службы связи"],
        kit: "Марксмен",
        steamId: "76561198000000002",
        discordId: "345678901234567890",
        activity: 85
    },
    {
        rank: "Полковник",
        nickname: "Ярек",
        roles: ["Старый пират", "друг флинта", "Не женат"],
        kit: "Пилот",
        steamId: "76561198000000003",
        discordId: "456789012345678901",
        activity: 92
    }
];

const COLUMNS_CONFIG: ColumnConfig[] = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: true, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: true, filterable: true },
    { key: "activity", label: "Активность", sortable: true, filterable: false }
];

export default function MembersPage() {
    const handleExport = (dataToExport: Member[]) => {
        console.log("Экспорт данных:", dataToExport);
        alert("Модальное окно выбора полей для экспорта");
    };

    return (
        <main className="min-h-screen bg-bg-primary pt-24 pb-12 px-8">
        <div className="max-w-[1400px] mx-auto">
            <header className="mb-12">
            <h1 className="text-5xl font-header text-text-primary uppercase tracking-tighter mb-2">
                Личный состав
            </h1>
            <p className="text-text-secondary font-text italic">
                Реестр зарегистрированных бойцов подразделения [РХБЗ]
            </p>
            </header>

            <section className="bg-bg-primary border border-bg-secondary p-8 shadow-2xl">
            <UniversalTable 
                data={MEMBERS_DATA} 
                columns={COLUMNS_CONFIG} 
                onExport={handleExport}
                defaultSort={{ key: "rank", direction: "desc" }}
            />
            </section>
        </div>
        </main>
    );
}