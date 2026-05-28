'use client'
import { ActivityCalendar } from "@/components/ActivityCalendar.tsx/ActivityCalendar";
import { MainHeader } from "@/components/Header/MainHeader";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

interface IActionMenuOption{
    name : string,
    accessOnRoles : string[],
    url : string
}







export default function Profile(){
    const params = useSearchParams();
    const id = params?.get("id"); 
    

    

    if (!id) {
        return (<LoadingScreen></LoadingScreen>);
    }

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
                <img src="#" alt="Profile background image" className="flex object-top object-cover self-center size-full text-white"/>
                <button className="absolute transform bg-bg-primary px-4 py-1 rounded-md transition-all hover:bg-bg-accent bottom-4 right-4">Заменить баннер</button>
            </div>
            <div className="flex max-lg:flex-col flex-1 justify-center bg-bg-primary py-8 text-xl">
                <div className="flex justify-end border-r border-border-primary">
                    <div className="flex flex-col text-end gap-2">
                        <div className="flex size-60 bg-black self-end relative">
                            <img src="#" alt="Profile image" className="object-top object-cover self-center size-full text-white"/>
                        </div>
                        <ul className="flex flex-col gap-1 pr-4 items-end">
                            {menuOptions.map((item)=>(
                                <a href={item.url} key={menuOptions.indexOf(item)} className=" hover:text-accent transition-all">{item.name}</a>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col px-4">
                    <div className="flex flex-1 gap-5">
                        <div className="flex flex-col flex-1">
                            <div className="flex flex-1">

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <div className="flex justify-items-center gap-3">
                                            <div className="bg-bg-dark size-8">
                                                <img src="#" alt="" />
                                            </div>
                                            <p className="text-text-secondary self-center">Звание</p>
                                        </div>
                                        <p className="text-text-secondary-accent text-3xl">Никнейм</p>
                                    </div>
                                    <ul className="flex flex-col"> 
                                        <p>Должность 1</p>
                                        <p>Должность 2</p>
                                    </ul>
                                    <div className="flex flex-col">
                                        <ul className="flex gap-2">
                                            <p className="flex ">Статус 1</p>
                                            <p className="flex ">Статус 2</p>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex ">
                                <ActivityCalendar></ActivityCalendar>
                            </div>
                        </div>
                        <div className="flex">





                            <div className="flex flex-col flex-3 justify-start gap-4">
                                <div className="flex flex-col">
                                    <div className="flex size-80 border-b border-border-primary">
                                        <img src="AK-74__163.png" alt="Soldier of heaven" className="object-top object-cover self-center size-full text-white"/>
                                    </div>
                                    <p className="text-text-secondary">Избранный кит :</p>
                                    <p className="text-text-secondary-accent mt-[-8px]">Командир отряда</p>
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