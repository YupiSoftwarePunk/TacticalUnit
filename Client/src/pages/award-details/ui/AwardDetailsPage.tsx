"use client";

import React, { useState } from "react";
import Link from "next/link";
import UniversalTable from "@/widgets/universalList/universalTable";

const MEMBERS_DATA = [
    {
    rank: "Генерал-Майор",
    nickname: "Дениска",
    top_role: "Senior Developer",
    roles: ["Senior Developer", "Пивонос"],
    kit: "Стрелок",
    steamId: "632641236412378",
    discordId: "00000000000000000"
    },
    {
    rank: "Ст. Лейтенант",
    nickname: "NikitaNet",
    top_role: "Начальник службы связи",
    roles: ["Начальник службы связи"],
    kit: "Марксмен",
    steamId: "76561198000000002",
    discordId: "345678901234567890",
    },
    {
    rank: "Полковник",
    nickname: "Ярек",
    top_role: "Старый пират",
    roles: ["Старый пират", "друг флинта", "Не женат"],
    kit: "Пилот",
    steamId: "76561198000000003",
    discordId: "456789012345678901",
    }
];

const COLUMNS_CONFIG = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
];

export const AwardDetailsPage = ({ slug }: { slug: string }) => {
    const [canEdit] = useState(true);
    const [canGrant] = useState(true);

    const copyDiscordId = () => {
        navigator.clipboard.writeText("ROLE_ID_12345");
        alert("ID роли скопирован");
    };

    return (
        <div className="max-w-[1200px] mx-auto pt-10 px-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 mb-12">

            <div className="w-full md:w-[350px] shrink-0">
            <div className="relative aspect-square bg-[#1a1a1a] border border-white/5 flex items-center justify-center group">
                <img 
                src="/-_-.jpg"
                alt="Award" 
                className="w-4/5 h-4/5 object-contain"
                />
                {canEdit && (
                <button className="absolute bottom-2 right-2 p-2 bg-black/50 hover:bg-accent hover:text-black transition-colors border border-white/10">
                    🖉
                </button>
                )}
            </div>
            <button 
                onClick={copyDiscordId}
                className="mt-2 text-[11px] font-text text-text-secondary border-b border-text-secondary hover:text-accent hover:border-accent transition-all uppercase tracking-tighter"
            >
                Скопировать ID роли
            </button>
            </div>

            <div className="flex-1 space-y-4">
            <div className="relative border border-white/5 bg-[#1a1a1a] p-4 group">
                <h1 className="text-accent font-text-bold uppercase tracking-wider text-lg pr-8">
                Орден "Мастер документооборота III степени"
                </h1>
                {canEdit && <span className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 cursor-pointer transition-opacity">🖉</span>}
            </div>

            <div className="relative border border-white/5 bg-[#1a1a1a] p-4 min-h-[120px] group">
                <p className="text-text-primary font-text text-sm leading-relaxed pr-8">
                Выдается личному составу отдела кадров за безупречную службу и оформление документации клана в течении месяца.
                </p>
                {canEdit && <span className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 cursor-pointer transition-opacity">🖉</span>}
            </div>

            <div className="relative border border-white/5 bg-[#1a1a1a] p-4 min-h-[100px] group">
                <p className="text-text-primary font-text text-sm leading-relaxed pr-8">
                Привилегии
                </p>
                {canEdit && <span className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 cursor-pointer transition-opacity">🖉</span>}
            </div>
            </div>
        </div>

        <div className="mt-16">
            <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-header text-text-primary uppercase tracking-wider">
                Награждённые бойцы
            </h2>
            
            {canGrant && (
                <Link 
                href={`/awards/grant/${slug}`}
                className="text-accent font-text uppercase text-sm border-b-2 border-accent hover:text-white hover:border-white transition-all pb-1"
                >
                Наградить бойцов
                </Link>
            )}
            </div>

            <div className="border border-white/5">
            <UniversalTable 
                data={MEMBERS_DATA} 
                columns={COLUMNS_CONFIG} 
                onExport={(data) => console.log("Exporting:", data)}
            />
            </div>
        </div>
        </div>
    );
};