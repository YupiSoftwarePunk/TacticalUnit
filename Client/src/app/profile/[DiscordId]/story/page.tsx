"use client";

import StoryCalendar from "@/components/ActivityCalendar/StoryCalendar/StoryCalendar";
import { MainHeader } from "@/components/Header/MainHeader";
import { ProfileBGImage, ProfileSidePanel, UnitInfoPanel } from "@/components/ProfileComponents/ProfileComponents";
import React, { useEffect, useState } from "react";
import { applyPermissions, getStoryMenuOptions } from "../ProfileLogic";
import { BaseContainer } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { UnitService } from "@/shared/api/services/unitService";

const StoryPage = ({ params }: { params: Promise<{ DiscordId: string }> }) => {
    const { DiscordId } = React.use(params);
    const [unit, setUnit] = useState<IUnit>();
    const [availableOptions, setAvailableOptions] = useState<IActionMenuOption[]>([]);

    useEffect(() => {
        applyPermissions(getStoryMenuOptions(DiscordId), DiscordId).then((x) => {
            setAvailableOptions(x);
        });
        UnitService.getByDiscordId(DiscordId).then((u) => {
            setUnit(u);
        });
    }, [DiscordId]);

    return (
        <div className="flex flex-col min-h-screen bg-bg-primary text-text-secondary font-text transition-all">
            <MainHeader />
            <div className="flex min-h-[200px] h-[25vh] md:min-h-[300px] md:h-[30vh] bg-black relative">
                <ProfileBGImage discordId={DiscordId} />
            </div>
            <div className="flex flex-col md:flex-row flex-1 justify-center py-8 px-4 max-w-[1400px] mx-auto w-full gap-6">

                <div className="flex justify-center md:justify-end">
                    <BaseContainer>
                        <ProfileSidePanel availableOptions={availableOptions} />
                    </BaseContainer>
                </div>

                <div className="border-b md:border-r border-border-secondary w-full md:w-auto md:self-stretch"></div>
                <div className="flex flex-col flex-1 gap-6 min-w-0">

                    <BaseContainer className="p-4">
                        <div className="flex flex-col w-full">
                            <UnitInfoPanel Unit={unit} />
                        </div>
                    </BaseContainer>

                    <BaseContainer className="flex">
                        <div className="w-full overflow-x-auto flex custom-scrollbar">
                            <div className="mx-auto min-w-max">
                                <StoryCalendar DiscordId={DiscordId} />
                            </div>
                        </div>
                    </BaseContainer>
                    
                </div>
            </div>
        </div>
    );
};

export default StoryPage;