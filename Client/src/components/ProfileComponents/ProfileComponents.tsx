"use client";

import { PostService } from "@/shared/api/services/postService";
import { RankService } from "@/shared/api/services/RankService";
import { UnitService } from "@/shared/api/services/unitService"
import { SquareUser } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"

interface IProfileBGImage{
    Url? : string,
    canEdit? : boolean
}
export const ProfileBGImage = ({Url, canEdit = false} : IProfileBGImage)=>{
    return(
        <div className="flex size-full">

            <img src={`${Url? Url : "/bgPlaceholder.png"}`} alt="Profile background image" className="flex object-top grayscale-40 object-cover self-center size-full text-white"/>
            {canEdit&&
            <button className="absolute transform bg-bg-primary px-4 py-1 rounded-md transition-all hover:text-black hover:bg-accent bottom-4 right-4">Заменить баннер</button>
            }
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
    <div className="flex ">
        <div className="flex size-full">
            <div className="flex flex-col text-end gap-2">
                                    <div className="flex size-60 self-end relative">
                                        {imageUrl?
                                        <img src={`${imageUrl}`} alt="Profile image" className="object-top bg-black object-cover self-center size-full text-white"/>
                                        : <SquareUser className="size-full  text-text-secondary"></SquareUser>
                                        }
                                    </div>
                                    <ul className="flex flex-col gap-1 pr-4 items-end">
                                        {availableOptions&& availableOptions.map((item)=>(
                                            <Link href={item.Url} key={availableOptions.indexOf(item)} className=" hover:text-accent transition-all">{item.Name}</Link>
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

    //const [states, setStates] = useState<IState[]>();
    const [rank, setRank] = useState<IRank>();
    const [posts, setPosts] = useState<IPost[]>([]);
    useEffect(()=>{
        if(Unit != undefined){
            //UnitService.getStates(Unit.discordId as unknown as number).then((data)=>{setStates(data);}).catch((error)=>{console.warn(error)})
            RankService.getById(Unit.rankId).then(r=>{setRank(r);})
            Unit.postsIds.forEach(id => {
                PostService.getById(id).then(p=>{ 
                    let newList : IPost[] = [...posts, ...[p]]
                    setPosts( newList); 
                    // console.warn(newList)
                })
            });
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
                                                        <Link href={Unit?.rankId == undefined?  "" : `/ranks/review-rank/${Unit.rankId}`} className={`absolute min-h-2 min-w-10 inset-0 px-4 opacity-20 opacity-gradient-to-r hover:text-text-primary-accent hover:cursor-pointer from-100 to-0 transition-all`} style={{background: `${rank != undefined? rank.color : "#ffffff"}`}}>{rank != undefined? rank.name : "[ Без звания ]"}</Link>
                                                        <p className="flex z-10 hover:text-text-primary-accent hover:cursor-pointer transition-all">{rank != undefined? rank.name : "[ Без звания ]"}</p>
                                                    </div>
                                                </div>
                                                <p className="text-text-secondary-accent text-3xl">{Unit?.nickname}</p>
                                            </div>
                                            <ul className="flex flex-col"> 
                                                {posts! && posts.map((post)=>(
                                                    <Link href={`/posts/review-post/${post.id}`} className="hover:text-text-primary-accent hover:underline transition-all" key={post.id}>{post.name}</Link>
                                                ))}
                                            </ul>
                                            {/* <div className="flex flex-col">
                                                <ul className="flex gap-2">
                                                    {states && states.map((state)=>(
                                                    <Link href={`/${state.discordRoleId}`} key={state.discordRoleId}>{state.name}</Link>
                                                    ))}
                                                </ul>
                                            </div> */}
                                        </div>
    )
}