'use client';
import { AccordingUnitsTable, BaseContainer, ColorInputField, DescriptionInputField, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { MainHeader } from "@/components/Header/MainHeader";
import Tooltip from "@/components/ToolTip/ToolTip";
import AwardDetailsPage  from "@/pages/award-details/ui/AwardDetailsPage";
import { validateColor } from "@/typescript/colorValidator";
import { Pencil } from "lucide-react";
import React, { useState } from "react";





const MEMBERS_DATA = [
    {
    rank: "Генерал-Майор",
    nickname: "Дениска",
    top_role: "Senior Developer",
    roles: ["Senior Developer", "Пивонос"],
    kit: "Стрелок",
    steamId: "632641236412378",
    discordId: "00000000000000000"
    },
    {
    rank: "Ст. Лейтенант",
    nickname: "NikitaNet",
    top_role: "Начальник службы связи",
    roles: ["Начальник службы связи"],
    kit: "Марксмен",
    steamId: "76561198000000002",
    discordId: "345678901234567890",
    },
    {
    rank: "Полковник",
    nickname: "Ярек",
    top_role: "Старый пират",
    roles: ["Старый пират", "друг флинта", "Не женат"],
    kit: "Пилот",
    steamId: "76561198000000003",
    discordId: "456789012345678901",
    }
];

const COLUMNS_CONFIG = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
];

export default function Page({ params }: { params: Promise<{slug: string}> }) {
    const {slug} = React.use(params);
    const [canEdit, setCanEdit] = useState(true);
    const [canGrant, setCanGrant] = useState(true);

    const [reward, setReward] = useState<IReward>({
        Id:0,
        Name:"Название загружается...",
        Conditions: "Условия получения загружаются...",
        Privileges:"Привилегии загружаются...",
        Color:"#F100FF"
    });



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
                    
                    <ColorInputField editable={canEdit} editMode={true} value={reward.Color} onChange={(e)=>{if(validateColor(e.target.value)){setReward(rank=>({...rank, Color: e.target.value}))}}}></ColorInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <MultiroleInputField value={reward.Name} onChange={(e)=>{setReward(rank=>({...rank, Name: e.target.value}))}} tooltip="Наименование награды" editable={canEdit}></MultiroleInputField>
                <DescriptionInputField value={reward.Conditions} onChange={(e)=>{setReward(rank=>({...rank, Conditions: e.target.value}))}} tooltip="Описание награды" editable={canEdit}></DescriptionInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <DescriptionInputField value={reward.Privileges} onChange={(e)=>{setReward(rank=>({...rank, Privileges: e.target.value}))}} tooltip="Привилегии" editable={canEdit}></DescriptionInputField>
            </BaseContainer>
            </div>
            </div>
            <AccordingUnitsTable TableName="Награждённые бойцы" rightsToGrant={canGrant} GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} GIVEN_DATA={MEMBERS_DATA}></AccordingUnitsTable>
        </RRForm>
        )


    
}