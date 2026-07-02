"use client";
import StoryCalendar from "@/components/ActivityCalendar/StoryCalendar/StoryCalendar";
import { MainHeader } from "@/components/Header/MainHeader";
import { ProfileBGImage, ProfileSidePanel, UnitInfoPanel } from "@/components/ProfileComponents/ProfileComponents";
import React, { useEffect, useState } from "react";
import { applyPermissions, getStoryMenuOptions } from "../ProfileLogic";
import { BaseContainer } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { UnitService } from "@/shared/api/services/unitService";

const storyPage = ({ params }: { params: Promise<{DiscordId: string}> }) => {
    const {DiscordId} = React.use(params);
    const [unit, setUnit] = useState<IUnit>();

    const [availableOptions, setAvailableOptions] = useState<IActionMenuOption[]>([])
    useEffect(()=>{
        applyPermissions(getStoryMenuOptions(DiscordId), DiscordId).then(x=>{setAvailableOptions(x);})
        UnitService.getByDiscordId(DiscordId).then((u)=>{setUnit(u)})
    },[])


    // if(DiscordId){console.warn(DiscordId)}
    return(
        <div className="flex flex-col flex-1 min-h-screen bg-bg-dark text-text-secondary font-text transition-all">
            <MainHeader></MainHeader>
            <div className="flex min-h-[250px] h-[30vh] bg-black relative">
                <ProfileBGImage discordId={DiscordId}></ProfileBGImage>
            </div>
            <div className="flex flex-1 bg-bg-primary  mx-5 lg:mx-20 transition-all px-5 pt-10 gap-8">
                <div className="flex gap-3 flex-1">
                    <div>
                        
                    <BaseContainer>
                        <ProfileSidePanel availableOptions={availableOptions}></ProfileSidePanel>
                    </BaseContainer>
                    </div>
                    <div className=" flex border-r border-border-secondary"></div>

                    <div className="flex flex-col flex-1 gap-2">
                    <BaseContainer>
                        <UnitInfoPanel Unit={unit}></UnitInfoPanel>
                    </BaseContainer>
                    <BaseContainer>
                        <StoryCalendar DiscordId={DiscordId}></StoryCalendar>
                    </BaseContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default storyPage;