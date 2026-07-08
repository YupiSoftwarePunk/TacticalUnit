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

    const [loaded, setLoaded] = useState<boolean>(true);
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
        <div className="flex flex-col min-h-screen text-text-secondary bg-bg-primary font-text">
            <MainHeader></MainHeader>
            <div className="flex min-h-[200px] h-[25vh] md:min-h-[300px] md:h-[30vh] bg-black relative">
                <ProfileBGImage discordId={DiscordId} canEdit={true}></ProfileBGImage>
            </div>
            <div className="flex flex-col md:flex-row flex-1 justify-center py-4 px-2 max-w-[1400px] mx-auto w-full gap-3">

                <div className="flex justify-center md:justify-end md:w-1/4 md:flex-shrink-0">
                    <BaseContainer>
                        <ProfileSidePanel availableOptions={availableOptions}></ProfileSidePanel>
                    </BaseContainer>
                </div>

                <div className="border-b md:border-r border-border-secondary w-full md:w-auto md:self-stretch"></div>

                <div className="flex flex-col md:w-3/5 flex-grow min-w-0 gap-6">
                    <BaseContainer className="flex flex-1 p-4">
                        <div className="flex flex-col w-full">
                            <UnitInfoPanel Unit={unitData}></UnitInfoPanel>
                        </div>
                    </BaseContainer>

                    <BaseContainer className="flex ">
                        <div className="w-full overflow-x-auto flex">
                            <div className="mx-auto min-w-max">
                                <ActivityCalendar UnitDiscordId={`${DiscordId}`}></ActivityCalendar>
                            </div>
                        </div>
                    </BaseContainer>
                </div>

                <div className="border-b md:border-r border-border-secondary w-full md:w-auto md:self-stretch"></div>

                <div className="flex md:w-1/4 md:flex-shrink-0 justify-center">
                    <BaseContainer className="flex flex-col justify-start gap-4 p-4 w-full max-w-sm">
                        <div className="flex flex-col gap-2 items-center lg:items-start">
                            <div className="w-full max-w-[320px] aspect-square border-b border-border-primary overflow-hidden flex justify-center items-center">
                                <StaticImage
                                    type="kit"
                                    entityId={DiscordId} 
                                    alt="Избранный кит бойца"
                                    className="object-top object-cover w-full h-full text-white bg-transparent"
                                />
                            </div>
                            <p className="text-text-secondary text-sm pl-1 self-start">Избранный кит профиля</p>
                        </div>
                        
                        <div className="flex flex-col w-full items-center lg:items-start">
                            {unitData?.assignedRewardsIds && unitData?.assignedRewardsIds.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center lg:justify-start max-w-[308px]">
                                    {unitData?.assignedRewardsIds.map(ri => (
                                        <RewardDisplay key={ri} rewardId={ri}></RewardDisplay>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm italic">Боец еще не был награждён</p>
                            )}
                        </div>
                    </BaseContainer>
                </div>
            </div>
        </div>
    )
}