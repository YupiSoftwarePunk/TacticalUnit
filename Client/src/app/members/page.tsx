"use client";

import React, { useEffect, useState } from "react";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { MainHeader } from "@/components/Header/MainHeader";
import { UnitService } from "@/shared/api/services/unitService";
import { RankService } from "@/shared/api/services/RankService";
import { PostService } from "@/shared/api/services/postService";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import Link from "next/link";
import { useRouter } from "next/navigation";

const COLUMNS_CONFIG: ColumnConfig[] = [
    { key: "rank", label: "Звание", sortable: true, filterable: true, className: "text-text-secondary font-light" },
    { 
        key: "nickname", 
        label: "Никнейм", 
        sortable: false, 
        filterable: true, 
        className: "text-accent font-bold",
        render: (value: string, item: IMemberRow) => (
            <Link 
                href={`/profile/${item.discordId}`}
                className="hover:underline hover:text-accent-light transition-colors"
            >
                {value}
            </Link>
        )
    },
    { key: "top_role", label: "Наивысшая должность", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true, className: "text-text-secondary text-sm" },
    { key: "activity_week", label: "Активность за неделю", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "activity_month", label: "Активность за месяц", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "activity_year", label: "Активность за год", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
    { key: "activity_total", label: "Активность за всё время", sortable: true, filterable: false, className: "text-text-secondary text-sm" },
];

interface IMemberRow {
    rank: string;
    nickname: string;
    top_role: string;
    roles: string[];
    activity_week: number;
    activity_month: number;
    activity_year: number;
    activity_total: number;
    kit: string;
    steamId: string;
    discordId: string;
    joinDate: string;
}

export default function MembersPage() {
    const [members, setMembers] = useState<IMemberRow[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    const router = useRouter();

    useEffect(() => {
        let ranks: IRank[] = [];
        let posts: IPost[] = [];

        const fetchMembers = async () => {
            try {
                const sRanks = await RankService.getAll();
                ranks = Array.isArray(sRanks) ? sRanks : [];

                const sPosts = await PostService.getAll();
                posts = Array.isArray(sPosts) ? sPosts : [];

                const units = await UnitService.getAll();
                if (!units || !Array.isArray(units)) {
                    setMembers([]);
                    setLoaded(true);
                    return;
                }

                const preparedMemberArray: IMemberRow[] = units.map((element: IUnitCompressed) => {
                    const setRank = ranks.find(x => x.id?.toString() === element.rankId?.toString());

                    const unitPostIds = element.postsIds || [];
                    const firstPostId = unitPostIds[0];
                    const setPost = posts.find(x => x.id?.toString() === firstPostId?.toString());

                    const memberRoles: string[] = unitPostIds
                        .map(id => posts.find(p => p.id?.toString() === id.toString())?.name)
                        .filter((name): name is string => Boolean(name));

                    let formattedJoinDate = "—";
                    if (element.joined) {
                        const date = new Date(element.joined);
                        if (!isNaN(date.getTime())) {
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const year = date.getFullYear();
                            formattedJoinDate = `${day}.${month}.${year}`;
                        } 
                        else {
                            formattedJoinDate = element.joined;
                        }
                    }

                    return {
                        rank: setRank ? setRank.name : "Без звания",
                        nickname: element.nickname || "Без ника",
                        top_role: setPost ? setPost.name : "Без должности",
                        roles: memberRoles,
                        activity_week: element.activity_week ?? 0,
                        activity_month: element.activity_month ?? 0,
                        activity_year: element.activity_year ?? 0,
                        activity_total: element.activity_total ?? 0,
                        kit: element.favoriteKit ? `${element.favoriteKit.name}` : "Не выбран",
                        steamId: element.steamId ? String(element.steamId) : "—",
                        discordId: element.discordId ? String(element.discordId) : "—",
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

    const handleExport = (dataToExport: IMemberRow[]) => {
        if (!dataToExport || dataToExport.length === 0) {
            alert("Нет данных для экспорта");
            return;
        }

        sessionStorage.setItem("export_table_data", JSON.stringify(dataToExport));
        sessionStorage.setItem("export_table_columns", JSON.stringify(COLUMNS_CONFIG));

        router.push("./export/page.tsx");
    };

    const copyToClipboard = (text: string) => {
        if (!text || text === "—") return;
        navigator.clipboard.writeText(text);
        alert("Скопировано: " + text);
    };

    if (error) return <ErrorScreen error={error} />;
    if (!loaded) return <LoadingScreen />;

    return (
        <div className="flex flex-col h-full w-full overflow-x-hidden">
            <MainHeader />
            <main className="min-h-screen bg-bg-primary pt-20 md:pt-24 pb-12 px-4 sm:px-8 w-full">
                <div className="max-w-[1400px] mx-auto w-full">
                    <header className="mb-6 md:mb-12">
                        <h1 className="text-3xl sm:text-5xl font-header text-text-primary uppercase tracking-normal mb-2 wrap-break-word">
                            Личный состав
                        </h1>
                        <p className="text-text-secondary font-text-regular text-sm sm:text-lg">
                            Реестр зарегистрированных бойцов подразделения POLK
                        </p>
                    </header>

                    <section className="bg-bg-primary border border-bg-secondary p-4 sm:p-8 shadow-2xl w-full">
                        <UniversalTable 
                            data={members} 
                            columns={COLUMNS_CONFIG} 
                            onExport={handleExport}
                            defaultSort={{ key: "rank", direction: "desc" }}
                            renderActions={(item: IMemberRow) => (
                                <div className="flex flex-row md:flex-row gap-2 w-full justify-end">
                                    <button 
                                        onClick={() => copyToClipboard(item.steamId)}
                                        className="flex-1 md:flex-none p-1.5 px-3 border border-bg-secondary hover:border-accent text-[10px] uppercase transition-colors bg-bg-primary text-center whitespace-nowrap">
                                        Steam_ID
                                    </button>
                                    <button 
                                        onClick={() => copyToClipboard(item.discordId)}
                                        className="flex-1 md:flex-none p-1.5 px-3 border border-bg-secondary hover:border-accent text-[10px] uppercase transition-colors bg-bg-primary text-center whitespace-nowrap">
                                        Discord_ID
                                    </button>
                                </div>
                            )}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}