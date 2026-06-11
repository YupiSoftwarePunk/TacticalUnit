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
        id : "0",
        name:"Название загружается...",
        conditions: "Условия получения загружаются...",
        privileges:"Привилегии загружаются...",
        color:"#F100FF"
    });

    const [loaded, setLoaded] = useState<boolean>(false);
        const [error, setError] = useState<string | undefined>();
        function loadData(){
            // RewardService.getById(slug as unknown as number).then(
            //     (data)=>{
            //         loaded = true;
            //         setReward(data);
            //     }
            // ).catch((er)=>{setError(`Не удалось загрузить данные | ${er}`);})
            
            fetch(`http://localhost:5000/api/reward/${slug}`, {method: "GET", headers:{'Content-Type' : 'application/json'}}).then((responce)=>{if(!responce.ok) throw new Error("erroprrrrr"); return responce.json();
            }).then(
                (data : IReward)=>{
                    setLoaded(true);
                    setReward(data);
                }
            ).catch((er)=>{console.warn(er); setError(`Не удалось загрузить данные | ${er}`);})
        }
        useEffect(()=>{
            loadData();
        }, [])
    
        if(error!= undefined){return <ErrorScreen error={error}></ErrorScreen>}
        if(!loaded){return <LoadingScreen></LoadingScreen>}

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
            <AccordingUnitsTable TableName="Награждённые бойцы" rightsToGrant={canGrant} GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} GIVEN_DATA={MEMBERS_DATA} UrlToGrantPage={`/awards/assign-award/${reward.id}`}></AccordingUnitsTable>
        </RRForm>
        )
}