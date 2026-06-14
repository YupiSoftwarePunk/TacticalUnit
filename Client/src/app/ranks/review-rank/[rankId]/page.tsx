"use client";

import { AccordingUnitsTable, BaseContainer, ColorInputField, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import Tooltip from "@/components/ToolTip/ToolTip";
import { RankService } from "@/shared/api/services/RankService";
import { validateColor } from "@/typescript/colorValidator";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";

const COLUMNS_CONFIG = [
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "top_role", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
    { key: "steamId", label: "SteamID", sortable: false, filterable: true },
];

export default function PostPage({ params }: { params: Promise<{ rankId: string }> }) {
    const { rankId } = React.use(params);
    const numericRankId = Number(rankId);

    const [canEdit, setCanEdit] = useState(true);
    const [canGrant, setCanGrant] = useState(true);
    const [isNotSaved, setIsNotSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    const [rank, setRank] = useState<IRank>({
        id: "0",
        counterToReach: 0,
        color: "#f3f3f3",
        name: "Загрузка...",
        rankChevronURL: "#",
        givedPermissions: [],
        giscordRoleId: -1
    });

    const [members, setMembers] = useState<any[]>([]);
    const [rankPrompt, setRankPrompt] = useState<string>("");

    useEffect(() => {
        if (isNaN(numericRankId)) {
            setError("Некорректный ID звания");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        Promise.all([
            RankService.getById(numericRankId),
            RankService.getAssigned(numericRankId)
        ])
        .then(([rankData, membersData]) => {
            setRank(rankData);
            if (Array.isArray(membersData)) {
                setMembers(membersData);
            } 
            else if (membersData && (membersData as any).value) {
                setMembers((membersData as any).value);
            }
            
            if (rankData.previous?.name) {
                setRankPrompt(rankData.previous.name);
            } 
            else {
                setRankPrompt("");
            }
        })
        .catch((er) => {
            setError(`Не удалось загрузить данные с сервера | ${er.message || er}`);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [numericRankId]);

    if (error !== undefined) {
        return <ErrorScreen error={error} />;
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <RRForm>
            <div className="flex flex-1 gap-3">
                <Tooltip tooltipText="Шеврон" className="flex flex-1 max-w-50" innerClassName="flex">
                    <div className="flex flex-col flex-1 h-full">
                        <div className="relative bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center group">
                            <img 
                                src={rank.rankChevronURL || "/-_-.jpg"}
                                alt="Award" 
                                className="flex self-start object-top object-contain overflow-hidden"
                            />
                            {canEdit && (
                                <button className="absolute bottom-2 right-2 p-2 bg-black/10 dark:bg-black/50 hover:bg-accent opacity-50 hover:opacity-100 transition-all border border-black/20 dark:border-white/10">
                                    <Pencil className="text-white hover:text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                </Tooltip>
                <div className="flex flex-col flex-4">
                    <BaseContainer>
                        <ColorInputField 
                            editable={canEdit} 
                            editMode={true} 
                            value={rank.color} 
                            onChange={(e) => {
                                if (validateColor(e.target.value)) {
                                    setRank(prev => ({ ...prev, color: e.target.value }));
                                    setIsNotSaved(true);
                                }
                            }}
                        />
                    </BaseContainer>
                    <BaseContainer className="flex-col">
                        <MultiroleInputField 
                            value={rank.name} 
                            onChange={(e) => {
                                setRank(prev => ({ ...prev, name: e.target.value }));
                                setIsNotSaved(true);
                            }} 
                            tooltip="Наименование звания" 
                            editable={canEdit}
                        />
                        <MultiroleInputField 
                            value={rank.counterToReach} 
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                setRank(prev => ({ ...prev, counterToReach: Math.max(val, 0) }));
                                setIsNotSaved(true);
                            }} 
                            tooltip="Кол-во активности до повышения" 
                            type="num" 
                            editable={canEdit}
                        />
                    </BaseContainer>
                    <BaseContainer className="flex-col">
                        <ListedInputField 
                            editable={canEdit} 
                            value={rankPrompt} 
                            onChange={(e) => {
                                setRankPrompt(e.target.value);
                                setIsNotSaved(true);
                            }} 
                            tooltip="Нижестоящее по иерархии звание" 
                            textWhenEmpty="[ Нижестоящее звание не указано ]"
                        />
                        <PermissionRollDownList />
                    </BaseContainer>
                </div>
            </div>
            <AccordingUnitsTable 
                TableName="Бойцы, носящие это звание" 
                rightsToGrant={canGrant} 
                GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} 
                GIVEN_DATA={members}
                UrlToGrantPage={`/ranks/assign-rank/${rank.id}`}
            />
        </RRForm>
    );
}