"use client";

import { BaseContainer, MultiroleInputField } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { MainHeader } from "@/components/Header/MainHeader";
import Tooltip from "@/components/ToolTip/ToolTip";
import ToolTip from "@/components/ToolTip/ToolTip";
import UniversalTable from "@/widgets/universalList/universalTable";
import { Check, ChevronDown, Cross, Pencil, X } from "lucide-react";
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

interface IRankWrapper{
    rank?: IRank
}

const mockRanks : IRank[] = [
    {
        Color: "#ffffff",
        Name: "рядовой райан",
        CounterToReach : 10,
        GivedPermissions: ["разр1", "разр2"],
        DiscordRoleId: "124234512351345135"
    },
    {
        Color: "#ffffff",
        Name: "не рядовой",
        CounterToReach : 15,
        GivedPermissions: ["разр1", "разр2"],
        DiscordRoleId: "124234512351345135"
    },
]


const mockPermissions : string[] = [
    "разр1", 
    "разр2",
    "разр3",
    "разр4"
]

export default function PostPage({params}: {params: Promise<{rankName: string}>}) {
    const { rankName } = React.use(params);
    const [canEdit, setCanEdit] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [canGrant, setCanGrant] = useState(true);
    //const [divisionIsFocused, setDivisionIsFocused] = useState(false);
    const [previousRankIsFocused, setPreviousRankIsFocused] = useState(false);
    const [permissionsExtended, setPermissionExtended] = useState(false);
    const [isNotSaved, setIsNotSaved] = useState(false);

    const [savedRank, setSavedRank] = useState<IRank>(
    {
        Color: "#ffffff",
        Name: "Название звания",
        CounterToReach : 15,
        GivedPermissions: ["разр1", "разр2"],
        DiscordRoleId: "124234512351345135"
    });
    const [rank, setRank] = useState<IRank>(savedRank);

    let edit = false;
    let wasEditing = false;

    function checkEditMode(){
        setTimeout(()=>{setEditMode(edit); 
            if (!edit) {
                //setDivisionIsFocused(false); 
                setPreviousRankIsFocused(false);
                if (wasEditing){
                    
                    setIsNotSaved(true);
                }
            }
            edit = false}, 5)
    }
    function attemptToEdit(){
        if(canEdit){
            
            edit = true;
            wasEditing = true;
        }
    }
    function saveChanges(){
        // let midPost : IRank = {
        //     hexColor: rank.hexColor,
        //     division: savedRank.division,
        //     rankName: rank.rankName,
        //     showDivisionName: rank.showDivisionName,
        //     postDescription: rank.postDescription,
        //     permissions: rank.permissions,
        //     DiscordId: rank.DiscordId,
        //     lowerRank: savedRank.lowerRank,
        // }
        // setSavedRank(midPost);
        setIsNotSaved(false);

    }



    const changeDivisionFocus = (focus : boolean) =>{
        //setDivisionIsFocused(focus);
        setPreviousRankIsFocused(!focus);
    }
    const changePostFocus = (focus : boolean) =>{
        //setDivisionIsFocused(!focus);
        setPreviousRankIsFocused(focus);
    }

    const setDivision = (division : string) => {
        setRank(post=>({...post, division: division}) )
        setSavedRank(savedPost=>({...savedPost, division: division}) )
    }

    // function getDivisions (prompt:string) : IDivision[]{
    //     let list = mockDivisions.filter(rank.division?.length == 0? (x=>x == x):(x=>!x.displayName.search(rank.division!)));
    //     list.unshift({
    //         actualName: "",
    //         displayName: "[ Без подразделения ]"
    //     })
    //     return list;
    // }
    function getRanks (prompt:string) : IRankWrapper[]{
        let rankList = mockRanks.filter(rank.Previous?.Name.length == 0? (x=>x == x):(x=>!x.Name.search(rank.Previous?.Name!)));
        let list : IRankWrapper[] = []
        rankList.forEach(element => {
            list.push({rank: element})
        });
        list.unshift({rank: undefined})
        return list;
    }
    function setPermission(permissionName :string){
        if(rank.GivedPermissions.includes(permissionName)){
            setRank(post=>({...post, GivedPermissions: post.GivedPermissions.filter(x=>x != permissionName)}))
        }else{
            let modList : string[] = rank.GivedPermissions;
            modList.push(permissionName);
            setRank(post=>({...post, GivedPermissions: modList}))
        }
    }
    
    
    return (
        <div className="flex flex-col h-screen" >
            {canEdit&&
            <button onClick={saveChanges} className={`fixed bottom-10 self-center text-text-primary bg-bg-primary border border-accent px-10 py-3 text-2xl hover:bg-accent hover:text-black cursor-pointer transition-all `} style={{bottom: `${isNotSaved?  "40px" : "-80px"}`}}>Сохранить изменения</button>
            }
            <div className="flex">
                <MainHeader></MainHeader>
            </div>
            <div className="flex flex-1 w-full bg-bg-primary transition-colors duration-300" onClick={()=>{checkEditMode()}}>
                <div className=" flex flex-col max-w-[1200px] mx-auto pt-10 px-6 animate-in fade-in duration-500">
                    <div className="flex flex-col  gap-8 mb-12 items-stretch">
                        <div className="flex">
                            <Tooltip tooltipText="Шеврон" className="flex">
                                <div className=" flex flex-col">
                                    <div className="relative bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center group">
                                        <img 
                                        src="/-_-.jpg"
                                        alt="Award" 
                                        className="flex object-cover max-h-30"/>
                                        {canEdit && (
                                        <button className="absolute bottom-2 right-2 p-2 bg-black/10 dark:bg-black/50 hover:bg-accent opacity-0 hover:opacity-100 transition-all border border-black/20 dark:border-white/10">
                                            <Pencil className="text-text-primary" />
                                        </button>
                                        )}
                                    </div>
                                </div>
                            </Tooltip>
                            <Tooltip tooltipText="Поле цвета в формате HEX" className="flex flex-col flex-1 self-stretch size-full">
                                <div className="flex relative border border-border-secondary min-w-10 h-full"  onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`, background: `${rank.Color}`}}>

                                    <h1 className={`flex text-text-primary text-shadow-lg  text-shadow-text-inverted font-text-bold tracking-wider text-lg inset-2 transition-all m-2 ${editMode? "absolute pointer-events-none opacity-0" : " opacity-50"}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                    {`${rank.Color}`}
                                    </h1>
                                    {canEdit&&

                                    <textarea value={rank.Color} onChange={e=>{e.target.value.length <=7? setRank(post=>({...post,Color: e.target.value})) : e.target.value}} className={`${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-2 flex flex-1 w-fit text-text-primary text-shadow-lg text-shadow-text-inverted font-text-bold text-lg resize-none py-2 transition-all`} style={{padding: `${editMode? "24" : "0"}px`}} rows={1} cols={7}/>
                                    }
                                </div>
                            </Tooltip>
                            
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-4">
                            <BaseContainer onClick={attemptToEdit} tooltip="Наименование должности" style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                <MultiroleInputField type="text" editable={canEdit} editMode={editMode} value={rank.Name} onChange={e=>{setRank(rank=>({...rank,Name: e.target.value}));}}></MultiroleInputField>
                            </BaseContainer>
                            <BaseContainer onClick={attemptToEdit} tooltip="Наименование должности" style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                <MultiroleInputField type="num" editable={canEdit} editMode={editMode} value={rank.CounterToReach} onChange={e=>{setRank(rank=>({...rank, CounterToReach: Math.abs(Math.max(e.target.value as unknown as number, 1))}));}}></MultiroleInputField>
                            </BaseContainer>
                            

                            
                            <div className="flex flex-col relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                <Tooltip tooltipText="Вышестоящая должность">

                                <h1 className={`flex text-accent font-text-bold tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                {`${savedRank.Previous == undefined? "[ Нижестоящее звание не указано ]" : savedRank.Previous?.Name}`}
                                </h1>
                                </Tooltip>

                                {canEdit&&
                                <div className={`relative flex ${editMode? "" : "absolute opacity-0 pointer-events-none"}`} onClick={attemptToEdit} >
                                    <input value={rank.Previous?.Name? rank.Previous?.Name :""} type="text" onFocus={()=>{changePostFocus(true)}}  
                                    onChange={e=>{
                                        let newHP : IRank = {
                                                Name : "",
                                                GivedPermissions : [],
                                                Color : "",
                                                DiscordRoleId: "",
                                                CounterToReach: 10
                                            };
                                        
                                        if(rank.Previous != undefined) {
                                            newHP.Name = rank.Previous.Name;
                                        }
                                        
                                        newHP.Name = e.target.value;
                                        setRank(post=>({...post, Previous: newHP}));
                                        }} className={`flex ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                                    <div  className={`absolute flex font-text-bold p-2 gap-2 flex-col mt-2 z-1 top-full min-h-10 max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${previousRankIsFocused? "" :"opacity-0 pointer-events-none"}`} style={{minHeight: `${previousRankIsFocused? "" :"0px"}`}}>
                                        {
                                        getRanks(rank.Name!).map((item)=>(
                                            <div key={getRanks(rank.Name!).findIndex(X=>X.rank == item.rank)} className="text-text-primary bg-bg-secondary px-4 hover:bg-accent hover:text-black transition-all" 
                                            onClick={()=>{
                                                setRank(rank=>({...rank, Previous: item.rank}));
                                                setSavedRank(rank=>({...rank, Previous: item.rank}));
                                                setPreviousRankIsFocused(false);
                                            }}
                                                >{`${item.rank? item.rank?.Name : "[ Пусто ]"}`}</div>
                                        ))
                                        }
                                    </div>

                                    

                                </div>
                                }
                            </div>
                            <div className="flex flex-col relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" >
                                <div className="flex justify-between text-accent hover:bg-bg-accent transition-all cursor-pointer" onClick={()=>{setPermissionExtended(!permissionsExtended)}}>

                                    <h1 className={`flex font-text-bold tracking-wider text-lg py-2 transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                    {`Разрешения`}
                                    </h1>
                                    <ChevronDown className="self-center transition-all" style={{rotate: `${permissionsExtended? "180" : "0"}deg`}}></ChevronDown>
                                </div>

                                <div className={`relative flex min-h-0 transition-all ${permissionsExtended? "" : "h-0  overflow-clip pointer-events-none"}`} > {/* onClick={attemptToEdit}  */}
                                    <div  className={`flex flex-1  font-text-bold min-h-0 p-2 gap-2 flex-col mt-2 z-1 top-full  max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${permissionsExtended? "" :"h-0 pointer-events-none"}`} style={{minHeight: `${permissionsExtended? "" :"0px"}`}}>
                                        {!canEdit && 
                                            rank.GivedPermissions.map((item)=>(
                                            <div key={item} className="flex">
                                                <p className="hover:bg-bg-secondary gap-3 flex flex-1">{item}</p>
                                            </div>
                                        ))
                                        }
                                        {canEdit &&
                                        mockPermissions.map((item)=>(
                                            <div key={item} className="flex">
                                                <button className="hover:bg-bg-secondary gap-3 flex flex-1 ">
                                                    <ToolTip tooltipText="Выдать разрешение" className="flex">
                                                        <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setPermission(item); setIsNotSaved(true)}}> <Check className={`${rank.GivedPermissions.includes(item)? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
                                                    </ToolTip>
                                                    <ToolTip tooltipText="Наследовать разраешение">
                                                        <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setPermission(item); setIsNotSaved(true)}}> <Check className={`${rank.GivedPermissions.includes(item)? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
                                                    </ToolTip>
                                                    <p className="text-text-primary font-text-bold">{item}</p>
                                                </button>
                                                
                                            </div>
                                        ))
                                        }
                                    </div>

                                    

                                </div>
                            </div>
                          
                        
                        </div>
                        <div className="flex self-center font-text-bold hover:text-accent cursor-copy transition-all" onClick={()=>{navigator.clipboard.writeText(rank.DiscordRoleId)}}>
                            <p>ID Discord роли: {rank.DiscordRoleId}</p>
                        </div>
                    </div>

                    <div className="mt-16">
                        <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-header text-black dark:text-text-primary uppercase tracking-wider">
                            Бойцы носящие это звание
                        </h2>
                        
                        {canGrant && (
                            <Link 
                            href={`/awards/grant/${rankName}`}
                            className="text-accent font-text uppercase text-sm border-b-2 border-accent hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-1"
                            >
                            Назначить бойца
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