'use client';

import { AccordingUnitsTable, BaseContainer, ColorInputField, CopyField, DescriptionInputField, MultiroleInputField, StyledButton } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import Tooltip from "@/components/ToolTip/ToolTip";
import { RewardService } from "@/shared/api/services/RewardService";
import { validateColor } from "@/typescript/colorValidator";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { StaticImage } from "@/components/ImagesComponent/StaticImage";

const COLUMNS_CONFIG = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
];

interface IAssignedMember {
    discordId: string;
    nickname: string;
    rank: string;
    roles: string[];
    steamId: string;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const [canEdit, setCanEdit] = useState(false);
    const [canGrant, setCanGrant] = useState(true);

    const [reward, setReward] = useState<IReward>({
        id: "0",
        name: "Название загружается...",
        conditions: "Условия получения загружаются...",
        privileges: "Привилегии загружаются...",
        color: "#F100FF"
    });

    const [assignedMembers, setAssignedMembers] = useState<IAssignedMember[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        async function loadData() {
            try {
                const rewardId = Number(slug);
                if (isNaN(rewardId)) {
                    throw new Error("Некорректный идентификатор награды (slug)");
                }

                const [rewardData, assignedData] = await Promise.all([
                    RewardService.getById(slug),
                    RewardService.getAssigned(slug)
                ]);
                setReward(rewardData);

                const formattedMembers: IAssignedMember[] = assignedData.map((item: IAssignedReward) => ({
                    discordId: item.unit?.discordId || "",
                    nickname: item.unit?.nickname || "Без никнейма",
                    rank: item.unit?.rank?.name || "Без звания",
                    roles: item.unit?.posts?.map(post => post.name) || [],
                    steamId: item.unit?.steamId || ""
                }));
                setAssignedMembers(formattedMembers);
                setLoaded(true);

            } 
            catch (er) {
                console.error(er);
                const errorMessage = er instanceof Error ? er.message : "Ошибка при загрузке данных";
                setError(errorMessage);
            }
        }

        loadData();
    }, [slug]);

    if (error !== undefined) { return <ErrorScreen error={error}></ErrorScreen> }
    if (!loaded) { return <LoadingScreen></LoadingScreen> }

    return (
        <RRForm>
            <div className="flex flex-col md:flex-row flex-1 gap-6 md:gap-3 w-full">
                <Tooltip tooltipText="награда" className="flex w-full md:flex-1 max-w-full md:max-w-50" innerClassName="flex w-full">
                    <div className="flex flex-col flex-1 h-full">
                        <div className="relative flex items-center justify-center group">
                            <StaticImage
                                type="reward"
                                entityId={reward.id?.toString() || ""}
                                alt={reward.name}
                                className="w-full h-full object-contain p-6 transition-all duration-500"
                            />
                            {canEdit && (
                                <button type="button" className="absolute bottom-2 right-2 p-2 bg-black/10 dark:bg-black/50 hover:bg-accent opacity-50 hover:opacity-100 transition-all border border-black/20 dark:border-white/10">
                                    <Pencil className="text-white hover:text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                </Tooltip>
                
                <div className="flex flex-col flex-4 gap-2 w-full">
                    <BaseContainer>
                        <ColorInputField 
                            editable={canEdit} 
                            editMode={true} 
                            value={reward.color} 
                            onChange={(e) => {
                                if (validateColor(e.target.value)) {
                                    setReward(prev => ({ ...prev, color: e.target.value }))
                                }
                            }}
                        />
                    </BaseContainer>
                    
                    <BaseContainer className="flex-col">
                        <MultiroleInputField 
                            value={reward.name} 
                            onChange={(e) => { setReward(prev => ({ ...prev, name: e.target.value })) }} 
                            tooltip="Наименование награды" 
                            editable={canEdit} 
                        />
                        <DescriptionInputField 
                            value={reward.conditions} 
                            onChange={(e) => { setReward(prev => ({ ...prev, conditions: e.target.value })) }} 
                            tooltip="Описание награды" 
                            editable={canEdit} 
                        />
                    </BaseContainer>
                    
                    <BaseContainer className="flex-col">
                        <DescriptionInputField 
                            value={reward.privileges} 
                            onChange={(e) => { setReward(prev => ({ ...prev, privileges: e.target.value })) }} 
                            tooltip="Привилегии" 
                            editable={canEdit} 
                        />
                    </BaseContainer>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 opacity-50 w-full">
                        <CopyField className="flex flex-1" title="Discord Id" copyInfo={reward.discordRoleId}></CopyField>
                        <StyledButton title={"обновить роль"}></StyledButton>
                    </div>
                </div>
            </div>

            <AccordingUnitsTable 
                TableName="Награждённые бойцы" 
                rightsToGrant={canGrant} 
                GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} 
                GIVEN_DATA={assignedMembers} 
                UrlToGrantPage={`/awards/assign-award/${reward.id}`}
            />
        </RRForm>
    );
}