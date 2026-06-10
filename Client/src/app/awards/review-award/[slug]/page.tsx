'use client';
import { AccordingUnitsTable, BaseContainer, ColorInputField, DescriptionInputField, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import Tooltip from "@/components/ToolTip/ToolTip";
import AwardDetailsPage  from "@/pages/award-details/ui/AwardDetailsPage";
import { RewardService } from "@/shared/api/services/RewardService";
import { validateColor } from "@/typescript/colorValidator";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";





const COLUMNS_CONFIG = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
];

export default function Page({ params }: { params: Promise<{slug: string}> }) {
    const {slug} = React.use(params);
    const numSlug = Number(slug);
    const [canEdit, setCanEdit] = useState(true);
    const [canGrant, setCanGrant] = useState(true);
    const [members, setMembers] = useState<any[]>([]);

    const [reward, setReward] = useState<IReward>({
        id : "0",
        name:"Название загружается...",
        conditions: "Условия получения загружаются...",
        privileges:"Привилегии загружаются...",
        color:"#F100FF"
    });

    const [loading, setIsLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | undefined>();
        useEffect(() => {
                if (isNaN(numSlug)) {
                    setError("Некорректный ID звания");
                    setIsLoading(false);
                    return;
                }
        
                setIsLoading(true);
        
                Promise.all([
                    RewardService.getById(numSlug),
                    RewardService.getAssigned(numSlug)
                ])
                .then(([rankData, membersData]) => {
                    setReward(rankData);
                    if (Array.isArray(membersData)) {
                        setMembers(membersData);
                    } 
                    else if (membersData && (membersData as any).value) {
                        setMembers((membersData as any).value);
                    }
                    
                    
                })
                .catch((er) => {
                    setError(`Не удалось загрузить данные с сервера | ${er.message || er}`);
                })
                .finally(() => {
                    setIsLoading(false);
                });
            }, [numSlug]);
    
        if(error!= undefined){return <ErrorScreen error={error}></ErrorScreen>}
        if(loading){return <LoadingScreen></LoadingScreen>}

    // return (
    //     <div className="flex flex-col h-full">
    //         <div className="flex">
    //             <MainHeader></MainHeader>
    //         </div>
    //         <AwardDetailsPage slug={slug}></AwardDetailsPage>
    //     </div>
    // );
    return (<RRForm>
            <div className="flex flex-1 gap-3">
            <Tooltip tooltipText="Шеврон" className="flex flex-1 max-w-50" innerClassName="flex">
                        <div className=" flex flex-col flex-1 h-full">
                            <div className="relative  bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center group">
                                <img 
                                src="/-_-.jpg"
                                alt="Award" 
                                className="flex self-start object-top object-contain overflow-hidden "/>
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
                    
                    <ColorInputField editable={canEdit} editMode={true} value={reward.color} onChange={(e)=>{if(validateColor(e.target.value)){setReward(rank=>({...rank, color: e.target.value}))}}}></ColorInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <MultiroleInputField value={reward.name} onChange={(e)=>{setReward(rank=>({...rank, name: e.target.value}))}} tooltip="Наименование награды" editable={canEdit}></MultiroleInputField>
                <DescriptionInputField value={reward.conditions} onChange={(e)=>{setReward(rank=>({...rank, conditions: e.target.value}))}} tooltip="Описание награды" editable={canEdit}></DescriptionInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <DescriptionInputField value={reward.privileges} onChange={(e)=>{setReward(rank=>({...rank, privileges: e.target.value}))}} tooltip="Привилегии" editable={canEdit}></DescriptionInputField>
            </BaseContainer>
            </div>
            </div>
            <AccordingUnitsTable TableName="Награждённые бойцы" rightsToGrant={canGrant} GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} GIVEN_DATA={members}></AccordingUnitsTable>
        </RRForm>
        )


    
}