'use client'
import { ActivityCalendar } from "@/components/ActivityCalendar/BaseCalendar/ActivityCalendar";
import { BaseContainer } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { MainHeader } from "@/components/Header/MainHeader";
import { ProfileBGImage, ProfileSidePanel, RewardDisplay, UnitInfoPanel } from "@/components/ProfileComponents/ProfileComponents";
import {LoadingScreen, ErrorScreen} from "@/components/StatusScreens/Screens";
import { UnitService } from "@/shared/api/services/unitService";
import { getBaseVariables } from "@/typescript/variables";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { getUnitImage } from "@/shared/config/imagesMapper";







export default function Profile({ params }: { params: Promise<{DiscordId: string}> }){
    // const params = useSearchParams();
    // if (!id) {
    //     return (<LoadingScreen></LoadingScreen>);
    // }
    const {DiscordId} = React.use(params);
    
    const [unitData, setUnitData] = useState<IUnit>();

    
    
    function applyPermissions(disId : string = "-1"){
        UnitService.getPermissionsIds(disId).then((r)=>{
            let permissions : string[] = r
            let preparedOptions : IActionMenuOption[] = [];
            let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
            permissions.push("any");
            if (user.discord_id == DiscordId){
                permissions.push("self");
            }
            console.warn(permissions);
            menuOptions.forEach(option => {
                console.warn(option.accessOnRoles);

                permissions.forEach(perm=>{

                    if(option.accessOnRoles.find(x=>x == perm)){
                        if(!preparedOptions.find(x=>x.id == option.id)){

                            preparedOptions.push(option);
                        }
                    }
                })
            });



            setAvailableOptions(preparedOptions);
        })
    }
    
    const [menuOptions, setMenuOptions] = useState<IActionMenuOption[]>([
    {
        id : 0,
        name : "Подробная активность",
        url : `/profile/${DiscordId}/story`,
        accessOnRoles : ["1", "any"]
    },
    {
        id : 1,
        name : "Избранные документы",
        url : `#`,
        accessOnRoles : ["1", "any"]
    },
    {
        id : 2,
        name : "Изменить шапку профиля",
        url : `#`,
        accessOnRoles : ["1", "self"]
    },
    {
        id : 3,
        name : "Изменить избранный кит",
        url : `#`,
        accessOnRoles : ["1", "self"]
    },
    {
        id : 4,
        name : "Изменить отображаемые награды",
        url : `#`,
        accessOnRoles : ["1", "self"]
    },
    {
        id : 5,
        name : "Изменить никнейм",
        url : `#`,
        accessOnRoles : ["1", "self", "17"]
    },
    {
        id : 6,
        name : "Присвоить звание",
        url : `#`,
        accessOnRoles : ["1", "11"]
    },
    {
        id : 7,
        name : "Назначить на должность",
        url : `#`,
        accessOnRoles : ["1", "12"]
    },
    {
        id : 8,
        name : "Наградить",
        url : `#`,
        accessOnRoles : ["1", "13"]
    },
    {
        id : 9,
        name : "Отправить в отставку",
        url : `#`,
        accessOnRoles : ["1", "5"]
    },
    {
        id : 10,
        name : "Уволить",
        url : `#`,
        accessOnRoles : ["1", "4"]
    }
    ]);

    const [availableOptions, setAvailableOptions] = useState<IActionMenuOption[]>([])


    const [loaded, setLoaded] = useState<boolean>(false);
    
    const [error, setError] = useState<string | undefined>();
    function loadData(){
        UnitService.getByDiscordId(DiscordId as unknown as number).then(
            (data)=>{
                setLoaded(true);
                data.discordId = DiscordId;
                setUnitData(structuredClone(data));
                applyPermissions(DiscordId);
            }
        ).catch((er)=>{setError(`Не удалось загрузить данные | ${er}`);})
    }
    useEffect(()=>{
        loadData();
    }, [DiscordId])
    if(error!= undefined){return <ErrorScreen error={error}></ErrorScreen>}
    if(!loaded){return <LoadingScreen></LoadingScreen>}

    return(
        <div className="flex flex-col min-h-screen text-text-secondary font-text">
            <MainHeader></MainHeader>
            <div className="flex min-h-[300px] h-[30vh] bg-black relative">
                <ProfileBGImage></ProfileBGImage>
            </div>
            <div className="flex   flex-1 justify-center bg-bg-primary py-8 text-xl">
                <div className="flex ">
                    <BaseContainer>
                        <ProfileSidePanel availableOptions={availableOptions}></ProfileSidePanel>
                    </BaseContainer>
                </div>
                <div className="pl-3 flex border-r border-border-secondary"></div>
                <div className="flex flex-col px-3">
                    <div className="flex flex-1 gap-3 max-lg:flex-col">
                        <div className="flex flex-col  flex-1 gap-2">
                            <BaseContainer className="flex flex-1">

                                <div className="flex flex-col">
                                    <UnitInfoPanel Unit={unitData}></UnitInfoPanel>
                                </div>
                            </BaseContainer>
                            <BaseContainer className="flex ">
                                <ActivityCalendar UnitDiscordId={`${DiscordId}`}></ActivityCalendar>
                            </BaseContainer>
                        </div>
                        <div className=" flex border-r border-border-secondary"></div>

                        <div className="flex ">

                            <BaseContainer className="flex flex-col flex-3 justify-start gap-4">
                                <div className="flex flex-col">
                                    <div className="flex size-80 border-b border-border-primary">
                                        <img src={getUnitImage(unitData?.rank?.name || unitData?.posts?.[0]?.name)} 
                                        alt="Soldier of heaven" 
                                        className="object-top object-cover self-center size-full text-white"/>
                                    </div>
                                    <p className="text-text-secondary">Избранный кит :</p>
                                    <p className="text-text-secondary-accent -mt-2">Избранный кит не выбран</p>
                                </div>
                                
                                <div className="flex flex-col">
                                    {unitData?.assignedRewardsIds && unitData?.assignedRewardsIds.length > 0? 
                                    <div className="flex flex-wrap max-w-77 gap-1">
                                        {unitData?.assignedRewardsIds&&
                                        unitData?.assignedRewardsIds.map(ri=>(
                                            <RewardDisplay rewardId={ri}></RewardDisplay>
                                        ))}
                                    </div>
                                    :
                                    <p>Боец еще не был награждён</p>
                                    }
                                </div>
                            </BaseContainer>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}