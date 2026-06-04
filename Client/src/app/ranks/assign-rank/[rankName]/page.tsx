"use client";

import { useState, useEffect } from "react";
import { MainHeader } from "@/components/Header/MainHeader";
import { LoadingScreen, ErrorScreen } from "@/components/StatusScreens/Screens";
import { Check, X, Save } from "lucide-react";
import Link from "next/link";
import React from "react";
import { RankService } from "@/shared/api/services/RankService";

const MOCK_UNITS_DATA = [
    {
        discordId: "123456789",
        nickname: "Дениска",
        currentRank: "Генерал-Майор",
        roles: ["Senior Developer", "Пивонос"],
        steamId: "632641236412378",
    },
    {
        discordId: "987654321",
        nickname: "NikitaNet",
        currentRank: "Ст. Лейтенант",
        roles: ["Начальник службы связи"],
        steamId: "76561198000000002",
    },
    {
        discordId: "555555555",
        nickname: "Ярек",
        currentRank: "Полковник",
        roles: ["Старый пират", "друг флинта"],
        steamId: "76561198000000003",
    },
    {
        discordId: "444444444",
        nickname: "Челик",
        currentRank: "Рядовой",
        roles: ["Стрелок"],
        steamId: "76561198000000004",
    },
    {
        discordId: "333333333",
        nickname: "Боец1",
        currentRank: "Рядовой",
        roles: ["Разведчик"],
        steamId: "76561198000000005",
    },
];

const COLUMNS_CONFIG = [
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "currentRank", label: "Текущее звание", sortable: true, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
];

export default function AssignRankPage({ params }: { params: Promise<{ rankName: string }> }) {
    const { rankName } = React.use(params);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rank, setRank] = useState<IRank | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // позже тута будет API вызов
                // const rankData = await RankService.getById(rankId);
                // setRank(rankData);

                const mockRank: IRank = {
                    Id: 1,
                    Name: rankName || "Генерал-Майор",
                    Color: "#FFD700",
                    CounterToReach: 10,
                    Units: [],
                    GivedPermissions: [],
                    DiscordRoleId: 12345,
                };
                setRank(mockRank);
                setLoading(false);
            } 
            catch (err) {
                setError("Ошибка при загрузке звания");
                setLoading(false);
            }
        };
        fetchData();
    }, [rankName]);

    const toggleUnitSelection = (discordId: string) => {
        const newSelected = new Set(selectedUnits);
        if (newSelected.has(discordId)) {
            newSelected.delete(discordId);
        } 
        else {
            newSelected.add(discordId);
        }
        setSelectedUnits(newSelected);
    };

    const handleAssign = async () => {
        if (!rank || selectedUnits.size === 0) return;
        
        try {
            setIsSaving(true);
            // позже тут тоже будут API вызовы
            // for (const unitDiscordId of selectedUnits) {
            //     await RankService.assignToUnit(rank.Id, {
            //         method: 'POST',
            //         body: JSON.stringify({ unitId: unitDiscordId })
            //     });
            // }

            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsSaving(false);
            setSelectedUnits(new Set());
        } 
        catch (err) {
            setError("Ошибка при присвоении звания");
            setIsSaving(false);
        }
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen error={error} />;
    if (!rank) return <ErrorScreen error="Звание не найдено" />;

    return (
        <div className="flex flex-col h-full">
            <MainHeader />
            <div className="flex flex-1 w-full bg-bg-primary transition-colors duration-300">
                <div className="max-w-[1200px] mx-auto pt-10 px-6 w-full animate-in fade-in duration-500">
                    <div className="mb-12">
                        <div className="flex gap-8 mb-8">
                            <div className="w-full md:w-[200px] shrink-0">
                                <div
                                    className="relative aspect-square border border-black/10 dark:border-white/5 flex items-center justify-center flex-col gap-4"
                                    style={{ backgroundColor: rank.Color }}
                                >
                                    <div className="text-black dark:text-text-primary font-text-bold text-2xl text-center px-4">
                                        {rank.Name}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4">
                                    <h1 className="text-accent font-text-bold uppercase tracking-wider text-lg mb-2">
                                        {rank.Name}
                                    </h1>
                                    <p className="text-text-secondary font-text text-sm">
                                        Количество до повышения: {rank.CounterToReach}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-header text-black dark:text-text-primary uppercase tracking-wider">
                                Выберите бойцов для присвоения звания
                            </h2>
                            <span className="text-sm font-text text-text-secondary">
                                Выбрано: {selectedUnits.size}
                            </span>
                        </div>

                        <div className="border border-black/10 dark:border-white/5 overflow-hidden mb-6">
                            <table className="w-full">
                                <thead className="bg-bg-secondary border-b border-black/10 dark:border-white/5">
                                    <tr>
                                        <th className="w-12 px-4 py-3">
                                            <Check className="w-5 h-5" />
                                        </th>
                                        {COLUMNS_CONFIG.map((col) => (
                                            <th
                                                key={col.key}
                                                className="px-4 py-3 text-left font-text-bold text-text-secondary text-sm"
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_UNITS_DATA.map((unit) => (
                                        <tr
                                            key={unit.discordId}
                                            className="border-b border-black/10 dark:border-white/5 hover:bg-bg-secondary transition-colors"
                                        >
                                            <td className="w-12 px-4 py-3">
                                                <button
                                                    onClick={() => toggleUnitSelection(unit.discordId)}
                                                    className="flex items-center justify-center w-6 h-6 border border-border-secondary bg-bg-dark hover:bg-bg-accent hover:text-black transition-colors"
                                                >
                                                    {selectedUnits.has(unit.discordId) && (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-text-primary font-text text-sm">
                                                {unit.nickname}
                                            </td>
                                            <td className="px-4 py-3 text-text-primary font-text text-sm">
                                                {unit.currentRank}
                                            </td>
                                            <td className="px-4 py-3 text-text-primary font-text text-sm">
                                                {unit.roles.join(", ")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Link
                                href={`/ranks/${rankName}`}
                                className="px-6 py-3 border border-border-secondary hover:bg-bg-secondary transition-colors font-text text-sm text-text-primary"
                            >
                                Отменить
                            </Link>
                            <button
                                onClick={handleAssign}
                                disabled={selectedUnits.size === 0 || isSaving}
                                className="px-6 py-3 bg-accent text-black font-text-bold text-sm hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center"
                            >
                                <Save className="w-4 h-4" />
                                Присвоить ({selectedUnits.size})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}