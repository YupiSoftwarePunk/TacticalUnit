'use client'

import { ActivityCalendar } from "@/components/ActivityCalendar/BaseCalendar/ActivityCalendar";
import { BaseContainer } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { MainHeader } from "@/components/Header/MainHeader";
import { ProfileBGImage, ProfileSidePanel, RewardDisplay, UnitInfoPanel } from "@/components/ProfileComponents/ProfileComponents";
import { LoadingScreen, ErrorScreen } from "@/components/StatusScreens/Screens";
import { UnitService } from "@/shared/api/services/unitService";
import React from "react";
import { useEffect, useState } from "react";
import { applyPermissions, getProfileMenuOptions } from "./ProfileLogic";
import { StaticImage } from "@/components/ImagesComponent/StaticImage";

export default function Profile({ params }: { params: Promise<{ DiscordId: string }> }) {
    const { DiscordId } = React.use(params);
    const [unitData, setUnitData] = useState<IUnit>();
    const [availableOptions, setAvailableOptions] = useState<IActionMenuOption[]>([]);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();
    
    function loadData() {
        UnitService.getByDiscordId(DiscordId as unknown as number).then(
            (data) => {
                setLoaded(true);
                data.discordId = DiscordId;
                setUnitData(structuredClone(data));
                applyPermissions(getProfileMenuOptions(DiscordId), DiscordId).then(x => { setAvailableOptions(x); })
            }
        ).catch((er) => { setError(`Не удалось загрузить данные | ${er}`); })
    }

    useEffect(() => {
        loadData();
    }, [DiscordId])

    if (error != undefined) { return <ErrorScreen error={error}></ErrorScreen> }
    if (!loaded) { return <LoadingScreen></LoadingScreen> }

    return (
        <div className="flex flex-col min-h-screen text-text-secondary font-text">
            <MainHeader></MainHeader>

            <div className="flex min-h-[300px] h-[30vh] bg-black relative">
                <ProfileBGImage discordId={DiscordId} canEdit={true}></ProfileBGImage>
            </div>

            <div className="flex max-md:flex-col max-sm:text-xl flex-1 justify-center bg-bg-primary py-8 ">
                <div className="flex mx-3">
                    <BaseContainer>
                        <ProfileSidePanel availableOptions={availableOptions}></ProfileSidePanel>
                    </BaseContainer>
                </div>
                
                <div className=" flex border-r border-border-secondary"></div>
                
                <div className="flex flex-col px-3">
                    <div className="flex flex-1 gap-3 max-lg:flex-col">
                        <div className="flex flex-col flex-1 gap-2">
                            <BaseContainer className="flex flex-1">
                                <div className="flex flex-col">
                                    <UnitInfoPanel Unit={unitData}></UnitInfoPanel>
                                </div>
                            </BaseContainer>
                            <BaseContainer className="flex ">
                                <div className="flex">
                                    <ActivityCalendar UnitDiscordId={`${DiscordId}`}></ActivityCalendar>
                                </div>
                            </BaseContainer>
                        </div>
                        
                        <div className=" flex border-r border-border-secondary"></div>

                        <div className="flex ">
                            <BaseContainer className="flex flex-col flex-3 justify-start gap-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex size-80 border-b border-border-primary  overflow-hidden justify-center items-center">
                                        <StaticImage
                                            type="kit"
                                            entityId={DiscordId} 
                                            alt="Избранный кит бойца"
                                            className="object-top object-cover size-full text-white bg-transparent"
                                        />
                                    </div>
                                    <p className="text-text-secondary text-sm pl-1">Избранный кит профиля</p>
                                </div>
                                <div className="flex flex-col">
                                    {unitData?.assignedRewardsIds && unitData?.assignedRewardsIds.length > 0 ? 
                                        <div className="flex flex-wrap max-w-77 gap-1">
                                            {unitData?.assignedRewardsIds.map(ri => (
                                                <RewardDisplay key={ri} rewardId={ri}></RewardDisplay>
                                            ))}
                                        </div>
                                        :
                                        <p className="text-sm italic">Боец еще не был награждён</p>
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