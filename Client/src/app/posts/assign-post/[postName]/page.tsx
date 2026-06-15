"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Check } from "lucide-react";

import { MainHeader } from "@/components/Header/MainHeader";
import { LoadingScreen, ErrorScreen } from "@/components/StatusScreens/Screens";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { AssignInfoHeader } from "@/components/AssignScreens/AssignInfoHeader";
import { AssignFooter } from "@/components/AssignScreens/AssignFooter";
import { PostService } from "@/shared/api/services/postService";
import { UnitService } from "@/shared/api/services/unitService";

export default function AssignPostPage({ params }: { params: Promise<{ postName: string }> }) {
    const { postName } = React.use(params);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [post, setPost] = useState<IPost | null>(null);
    const [units, setUnits] = useState<IUnit[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const postId = Number(postName);
                
                if (isNaN(postId)) {
                    throw new Error("Некорректный идентификатор должности в URL");
                }

                const [postData, unitsData] = await Promise.all([
                    PostService.getById(postId),
                    UnitService.getAll()
                ]);

                setPost(postData);
                setUnits(unitsData);
                setLoading(false);
            } 
            catch (err: any) {
                setError(err?.message || "Ошибка при загрузке данных с сервера");
                setLoading(false);
            }
        };
        fetchData();
    }, [postName]);

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
        if (!post || selectedUnits.size === 0) return;
        try {
            setIsSaving(true);
            const postId = Number(post.id);

            await Promise.all(
                Array.from(selectedUnits).map((unitDiscordId) =>
                    PostService.assignToUnit(postId, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ discordId: unitDiscordId }),
                    })
                )
            );

            setIsSaving(false);
            setSelectedUnits(new Set());
            
            alert("Должности успешно присвоены бойцам!");
        } 
        catch (err: any) {
            setError(err?.message || "Ошибка при сохранении: не удалось назначить должность");
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
                    onClick={() => toggleUnitSelection(String(item.discordId))}
                    className="flex items-center justify-center w-6 h-6 border border-border-secondary bg-bg-dark hover:bg-bg-accent hover:text-black transition-colors"
                >
                    {selectedUnits.has(String(item.discordId)) && (
                        <Check className="w-4 h-4" />
                    )}
                </button>
            )
        },
        { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
        { key: "rank", label: "Звание", sortable: true, filterable: true }, 
        { key: "currentPost", label: "Текущая должность", sortable: false, filterable: true },
    ];

    const handleExport = (data: any[]) => {
        console.log("Экспорт данных:", data);
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen error={error} />;
    if (!post) return <ErrorScreen error="Должность не найдена" />;

    return (
        <div className="flex flex-col h-full">
            <MainHeader />
            <div className="flex flex-1 w-full bg-bg-primary transition-colors duration-300">
                <div className="max-w-[1200px] mx-auto pt-10 px-6 w-full animate-in fade-in duration-500">

                    <AssignInfoHeader 
                        title={post.name}
                        description={post.description}
                    />

                    <div className="mt-16">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-header text-black dark:text-text-primary uppercase tracking-wider">
                                Выберите бойцов для назначения на должность
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
                            cancelUrl={`/posts/${postName}`}
                            onAssign={handleAssign}
                            selectedCount={selectedUnits.size}
                            isSaving={isSaving}
                            buttonText="Назначить"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}