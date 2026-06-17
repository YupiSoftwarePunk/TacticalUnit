import StoryCalendar from "@/components/ActivityCalendar/StoryCalendar/StoryCalendar";
import { MainHeader } from "@/components/Header/MainHeader";
import { ProfileBGImage, ProfileSidePanel, UnitInfoPanel } from "@/components/ProfileComponents/ProfileComponents";
import React from "react";

const storyPage = ({ params }: { params: Promise<{DiscordId: string}> }) => {
    const {DiscordId} = React.use(params);
    if(DiscordId){console.warn(DiscordId)}
    return(
        <div className="flex flex-col flex-1 min-h-screen bg-bg-dark transition-all">
            <MainHeader></MainHeader>
            <div className="flex min-h-[250px] h-[30vh] bg-black relative">
                <ProfileBGImage></ProfileBGImage>
            </div>
            <div className="flex flex-1 bg-bg-primary mx-5 lg:mx-20 transition-all px-5 pt-10 gap-8">
                <div className="flex gap-2 flex-1">
                    <ProfileSidePanel></ProfileSidePanel>
                    <div className="flex flex-col flex-1">
                        <UnitInfoPanel></UnitInfoPanel>
                        <StoryCalendar DiscordId={DiscordId}></StoryCalendar>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default storyPage;