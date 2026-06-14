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
import { UnitService } from "@/shared/api/services/unitService";

export default function AssignRankPage({ params }: { params: Promise<{ rankName: string }> }) {
    const { rankName } = React.use(params);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rank, setRank] = useState<IRank | null>(null);
    const [units, setUnits] = useState<IUnit[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const numericRankId = parseInt(rankName, 10);
                if (isNaN(numericRankId)) {
                    throw new Error("Некорректный ID звания в URL");
                }

                const [rankData, unitsData] = await Promise.all([
                    RankService.getById(numericRankId),
                    UnitService.getAll()
                ]);

                setRank(rankData);
                setUnits(unitsData);
                setLoading(false);
            } 
            catch (err: any) {
                console.error("Ошибка при получении данных:", err);
                setError(err.message || "Ошибка при загрузке данных с сервера");
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
    if (!rank || !rank.id || selectedUnits.size === 0) return;
    
    try {
        setIsSaving(true);
        setError(null);

        const numericRankId = parseInt(rank.id, 10);
        if (isNaN(numericRankId)) {
            throw new Error("Не удалось определить ID текущего звания");
        }

        const assignPromises = Array.from(selectedUnits).map((discordId) =>
            RankService.assignToUnit(numericRankId, discordId, {
                method: "POST",
            })
        );

        await Promise.all(assignPromises);

        const updatedUnits = await UnitService.getAll();
        setUnits(updatedUnits);

        setIsSaving(false);
        setSelectedUnits(new Set());
    } 
    catch (err: any) {
        console.error("Ошибка при сохранении:", err);
        setError(err.message || "Ошибка при присвоении звания");
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
            render: (_, item: IUnit) => (
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
        { 
            key: "rank", 
            label: "Текущее звание", 
            sortable: true, 
            filterable: true,
            render: (rank: IRank) => rank?.name || "Без звания"
        },
        { 
            key: "posts", 
            label: "Должность", 
            sortable: false, 
            filterable: true,
            render: (posts: IPost[]) => posts?.map(p => p.name).join(", ") || "Нет должности"
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
                        title={rank.name}
                        description={`Количество до повышения: ${rank.counterToReach}`}
                        mediaNode={
                            <div
                                className="relative aspect-square border border-black/10 dark:border-white/5 flex items-center justify-center flex-col gap-4"
                                style={{ backgroundColor: rank.color }}
                            >
                                <div className="text-black dark:text-text-primary font-text-bold text-2xl text-center px-4">
                                    {rank.name}
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
                                data={units}
                                columns={tableColumns}
                                onExport={handleExport}
                                defaultSort={{ key: "rank", direction: "desc" }}
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