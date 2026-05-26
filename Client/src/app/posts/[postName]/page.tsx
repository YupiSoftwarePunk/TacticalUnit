"use client";

import { MainHeader } from "@/components/Header/MainHeader";
import UniversalTable from "@/widgets/universalList/universalTable";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";


const MEMBERS_DATA = [
    {
    rank: "Генерал-Майор",
    nickname: "Дениска",
    top_role: "Senior Developer",
    roles: ["Senior Developer", "Пивонос"],
    kit: "Стрелок",
    steamId: "632641236412378",
    discordId: "00000000000000000"
    },
    {
    rank: "Ст. Лейтенант",
    nickname: "NikitaNet",
    top_role: "Начальник службы связи",
    roles: ["Начальник службы связи"],
    kit: "Марксмен",
    steamId: "76561198000000002",
    discordId: "345678901234567890",
    },
    {
    rank: "Полковник",
    nickname: "Ярек",
    top_role: "Старый пират",
    roles: ["Старый пират", "друг флинта", "Не женат"],
    kit: "Пилот",
    steamId: "76561198000000003",
    discordId: "456789012345678901",
    }
];

const COLUMNS_CONFIG = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
];


interface IPost{
    hexColor : string,
    division? : string,
    postName : string,
    showDivisionName : boolean,
    postDescription : string,
    higherPost? : IPost,
    permissions : string[]
}


export default function PostPage({params}: {params: Promise<{postName: string}>}) {
    const { postName } = React.use(params);
    const [canEdit, setCanEdit] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [canGrant, setCanGrant] = useState(true);
    const [post, setPost] = useState<IPost>({
        hexColor: "#ffffff",
        division: "divis",
        postName: "Название должности",
        showDivisionName: false,
        postDescription: "Описание должносттиии",
        permissions: ["разр1", "разр2"]
    });

    let edit = false;

    function checkEditMode(){
        setTimeout(()=>{setEditMode(edit); edit = false}, 5)
    }
    function attemptToEdit(){
        if(canEdit){
            
            edit = true;
        }
    }
    function saveChanges(){
        setPost(post);
    }

    const copyDiscordId = () => {
        navigator.clipboard.writeText("ROLE_ID_12345");
        alert("ID роли скопирован");
    };



    
    
    return (
        <div className="flex flex-col h-screen" >
            <div className="flex">
                <MainHeader></MainHeader>
            </div>
            <div className="flex flex-1 w-full bg-bg-primary transition-colors duration-300" onClick={()=>{checkEditMode()}}>
                <div className=" flex flex-col max-w-[1200px] mx-auto pt-10 px-6 animate-in fade-in duration-500">
                    <div className="flex flex-col md:flex-row gap-8 mb-12 items-stretch md:h-[300px]">
                        <div className="flex flex-col relative border border-border-secondary min-w-10 h-full"  onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`, background: `${post.hexColor}`}}>
                            <h1 className={`flex text-text-primary text-shadow-lg  text-shadow-text-inverted font-text-bold tracking-wider text-lg inset-2 transition-all m-2 ${editMode? "absolute pointer-events-none opacity-0" : " opacity-50"}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                            {`${post.hexColor}`}
                            </h1>
                            {canEdit&&

                            <textarea value={post.hexColor} onPaste={e=>{e.clipboardData.getData('text/plain').length <=7? e : e}} onChange={e=>{e.target.value.length <=7? setPost(post=>({...post,hexColor: e.target.value})) : e.target.value}} className={`${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-2 flex flex-1 w-fit text-text-primary text-shadow-lg text-shadow-text-inverted font-text-bold text-lg resize-none py-2 transition-all`} style={{padding: `${editMode? "24" : "0"}px`}} rows={1} cols={7}/>
                            }
                        </div>

                        <div className="flex-1 flex flex-col gap-4">
                        <div className="flex flex-col relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                            <h1 className={`flex text-accent font-text-bold uppercase tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                            {`${post.postName}`}
                            </h1>
                            {canEdit&&

                            <input value={post.postName} type="text" onChange={e=>{setPost(post=>({...post,postName: e.target.value}));}} className={`flex ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold uppercase tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                            }
                            
                        </div>

                        <div className="flex relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 min-h-[120px] group" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                            <p className={`flex absolute inset-4 text-black dark:text-text-primary font-text text-sm leading-relaxed pr-8 transition-all  py-2 ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                            {`${post.postDescription}`}
                            </p>
                            {canEdit&&

                            <textarea value={post.postDescription} spellCheck="false"  onChange={e=>{setPost(post=>({...post,postDescription: e.target.value}));}} className={`flex inset-4 ${editMode? "" : "absolute opacity-0 pointer-events-none"} resize-none flex absolute flex-1 text-black dark:text-text-primary font-text text-sm leading-relaxed py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                            }
                        </div>

                        
                        </div>
                    </div>

                    <div className="mt-16">
                        <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-header text-black dark:text-text-primary uppercase tracking-wider">
                            Награждённые бойцы
                        </h2>
                        
                        {canGrant && (
                            <Link 
                            href={`/awards/grant/${postName}`}
                            className="text-accent font-text uppercase text-sm border-b-2 border-accent hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-1"
                            >
                            Наградить бойцов
                            </Link>
                        )}
                        </div>

                        <div className="border border-black/10 dark:border-white/5 overflow-hidden">
                        <UniversalTable 
                            data={MEMBERS_DATA} 
                            columns={COLUMNS_CONFIG} 
                            onExport={(data) => console.log("Exporting:", data)}
                        />
                        </div>
                    </div>
                </div>
                </div>
        </div>
    );
}