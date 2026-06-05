'use client'
import { ActivityCalendar } from "@/components/ActivityCalendar/BaseCalendar/ActivityCalendar";
import { MainHeader } from "@/components/Header/MainHeader";
import { ProfileBGImage, ProfileSidePanel, UnitInfoPanel } from "@/components/ProfileComponents/ProfileComponents";
import {LoadingScreen, ErrorScreen} from "@/components/StatusScreens/Screens";
import { getBaseVariables } from "@/typescript/variables";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

interface IActionMenuOption{
    name : string,
    accessOnRoles : string[],
    url : string
}


interface IUnit {

}




export default function Profile({ params }: { params: Promise<{DiscordId: string}> }){
    // const params = useSearchParams();
    // if (!id) {
    //     return (<LoadingScreen></LoadingScreen>);
    // }
    const {DiscordId} = React.use(params);
    

    const [jsonData, setJsonData] = useState<IUnit>();
    const dom : string = getBaseVariables().dom;
    useEffect(()=>{
        // var r = fetch(`${dom}/api/unit/${id}`).then((response)=>response.json()).then((data)=>setJsonData(data)).catch(error=>{
        //     console.warn("fail to fetch: "+ error)
        // })
        
    }, [])
    if (jsonData == undefined){
        //return (<ErrorScreen error="Не удалось получить данные профиля"></ErrorScreen>);
    }
    
    const [unitData, setUnitData] = useState<IUnit>();

    const [accessRoles, setAccessRoles] = useState<string[]>([]);
    const [menuOptions, setMenuOptions] = useState<IActionMenuOption[]>([
    {
        name : "Заменить баннер",
        url : "/",
        accessOnRoles : ["host", "admin"]
    },
    {
        name : "Какая-то опция",
        url : "/",
        accessOnRoles : ["any"]
    }
    ]);
    return(
        <div className="flex flex-col min-h-screen text-text-secondary font-text">
            <MainHeader></MainHeader>
            <div className="flex min-h-[250px] h-[30vh] bg-black relative">
                <ProfileBGImage></ProfileBGImage>
            </div>
            <div className="flex   flex-1 justify-center bg-bg-primary py-8 text-xl">
                <div className="flex border-r border-border-secondary">
                    <ProfileSidePanel></ProfileSidePanel>
                </div>
                <div className="flex flex-col px-4">
                    <div className="flex flex-1 gap-5 max-lg:flex-col">
                        <div className="flex flex-col  flex-1">
                            <div className="flex flex-1">

                                <div className="flex flex-col">
                                    <UnitInfoPanel></UnitInfoPanel>
                                </div>
                            </div>
                            <div className="flex ">
                                <ActivityCalendar></ActivityCalendar>
                            </div>
                        </div>
                        <div className="flex ">

                            <div className="flex flex-col flex-3 justify-start gap-4">
                                <div className="flex flex-col">
                                    <div className="flex size-80 border-b border-border-primary">
                                        <img src="/AK-74__163.png" alt="Soldier of heaven" className="object-top object-cover self-center size-full text-white"/>
                                    </div>
                                    <p className="text-text-secondary">Избранный кит :</p>
                                    <p className="text-text-secondary-accent -mt-2">Командир отряда</p>
                                </div>
                                
                                <div className="flex flex-col">
                                    <div className="flex flex-wrap max-w-77 gap-1">
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                        <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}