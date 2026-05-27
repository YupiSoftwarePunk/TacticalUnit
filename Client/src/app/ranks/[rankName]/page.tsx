"use client";

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

interface IRank{
    hexColor : string,
    rankName : string,
    activityUntilPromotion : number,
    rankChevronURL? : string,
    lowerRank? : IRank,
    permissions : string[],
    DiscordId : string
}

interface IDivision{
    displayName : string,
    actualName : string
}


const mockRanks : IRank[] = [
    {
        hexColor: "#ffffff",
        rankName: "рядовой райан",
        activityUntilPromotion : 10,
        permissions: ["разр1", "разр2"],
        DiscordId: "124234512351345135"
    },
    {
        hexColor: "#ffffff",
        rankName: "не рядовой",
        activityUntilPromotion : 15,
        permissions: ["разр1", "разр2"],
        DiscordId: "124234512351345135"
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
        hexColor: "#ffffff",
        rankName: "Название звания",
        activityUntilPromotion : 15,
        permissions: ["разр1", "разр2"],
        DiscordId: "124234512351345135"
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
        let rankList = mockRanks.filter(rank.lowerRank?.rankName.length == 0? (x=>x == x):(x=>!x.rankName.search(rank.lowerRank?.rankName!)));
        let list : IRankWrapper[] = []
        rankList.forEach(element => {
            list.push({rank: element})
        });
        list.unshift({rank: undefined})
        return list;
    }

    function setPermission(permissionName :string){
        if(rank.permissions.includes(permissionName)){
            setRank(post=>({...post, permissions: post.permissions.filter(x=>x != permissionName)}))
        }else{
            let modList : string[] = rank.permissions;
            modList.push(permissionName);
            setRank(post=>({...post, permissions: modList}))
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
                                    <div className="relative aspect-square bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center group">
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
                                <div className="flex relative border border-border-secondary min-w-10 h-full"  onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`, background: `${rank.hexColor}`}}>

                                    <h1 className={`flex text-text-primary text-shadow-lg  text-shadow-text-inverted font-text-bold tracking-wider text-lg inset-2 transition-all m-2 ${editMode? "absolute pointer-events-none opacity-0" : " opacity-50"}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                    {`${rank.hexColor}`}
                                    </h1>
                                    {canEdit&&

                                    <textarea value={rank.hexColor} onChange={e=>{e.target.value.length <=7? setRank(post=>({...post,hexColor: e.target.value})) : e.target.value}} className={`${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-2 flex flex-1 w-fit text-text-primary text-shadow-lg text-shadow-text-inverted font-text-bold text-lg resize-none py-2 transition-all`} style={{padding: `${editMode? "24" : "0"}px`}} rows={1} cols={7}/>
                                    }
                                </div>
                            </Tooltip>
                            
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-4">
                            <Tooltip tooltipText="Наименование должности">
                            <div className="flex gap-5 relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                
                                <div className="flex gap-5 flex-1">
                                
                                        <div className="flex flex-1 gap-5 ">
                                            <div className={`flex text-accent font-text-bold uppercase tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>

                                            <h1 className={`flex text-accent font-text-bold uppercase tracking-wider text-lg transition-all ${editMode? "opacity-0" : ""}`} >
                                            {`${rank.rankName}`}
                                            </h1>
                                            </div>
                                            {canEdit&&
                                                <div className={`flex flex-col ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex-1 transition-all`}>
                                                    <input value={rank.rankName} type="text" onChange={e=>{setRank(rank=>({...rank,rankName: e.target.value}));}} className={`flex ${editMode? "" : " opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold uppercase tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                                                    
                                                </div>
                                            }
                                            
                                        </div>
                                    </div>
                                </div>
                            </Tooltip>
                            <Tooltip tooltipText="Кол-во активности до повышения">
                                <div className="flex gap-5 relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                        
                                        <div className="flex gap-5 flex-1">
                                        
                                        <div className="flex flex-1 gap-5 ">
                                            <div className={`flex text-accent font-text-bold uppercase tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>

                                            <h1 className={`flex text-accent font-text-bold uppercase tracking-wider text-lg transition-all ${editMode? "opacity-0" : ""}`} >
                                            {`${rank.activityUntilPromotion}`}
                                            </h1>
                                            </div>
                                            {canEdit&&
                                                <div className={`flex flex-col ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex-1 transition-all`}>
                                                    <input value={rank.activityUntilPromotion} type="number" onChange={e=>{setRank(rank=>({...rank, activityUntilPromotion: (e.target.value as unknown as number)}));}} className={`flex ${editMode? "" : " opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold uppercase tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                                                    
                                                </div>
                                            }
                                            
                                        </div>
                                    </div>
                                </div>
                            </Tooltip>

                            
                            <div className="flex flex-col relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                <Tooltip tooltipText="Вышестоящая должность">

                                <h1 className={`flex text-accent font-text-bold tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                {`${savedRank.lowerRank == undefined? "[ Нижестоящее звание не указано ]" : savedRank.lowerRank?.rankName}`}
                                </h1>
                                </Tooltip>

                                {canEdit&&
                                <div className={`relative flex ${editMode? "" : "absolute opacity-0 pointer-events-none"}`} onClick={attemptToEdit} >
                                    <input value={rank.lowerRank?.rankName? rank.lowerRank?.rankName :""} type="text" onFocus={()=>{changePostFocus(true)}}  
                                    onChange={e=>{
                                        let newHP : IRank = {
                                                rankName : "",
                                                permissions : [],
                                                hexColor : "",
                                                DiscordId: "",
                                                activityUntilPromotion: 10
                                            };
                                        
                                        if(rank.lowerRank != undefined) {
                                            newHP.rankName = rank.lowerRank.rankName;
                                        }
                                        
                                        newHP.rankName = e.target.value;
                                        setRank(post=>({...post, lowerRank: newHP}));
                                        }} className={`flex ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                                    <div  className={`absolute flex font-text-bold p-2 gap-2 flex-col mt-2 z-1 top-full min-h-10 max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${previousRankIsFocused? "" :"opacity-0 pointer-events-none"}`} style={{minHeight: `${previousRankIsFocused? "" :"0px"}`}}>
                                        {
                                        getRanks(rank.rankName!).map((item)=>(
                                            <div key={getRanks(rank.rankName!).findIndex(X=>X.rank == item.rank)} className="text-text-primary bg-bg-secondary px-4 hover:bg-accent hover:text-black transition-all" 
                                            onClick={()=>{
                                                setRank(rank=>({...rank, lowerRank: item.rank}));
                                                setSavedRank(rank=>({...rank, lowerRank: item.rank}));
                                                setPreviousRankIsFocused(false);
                                            }}
                                                >{`${item.rank? item.rank?.rankName : "[ Пусто ]"}`}</div>
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
                                            rank.permissions.map((item)=>(
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
                                                        <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setPermission(item); setIsNotSaved(true)}}> <Check className={`${rank.permissions.includes(item)? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
                                                    </ToolTip>
                                                    <ToolTip tooltipText="Наследовать разраешение">
                                                        <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setPermission(item); setIsNotSaved(true)}}> <Check className={`${rank.permissions.includes(item)? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
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
                        <div className="flex self-center font-text-bold hover:text-accent cursor-copy transition-all" onClick={()=>{navigator.clipboard.writeText(rank.DiscordId)}}>
                            <p>ID Discord роли: {rank.DiscordId}</p>
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