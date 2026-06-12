"use client";

import { UnitService } from "@/shared/api/services/unitService"
import { useEffect, useState } from "react"

interface IProfileBGImage{
    Url? : string
}
export const ProfileBGImage = ({Url} : IProfileBGImage)=>{
    return(
        <div className="flex size-full">

            <img src="#" alt="Profile background image" className="flex object-top object-cover self-center size-full text-white"/>
            <button className="absolute transform bg-bg-primary px-4 py-1 rounded-md transition-all hover:bg-bg-accent bottom-4 right-4">Заменить баннер</button>
        </div>
    )
}

interface IProfileSidePanelLink{
    Name : string,
    Url : string
}
interface IProfileSidePanel{
    imageUrl? : string,
    availableOptions? : IProfileSidePanelLink[],
    Unit? : IUnit
}
export const ProfileSidePanel = ({imageUrl, availableOptions, Unit} : IProfileSidePanel)=>{
    return(                
    <div className="flex border-r border-border-secondary">
        <div className="flex size-full">
            <div className="flex flex-col text-end gap-2">
                                    <div className="flex size-60 bg-black self-end relative">
                                        <img src="#" alt="Profile image" className="object-top object-cover self-center size-full text-white"/>
                                    </div>
                                    <ul className="flex flex-col gap-1 pr-4 items-end">
                                        {availableOptions&& availableOptions.map((item)=>(
                                            <a href={item.Url} key={availableOptions.indexOf(item)} className=" hover:text-accent transition-all">{item.Name}</a>
                                        ))}
                                    </ul>
                                </div>

                </div>
        </div>
    )
}
interface IUnitInfoPanel{
    Unit? : IUnit
}

export const UnitInfoPanel = ({Unit} : IUnitInfoPanel)=>{

    const [states, setStates] = useState<IState[]>();
    useEffect(()=>{
        if(Unit != undefined){
            UnitService.getStates(Unit.discordId as unknown as number).then((data)=>{setStates(data);}).catch((error)=>{console.warn(error)})
        }
    }, [])

    return(
        <div className="flex size-full flex-col gap-2">
                                            <div className="flex flex-col">
                                                <div className="flex justify-items-center gap-3">
                                                    <div className="bg-bg-dark size-8">
                                                        <img src="#" alt="" />
                                                    </div>
                                                    <div className={`text-text-primary relative px-4 self-center`}>
                                                        <div className={`absolute min-h-2 min-w-10 inset-0 px-4 opacity-20 opacity-gradient-to-r from-100 to-0`} style={{background: `${Unit?.rank.color}`}}>{Unit?.rank.name}</div>
                                                        <p className=" flex z-10">{Unit?.rank.name}</p>
                                                    </div>
                                                </div>
                                                <p className="text-text-secondary-accent text-3xl">{Unit?.nickname}</p>
                                            </div>
                                            <ul className="flex flex-col"> 
                                                {Unit?.posts! && Unit?.posts.map((post)=>(
                                                    <p key={post.id}>{post.name}</p>
                                                ))}
                                            </ul>
                                            <div className="flex flex-col">
                                                <ul className="flex gap-2">
                                                    {states && states.map((state)=>(
                                                    <p key={state.discordRoleId}>{state.name}</p>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
    )
}