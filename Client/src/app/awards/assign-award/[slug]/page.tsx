"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Check } from "lucide-react";

import { MainHeader } from "@/components/Header/MainHeader";
import { LoadingScreen, ErrorScreen } from "@/components/StatusScreens/Screens";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { AssignInfoHeader } from "@/components/AssignScreens/AssignInfoHeader";
import { AssignFooter } from "@/components/AssignScreens/AssignFooter";
import { RewardService } from "@/shared/api/services/RewardService";
import { ImageService } from "@/shared/api/services/imageService"; 
import { UnitService } from "@/shared/api/services/unitService";
import { StaticImage } from "@/components/ImagesComponent/StaticImage";

export default function AssignAwardPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [award, setAward] = useState<IReward | null>(null);
    const [units, setUnits] = useState<any[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const rewardId = Number(slug);
                if (isNaN(rewardId)) {
                    throw new Error("Некорректный ID награды");
                }

                const [rewardData, allUnits] = await Promise.all([
                    RewardService.getById(rewardId.toString()),
                    UnitService.getAll()
                ]);
                setAward(rewardData);

                const formattedUnits = allUnits.map((unit: IUnit) => ({
                    discordId: String(unit.discordId),
                    nickname: unit.nickname,
                    rank: unit.rank?.name || "Без звания",
                    roles: unit.posts?.map(p => p.name) || [],
                    steamId: unit.steamId
                }));

                setUnits(formattedUnits);
                setLoading(false);
            } 
            catch (err: any) {
                console.error(err);
                setError(err.message || "Ошибка при загрузке данных с сервера");
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

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
        if (!award || selectedUnits.size === 0) return;
        try {
            setIsSaving(true);
            const rewardId = Number(award.id);

            await Promise.all(
                Array.from(selectedUnits).map(discordId => 
                    RewardService.assignToUnit(rewardId.toString(), { discordId })
                )
            );

            setIsSaving(false);
            setSelectedUnits(new Set());
            alert("Награды успешно присвоены бойцам!");
        } 
        catch (err: any) {
            console.error(err);
            setError(err.message || "Ошибка при назначении награды");
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
        { key: "nickname", label: "Никнейм", sortable: true, filterable: true },
        { key: "rank", label: "Звание", sortable: true, filterable: true },
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
    if (!award) return <ErrorScreen error="Награда не найдена" />;

    return (
        <div className="flex flex-col h-full">
            <MainHeader />
            <div className="flex flex-1 w-full bg-bg-primary transition-colors duration-300">
                <div className="max-w-[1200px] mx-auto pt-10 px-6 w-full animate-in fade-in duration-500">

                    <AssignInfoHeader 
                        title={award.name}
                        description={award.conditions}
                        mediaNode={
                            <div className="relative aspect-square bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center">
                                <StaticImage
                                type="reward"
                                entityId={award.id?.toString() || ""}
                                alt={award.name}
                                className="w-full h-full object-contain p-6 transition-all duration-500"
                            />
                            </div>
                        }
                    />

                    <div className="mt-16">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-header text-black dark:text-text-primary uppercase tracking-wider">
                                Выберите бойцов для награждения
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
                                defaultSort={{ key: "nickname", direction: "asc" }}
                            />
                        </div>

                        <AssignFooter 
                            cancelUrl={`/awards/${slug}`}
                            onAssign={handleAssign}
                            selectedCount={selectedUnits.size}
                            isSaving={isSaving}
                            buttonText="Наградить"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}