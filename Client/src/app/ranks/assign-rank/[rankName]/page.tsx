"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Check } from "lucide-react";

import { MainHeader } from "@/components/Header/MainHeader";
import { LoadingScreen, ErrorScreen } from "@/components/StatusScreens/Screens";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { AssignInfoHeader } from "@/components/AssignScreens/AssignInfoHeader";
import { AssignFooter } from "@/components/AssignScreens/AssignFooter";
import { RankService } from "@/shared/api/services/RankService";

const MOCK_UNITS_DATA = [
    { discordId: "123456789", nickname: "Дениска", currentRank: "Генерал-Майор", roles: ["Senior Developer", "Пивонос"], steamId: "632641236412378" },
    { discordId: "987654321", nickname: "NikitaNet", currentRank: "Ст. Лейтенант", roles: ["Начальник службы связи"], steamId: "76561198000000002" },
    { discordId: "555555555", nickname: "Ярек", currentRank: "Полковник", roles: ["Старый пират", "друг флинта"], steamId: "76561198000000003" },
    { discordId: "444444444", nickname: "Челик", currentRank: "Рядовой", roles: ["Стрелок"], steamId: "76561198000000004" },
    { discordId: "333333333", nickname: "Боец1", currentRank: "Рядовой", roles: ["Разведчик"], steamId: "76561198000000005" },
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
                // Имитация API вызова
                const mockRank = {
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
        } else {
            newSelected.add(discordId);
        }
        setSelectedUnits(newSelected);
    };

    const handleAssign = async () => {
        if (!rank || selectedUnits.size === 0) return;
        try {
            setIsSaving(true);
            // Имитация POST запроса
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsSaving(false);
            setSelectedUnits(new Set());
        } 
        catch (err) {
            setError("Ошибка при присвоении звания");
            setIsSaving(false);
        }
    };

    const tableColumns: ColumnConfig[] = [
        {
            key: "selection",
            label: "Выбор",
            sortable: false,
            filterable: false,
            className: "w-12",
            render: (_, item: any) => (
                <button
                    onClick={() => toggleUnitSelection(item.discordId)}
                    className="flex items-center justify-center w-6 h-6 border border-border-secondary bg-bg-dark hover:bg-bg-accent hover:text-black transition-colors"
                >
                    {selectedUnits.has(item.discordId) && (
                        <Check className="w-4 h-4" />
                    )}
                </button>
            )
        },
        { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
        { key: "currentRank", label: "Текущее звание", sortable: true, filterable: true },
        { 
            key: "roles", 
            label: "Должность", 
            sortable: false, 
            filterable: true,
            render: (roles: string[]) => roles.join(", ")
        },
    ];

    const handleExport = (data: any[]) => {
        console.log("Экспорт данных:", data);
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen error={error} />;
    if (!rank) return <ErrorScreen error="Звание не найдено" />;

    return (
        <div className="flex flex-col h-full">
            <MainHeader />
            <div className="flex flex-1 w-full bg-bg-primary transition-colors duration-300">
                <div className="max-w-[1200px] mx-auto pt-10 px-6 w-full animate-in fade-in duration-500">

                    <AssignInfoHeader 
                        title={rank.Name}
                        description={`Количество до повышения: ${rank.CounterToReach}`}
                        mediaNode={
                            <div
                                className="relative aspect-square border border-black/10 dark:border-white/5 flex items-center justify-center flex-col gap-4"
                                style={{ backgroundColor: rank.Color }}
                            >
                                <div className="text-black dark:text-text-primary font-text-bold text-2xl text-center px-4">
                                    {rank.Name}
                                </div>
                            </div>
                        }
                    />

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
                            <UniversalTable 
                                data={MOCK_UNITS_DATA}
                                columns={tableColumns}
                                onExport={handleExport}
                                defaultSort={{ key: "currentRank", direction: "desc" }}
                            />
                        </div>

                        <AssignFooter 
                            cancelUrl={`/ranks/${rankName}`}
                            onAssign={handleAssign}
                            selectedCount={selectedUnits.size}
                            isSaving={isSaving}
                            buttonText="Присвоить"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}