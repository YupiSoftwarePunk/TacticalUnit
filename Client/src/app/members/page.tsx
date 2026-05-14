"use client";

import React from "react";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";

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
        discordId: "00000000000000000"
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
    }
];

const COLUMNS_CONFIG: ColumnConfig[] = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "top_role", label: "Наивысшая должность", sortable: true, filterable: false },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "unit", label: "Подразделение", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },

    { key: "activity_week", label: "Активность за неделю", sortable: true, filterable: false },
    { key: "activity_month", label: "Активность за месяц", sortable: true, filterable: false },
    { key: "activity_year", label: "Активность за год", sortable: true, filterable: false },
    { key: "activity_total", label: "Активность за всё время", sortable: true, filterable: false },
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
                    />
                </section>
            </div>
        </main>
    );
}