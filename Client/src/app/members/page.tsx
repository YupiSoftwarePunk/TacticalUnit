"use client";

import React, { useEffect, useState } from "react";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { MainHeader } from "@/components/Header/MainHeader";
import { UnitService } from "@/shared/api/services/unitService";
import { RankService } from "@/shared/api/services/RankService";
import { warn } from "console";
import { PostService } from "@/shared/api/services/postService";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";

const COLUMNS_CONFIG: ColumnConfig[] = [
    
    { key: "rank", label: "Звание", sortable: true, filterable: true, className: "text-text-secondary font-light" },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true, className: "text-accent font-bold" },
    { key: "top_role", label: "Наивысшая должность", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    // { 
    //     key: "roles", 
    //     label: "Должность", 
    //     sortable: false, 
    //     filterable: true, 
    //     className: "text-text-secondary text-sm italic",
    //     render: (value) => Array.isArray(value) ? value.join(", ") : value
    // },
    // { key: "unit", label: "Подразделение", sortable: false, filterable: true, className: "text-text-secondary text-sm" },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true, className: "text-text-secondary text-sm" },
    
    { key: "activity_week", label: "Активность за неделю", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "activity_month", label: "Активность за месяц", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "activity_year", label: "Активность за год", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "activity_total", label: "Активность за всё время", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    // { key: "joinDate", label: "Дата вступления", sortable: true, filterable: true, className: "text-text-secondary text-sm font-mono" }
];

export default function MembersPage() {
    const [members, setMembers] = useState<any[]>([]);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();


    useEffect(() => {
        
        let ranks : IRank[] = []
        let posts : IPost[] = []
        let subdivisions : ISubdivision[] = []


        const fetchMembers = async () => {
            

            try {
                await RankService.getAll().then(sRanks => {
                ranks = [...sRanks];
                })
                await PostService.getAll().then(sPosts => {
                    posts = [...sPosts];
                })
                await PostService.getAll().then(sPosts => {
                    posts = [...sPosts];
                })
                const units = await UnitService.getAll();
                if (!units || !Array.isArray(units)) return;

                const preparedMemberArray = units.map((element: IUnit) => {
                    const memberRoles: string[] = element.posts?.map((p) => p.name).filter(Boolean) || [];
                    const topRole = memberRoles[0] || "Без должности";
                    const unitName = element.posts?.[0]?.subdivision?.name || "Вне подразделения";

                    let formattedJoinDate = "—";
                    if (element.joined) {
                        const date = new Date(element.joined);
                        if (!isNaN(date.getTime())) {
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const year = date.getFullYear();
                            formattedJoinDate = `${day}.${month}.${year}`;
                        }
                    }
                    // console.warn(`${element.rankId}`);
                    // console.warn(ranks.find(x=>`${x.id}` == `${element.rankId}`)?.name);
                    
                    let setRank = ranks.find(x=>x.id == element.rankId)
                    let setPost = posts.find(x=>x.id == element.postsIds[0])
                    
                    // console.warn(setRank);

                    return {
                        rank: setRank? setRank.name : "Без звания",
                        nickname: element.nickname,
                        top_role: setPost? setPost.name : "Без должности",
                        roles: memberRoles,
                        activity_week: (element as any).activity_week ?? (element as any).activityWeek ?? 0,
                        activity_month: (element as any).activity_month ?? (element as any).activityMonth ?? 0,
                        activity_year: (element as any).activity_year ?? (element as any).activityYear ?? 0,
                        activity_total: (element as any).activity_total ?? (element as any).activityTotal ?? 0,
                        kit: (element as any).favoriteKit?.name || (element as any).kit || "Не выбран",
                        steamId: element.steamId ? String(element.steamId) : "—",
                        discordId: String(element.discordId),
                        joinDate: formattedJoinDate
                    };
                });

                setMembers(preparedMemberArray);
                setLoaded(true);
            } 
            catch (err) {
                console.error("Ошибка при получении личного состава:", err);
                setError(err as string);
            }
        };

        fetchMembers();
    }, []);

    const handleExport = (dataToExport: any[]) => {
        console.log("Экспорт данных:", dataToExport);
        alert("Модальное окно выбора полей для экспорта");
    };

    const copyToClipboard = (text: string) => {
        if (!text || text === "—") return;
        navigator.clipboard.writeText(text);
        alert("Скопировано: " + text);
    };

    if (error) return <ErrorScreen error={error}></ErrorScreen>
    if (!loaded) return <LoadingScreen></LoadingScreen>

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
                            data={members} 
                            columns={COLUMNS_CONFIG} 
                            onExport={handleExport}
                            defaultSort={{ key: "rank", direction: "desc" }}
                            renderActions={(item: any) => (
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