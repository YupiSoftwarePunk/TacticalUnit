"use client";

import { PostService } from "@/shared/api/services/postService";
import { RankService } from "@/shared/api/services/RankService";
import { RewardService } from "@/shared/api/services/RewardService";
import { SquareUser } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"
import Tooltip from "../ToolTip/ToolTip";
import { StaticImage } from "@/components/ImagesComponent/StaticImage";

interface IProfileBGImage {
    backgroundPictureId: string | undefined;
    canEdit? : boolean;
}

export const ProfileBGImage = ({ backgroundPictureId, canEdit = false }: IProfileBGImage) => {
    return (
        <div className="flex size-full relative">
            <StaticImage  
                type="background"
                entityId={backgroundPictureId || "default"}
                alt="Profile background image"
                className="flex object-top grayscale-40 object-cover self-center size-full text-white"
            />
            {canEdit && (
                <button className="absolute bg-bg-primary/90 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-md text-xs sm:text-sm transition-all hover:text-black hover:bg-accent bottom-3 right-3 sm:bottom-4 sm:right-4 font-text-bold border border-bg-secondary">
                    Заменить баннер
                </button>
            )}
        </div>
    )
}

interface IProfileSidePanel {
    imageUrl? : string,
    availableOptions? : IActionMenuOption[],
    Unit? : IUnit
}

export const ProfileSidePanel = ({ imageUrl, availableOptions, Unit }: IProfileSidePanel) => {
    return (                
        <div className="flex w-full justify-center md:justify-end">
            <div className="flex flex-col items-center md:items-end gap-4 w-full">
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 relative border border-bg-secondary bg-bg-secondary/10 overflow-hidden">
                    {imageUrl ? (
                        <img src={`${imageUrl}`} alt="Profile image" className="object-top bg-black object-cover size-full text-white"/>
                    ) : (
                        <SquareUser className="size-full text-text-secondary/60 p-4"></SquareUser>
                    )}
                </div>

                <ul className="flex flex-col gap-1.5 w-full text-center md:text-end px-2 md:pr-4">
                    {availableOptions && availableOptions.map((item) => (
                        <Link 
                            href={item.url} 
                            key={item.id} 
                            className="hover:text-text-secondary-accent hover:bg-bg-secondary/40 flex transition-all justify-center md:justify-end py-1 px-3 md:px-0 rounded md:rounded-none border border-bg-secondary/30 md:border-none"
                        >
                            <p className="text-sm sm:text-base font-text-bold tracking-wide">{item.name}</p>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    )
}

interface IUnitInfoPanel {
    Unit? : IUnit
}

export const UnitInfoPanel = ({ Unit }: IUnitInfoPanel) => {
    const [rank, setRank] = useState<IRank>();
    const [posts, setPosts] = useState<IPost[]>([]);

    useEffect(() => {
        if (Unit != undefined) {
            RankService.getById(Unit.rankId).then(r => { setRank(r); })
            Unit.postsIds.forEach(id => {
                PostService.getById(id).then(p => { 
                    setPosts(prev => {
                        if (prev.find(x => x.id === p.id)) return prev;
                        return [...prev, p];
                    }); 
                })
            });
        }
    }, [Unit])

    return (
        <div className="flex w-full flex-col gap-4 text-center md:text-left items-center md:items-start">
            <div className="flex flex-col items-center md:items-start gap-2 w-full">

                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                    <div className="bg-bg-dark size-8 flex items-center justify-center border border-bg-secondary/50">
                        <img src="#" alt="" className="hidden" />
                    </div>
                    
                    <div className="text-text-primary relative px-4 py-0.5 min-h-7 flex items-center justify-center overflow-hidden rounded border border-white/10">
                        <Link 
                            href={Unit?.rankId == undefined ? "" : `/ranks/review-rank/${Unit.rankId}`} 
                            className="absolute inset-0 px-4 opacity-20 hover:opacity-40 transition-all bg-gradient-to-r from-bg-secondary to-transparent" 
                            style={{ backgroundColor: `${rank?.color || "#ffffff"}` }}
                        >
                            &nbsp;
                        </Link>
                        <p className="relative z-10 text-xs sm:text-sm font-text-bold tracking-wider uppercase pointer-events-none">
                            {rank != undefined ? rank.name : "[ Без звания ]"}
                        </p>
                    </div>
                </div>

                <h1 className="text-text-secondary-accent text-2xl sm:text-3xl md:text-4xl font-text-bold tracking-tight mt-1">
                    {Unit?.nickname || "Загрузка..."}
                </h1>
            </div>

            <div className="w-full flex flex-col items-center md:items-start gap-1">
                <span className="text-[10px] uppercase tracking-widest text-text-secondary/50 font-text-bold">Занимаемые должности</span>
                <ul className="flex flex-col gap-1 w-full items-center md:items-start"> 
                    {posts.length > 0 ? posts.map((post) => (
                        <Link 
                            href={`/posts/review-post/${post.id}`} 
                            className="text-sm sm:text-base text-text-primary/90 hover:text-text-primary-accent hover:underline transition-all font-text-bold bg-bg-secondary/20 md:bg-transparent px-3 py-1 md:p-0 rounded border border-bg-secondary/40 md:border-none" 
                            key={post.id}
                        >
                            {post.name}
                        </Link>
                    )) : (
                        <span className="text-xs italic text-text-secondary/40">Должности отсутствуют</span>
                    )}
                </ul>
            </div>
        </div>
    )
}

interface IRewardDisplay {
    rewardId : string
}

export const RewardDisplay = ({ rewardId }: IRewardDisplay) => {
    const [reward, setReward] = useState<IReward>();

    useEffect(() => {
        RewardService.getById(rewardId).then((r) => { setReward(r) })
    }, [rewardId])

    return (
        <Link href={`/awards/review-award/${reward?.id}`} className="w-10 h-16 sm:w-11 sm:h-18 transition-transform hover:scale-105 block">
            <Tooltip tooltipText={reward?.name} className="size-full flex" tooltipAlignment="center" verticalPlacement="top" className_Tooltip="flex text-nowrap">
                <StaticImage
                    type="reward"
                    entityId={rewardId}
                    alt={reward?.name || "Reward"}
                    className="size-full object-center object-contain overflow-hidden filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                />
            </Tooltip>
        </Link>
    )
}