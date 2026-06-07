"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Check } from "lucide-react";

import { MainHeader } from "@/components/Header/MainHeader";
import { LoadingScreen, ErrorScreen } from "@/components/StatusScreens/Screens";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { AssignInfoHeader } from "@/components/AssignScreens/AssignInfoHeader";
import { AssignFooter } from "@/components/AssignScreens/AssignFooter";

const MOCK_UNITS_DATA = [
    { discordId: "123456789", nickname: "Дениска", rank: "Генерал-Майор", roles: ["Senior Developer", "Пивонос"], steamId: "632641236412378" },
    { discordId: "987654321", nickname: "NikitaNet", rank: "Ст. Лейтенант", roles: ["Начальник службы связи"], steamId: "76561198000000002" },
    { discordId: "555555555", nickname: "Ярек", rank: "Полковник", roles: ["Старый пират", "друг флинта"], steamId: "76561198000000003" },
    { discordId: "444444444", nickname: "Челик", rank: "Рядовой", roles: ["Стрелок"], steamId: "76561198000000004" },
    { discordId: "333333333", nickname: "Боец1", rank: "Рядовой", roles: ["Разведчик"], steamId: "76561198000000005" },
];

export default function AssignAwardPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [award, setAward] = useState<IReward | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const mockReward: IReward = {
                    Id: slug || "1",
                    Name: `Орден "Мастер документооборота III степени"`,
                    Conditions: "Выдается за безупречную службу",
                    Privileges: "Дополнительные привилегии в системе",
                    Color: "#FFD700",
                    ImagePath: "/-_-.jpg",
                };
                setAward(mockReward);
                setLoading(false);
            } 
            catch (err) {
                setError("Ошибка при загрузке награды");
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
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsSaving(false);
            setSelectedUnits(new Set());
        } 
        catch (err) {
            setError("Ошибка при назначении награды");
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
                        title={award.Name}
                        description={award.Conditions}
                        mediaNode={
                            <div className="relative aspect-square bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center">
                                <img
                                    src={award.ImagePath || "/-_-.jpg"}
                                    alt={award.Name}
                                    className="w-4/5 h-4/5 object-contain"
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
                                data={MOCK_UNITS_DATA}
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