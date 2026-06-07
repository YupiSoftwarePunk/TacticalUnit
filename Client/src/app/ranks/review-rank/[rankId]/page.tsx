"use client";

import { AccordingUnitsTable, BaseContainer, ColorInputField, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import Tooltip from "@/components/ToolTip/ToolTip";
import ToolTip from "@/components/ToolTip/ToolTip";
import { RankService } from "@/shared/api/services/RankService";
import { validateColor } from "@/typescript/colorValidator";
import UniversalTable from "@/widgets/universalList/universalTable";
import { Check, ChevronDown, Cross, Pencil, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";


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

const mockRanks : IRank[] = []


const mockPermissions : IGivedPermission[] = []

export default function PostPage({params}: {params: Promise<{rankId: string}>}) {
    const { rankId } = React.use(params);
    const [canEdit, setCanEdit] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [canGrant, setCanGrant] = useState(true);
    //const [divisionIsFocused, setDivisionIsFocused] = useState(false);
    const [previousRankIsFocused, setPreviousRankIsFocused] = useState(false);
    const [permissionsExtended, setPermissionExtended] = useState(false);
    const [isNotSaved, setIsNotSaved] = useState(false);



    const [savedRank, setSavedRank] = useState<IRank>(
    {
        id : "0",
        counterToReach : 10,
        previousId : undefined,
        previous : undefined,
        nextId : undefined,
        next : undefined,
        units : [],
        color : "#f3f3f3",
        name : "Имя загружается...",
        rankChevronURL : "#",
        givedPermissions : [],
        giscordRoleId : -1
    });
    const [rank, setRank] = useState<IRank>(savedRank);

    let loaded = false;
    const [error, setError] = useState<string | undefined>();
    function loadData(){
        RankService.getById(rankId as unknown as number).then(
            (data)=>{
                loaded = true;
                setRank(data);
            }
        ).catch((er)=>{setError(`Не удалось загрузить данные | ${er}`);})
    }
    useEffect(()=>{
        loadData();
    }, [])

    if(error!= undefined){return <ErrorScreen error={error}></ErrorScreen>}
    if(!loaded){return <LoadingScreen></LoadingScreen>}



    const [rankPrompt, setRankPrompt] = useState<string>(rank.previous? rank.previous.name : "Пром");

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
        let rankList = mockRanks.filter(rank.previous?.name.length == 0? (x=>x == x):(x=>!x.name.search(rank.previous?.name!)));
        let list : IRankWrapper[] = []
        rankList.forEach(element => {
            list.push({rank: element})
        });
        list.unshift({rank: undefined})
        return list;
    }
    function setPermission(prompt : string){
        if(rank.givedPermissions.find(x=>x.permission.name == prompt)){
            setRank(post=>({...post, givedPermissions: post.givedPermissions.filter(x=>x.permission.name != prompt)}))
        }else{
            let modList : IGivedPermission[] = rank.givedPermissions;
            //modList.push(prompt);
            setRank(post=>({...post, givedPermissions: modList}))
        }
    }
    
    return (<RRForm>
        <div className="flex flex-1 gap-3">
        <Tooltip tooltipText="Шеврон" className="flex flex-1 max-w-50" innerClassName="flex">
                    <div className=" flex flex-col flex-1 h-full">
                        <div className="relative  bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center group">
                            <img 
                            src="/-_-.jpg"
                            alt="Award" 
                            className="flex self-start object-top object-contain overflow-hidden "/>
                            {canEdit && (
                            <button className="absolute bottom-2 right-2 p-2 bg-black/10 dark:bg-black/50 hover:bg-accent opacity-50 hover:opacity-100 transition-all border border-black/20 dark:border-white/10">
                                <Pencil className="text-white hover:text-white" />
                            </button>
                            )}
                        </div>
                    </div>
        </Tooltip>
        <div className="flex flex-col flex-4">

        <BaseContainer>
                
                <ColorInputField editable={canEdit} editMode={true} value={rank.color} onChange={(e)=>{if(validateColor(e.target.value)){setRank(rank=>({...rank, color: e.target.value}))}}}></ColorInputField>
        </BaseContainer>
        <BaseContainer className="flex-col">
            <MultiroleInputField value={rank.name} onChange={(e)=>{setRank(rank=>({...rank, name: e.target.value}))}} tooltip="Наименование звания" editable={canEdit}></MultiroleInputField>
            <MultiroleInputField value={rank.counterToReach} onChange={(e)=>{setRank(rank=>({...rank, counterToReach: Math.max((e.target.value as unknown as number), 1)}))}} tooltip="Кол-во активности до повышения" type="num" editable={canEdit}></MultiroleInputField>
        </BaseContainer>
        <BaseContainer className="flex-col">
            <ListedInputField editable={canEdit} value={rankPrompt} onChange={(e)=>{setRankPrompt}} tooltip="Нижестоящее по иерархии звание" textWhenEmpty="[ Нижестоящее звание не указано ]"></ListedInputField>
            <PermissionRollDownList></PermissionRollDownList>
        </BaseContainer>
        </div>
        </div>
        <AccordingUnitsTable TableName="Бойцы носящие это звание" rightsToGrant={canGrant} GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} GIVEN_DATA={MEMBERS_DATA}></AccordingUnitsTable>
    </RRForm>
    )
    
    
    
    
    
    // return (
    //     <div className="flex flex-col min-h-screen" >
    //         {canEdit&&
    //         <button onClick={saveChanges} className={`fixed bottom-10 self-center text-text-primary bg-bg-primary border border-accent px-10 py-3 text-2xl hover:bg-accent hover:text-black cursor-pointer transition-all `} style={{bottom: `${isNotSaved?  "40px" : "-80px"}`}}>Сохранить изменения</button>
    //         }
    //         <div className="flex">
    //             <MainHeader></MainHeader>
    //         </div>
    //         <div className="flex flex-1 w-full bg-bg-primary transition-colors duration-300" onClick={()=>{checkEditMode()}}>
    //             <div className=" flex flex-col max-w-[1200px] mx-auto pt-10 px-6 animate-in fade-in duration-500">
    //                 <div className="flex flex-col  gap-8 mb-12 items-stretch">
    //                     <div className="flex">
    //                         <Tooltip tooltipText="Шеврон" className="flex">
    //                             <div className=" flex flex-col">
    //                                 <div className="relative bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center group">
    //                                     <img 
    //                                     src="/-_-.jpg"
    //                                     alt="Award" 
    //                                     className="flex object-cover max-h-30"/>
    //                                     {canEdit && (
    //                                     <button className="absolute bottom-2 right-2 p-2 bg-black/10 dark:bg-black/50 hover:bg-accent opacity-0 hover:opacity-100 transition-all border border-black/20 dark:border-white/10">
    //                                         <Pencil className="text-text-primary" />
    //                                     </button>
    //                                     )}
    //                                 </div>
    //                             </div>
    //                         </Tooltip>
    //                         <Tooltip tooltipText="Поле цвета в формате HEX" className="flex flex-col flex-1 self-stretch size-full">
    //                             <div className="flex relative border border-border-secondary min-w-10 h-full"  onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`, background: `${rank.Color}`}}>

    //                                 <h1 className={`flex text-text-primary text-shadow-lg  text-shadow-text-inverted font-text-bold tracking-wider text-lg inset-2 transition-all m-2 ${editMode? "absolute pointer-events-none opacity-0" : " opacity-50"}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
    //                                 {`${rank.Color}`}
    //                                 </h1>
    //                                 {canEdit&&

    //                                 <textarea value={rank.Color} onChange={e=>{e.target.value.length <=7? setRank(post=>({...post,Color: e.target.value})) : e.target.value}} className={`${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-2 flex flex-1 w-fit text-text-primary text-shadow-lg text-shadow-text-inverted font-text-bold text-lg resize-none py-2 transition-all`} style={{padding: `${editMode? "24" : "0"}px`}} rows={1} cols={7}/>
    //                                 }
    //                             </div>
    //                         </Tooltip>
                            
    //                     </div>
                        
    //                     <div className="flex-1 flex flex-col gap-4">
    //                         <BaseContainer onClick={attemptToEdit} tooltip="Наименование должности" style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
    //                             <MultiroleInputField type="text" editable={canEdit} editMode={editMode} value={rank.Name} onChange={e=>{setRank(rank=>({...rank,Name: e.target.value}));}}></MultiroleInputField>
    //                         </BaseContainer>
    //                         <BaseContainer onClick={attemptToEdit} tooltip="Наименование должности" style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
    //                             <MultiroleInputField type="num" editable={canEdit} editMode={editMode} value={rank.CounterToReach} onChange={e=>{setRank(rank=>({...rank, CounterToReach: Math.abs(Math.max(e.target.value as unknown as number, 1))}));}}></MultiroleInputField>
    //                         </BaseContainer>
                            

                            
    //                         <div className="flex flex-col relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
    //                             <Tooltip tooltipText="Вышестоящая должность">

    //                             <h1 className={`flex text-accent font-text-bold tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
    //                             {`${savedRank.Previous == undefined? "[ Нижестоящее звание не указано ]" : savedRank.Previous?.Name}`}
    //                             </h1>
    //                             </Tooltip>

    //                             {canEdit&&
    //                             <div className={`relative flex ${editMode? "" : "absolute opacity-0 pointer-events-none"}`} onClick={attemptToEdit} >
    //                                 <input value={rankPrompt} type="text" onFocus={()=>{changePostFocus(true)}}  
    //                                 onChange={e=>{
    //                                     setRankPrompt(e.target.value);
    //                                     }} className={`flex ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
    //                                 <div  className={`absolute flex font-text-bold p-2 gap-2 flex-col mt-2 z-1 top-full min-h-10 max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${previousRankIsFocused? "" :"opacity-0 pointer-events-none"}`} style={{minHeight: `${previousRankIsFocused? "" :"0px"}`}}>
    //                                     {
    //                                     getRanks(rank.Name!).map((item)=>(
    //                                         <div key={getRanks(rank.Name!).findIndex(X=>X.rank == item.rank)} className="text-text-primary bg-bg-secondary px-4 hover:bg-accent hover:text-black transition-all" 
    //                                         onClick={()=>{
    //                                             setRank(rank=>({...rank, Previous: item.rank}));
    //                                             setSavedRank(rank=>({...rank, Previous: item.rank}));
    //                                             setPreviousRankIsFocused(false);
    //                                         }}
    //                                             >{`${item.rank? item.rank?.Name : "[ Пусто ]"}`}</div>
    //                                     ))
    //                                     }
    //                                 </div>

                                    

    //                             </div>
    //                             }
    //                         </div>
    //                         <div className="flex flex-col relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" >
    //                             <div className="flex justify-between text-accent hover:bg-bg-accent transition-all cursor-pointer" onClick={()=>{setPermissionExtended(!permissionsExtended)}}>

    //                                 <h1 className={`flex font-text-bold tracking-wider text-lg py-2 transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
    //                                 {`Разрешения`}
    //                                 </h1>
    //                                 <ChevronDown className="self-center transition-all" style={{rotate: `${permissionsExtended? "180" : "0"}deg`}}></ChevronDown>
    //                             </div>

    //                             <div className={`relative flex min-h-0 transition-all ${permissionsExtended? "" : "h-0  overflow-clip pointer-events-none"}`} > {/* onClick={attemptToEdit}  */}
    //                                 <div  className={`flex flex-1  font-text-bold min-h-0 p-2 gap-2 flex-col mt-2 z-1 top-full  max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${permissionsExtended? "" :"h-0 pointer-events-none"}`} style={{minHeight: `${permissionsExtended? "" :"0px"}`}}>
    //                                     {!canEdit && 
    //                                         rank.GivedPermissions.map((item)=>(
    //                                         <div key={item.Permission.Name} className="flex">
    //                                             <p className="hover:bg-bg-secondary gap-3 flex flex-1">{item.Permission.Name}</p>
    //                                         </div>
    //                                     ))
    //                                     }
    //                                     {canEdit &&
    //                                     mockPermissions.map((item)=>(
    //                                         <div key={item.Permission.Name} className="flex">
    //                                             <button className="hover:bg-bg-secondary gap-3 flex flex-1 ">
    //                                                 <ToolTip tooltipText="Выдать разрешение" className="flex">
    //                                                     <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setPermission(item.Permission.Name); setIsNotSaved(true)}}> <Check className={`${rank.GivedPermissions.includes(item)? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
    //                                                 </ToolTip>
    //                                                 <ToolTip tooltipText="Наследовать разраешение">
    //                                                     <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setPermission(item.Permission.Name); setIsNotSaved(true)}}> <Check className={`${rank.GivedPermissions.includes(item)? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
    //                                                 </ToolTip>
    //                                                 <p className="text-text-primary font-text-bold">{item.Permission.Name}</p>
    //                                             </button>
                                                
    //                                         </div>
    //                                     ))
    //                                     }
    //                                 </div>

                                    

    //                             </div>
    //                         </div>
                          
                        
    //                     </div>
    //                     <div className="flex self-center font-text-bold hover:text-accent cursor-copy transition-all" onClick={()=>{navigator.clipboard.writeText(`${rank.DiscordRoleId}`)}}>
    //                         <p>ID Discord роли: {rank.DiscordRoleId}</p>
    //                     </div>
    //                 </div>
    //             <AccordingUnitsTable rightsToGrant={canGrant} TableName="Бойцы состоящие на должности" GIVEN_DATA={MEMBERS_DATA} GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG}></AccordingUnitsTable>
                    
    //             </div>
    //             </div>
    //     </div>
    // );
}