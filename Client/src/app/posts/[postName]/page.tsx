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


interface IPost{
    hexColor : string,
    division? : string,
    postName : string,
    showDivisionName : boolean,
    postDescription : string,
    higherPost? : IPost,
    permissions : string[],
    DiscordId : string
}

interface IDivision{
    displayName : string,
    actualName : string
}


const mockPosts : IPost[] = [
    {
        hexColor: "#ffffff",
        division: "divis",
        postName: "Крутая должность",
        showDivisionName: false,
        postDescription: "Описание должносттиии",
        permissions: ["разр1", "разр2"],
        DiscordId: "124234512351345135"
    },
    
    {
        hexColor: "#ffffff",
        division: "divis",
        postName: "олух",
        showDivisionName: false,
        postDescription: "Описание должносттиии",
        permissions: ["разр1", "разр2"],
        DiscordId: "124234512351345135"
    }
]




const mockDivisions : IDivision[] = [
    {
        actualName : "подразд1",
        displayName :"подразд1"
    }, 
    {
        actualName : "подз2",
        displayName :"подз2"
    }, 
     
    {
        actualName : "моторчик",
        displayName :"моторчик"
    }]
const mockPermissions : string[] = [
    "разр1", 
    "разр2",
    "разр3",
    "разр4"
]

export default function PostPage({params}: {params: Promise<{postName: string}>}) {
    const { postName } = React.use(params);
    const [canEdit, setCanEdit] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [canGrant, setCanGrant] = useState(true);
    const [divisionIsFocused, setDivisionIsFocused] = useState(false);
    const [postIsFocused, setPostIsFocused] = useState(false);
    const [permissionsExtended, setPermissionExtended] = useState(false);

    const [savedPost, setSavedPost] = useState<IPost>({
        hexColor: "#ffffff",
        division: "divis",
        postName: "Название должности",
        showDivisionName: false,
        postDescription: "Описание должносттиии",
        permissions: ["разр1", "разр2"],
        DiscordId: "124234512351345135"
    });
    const [post, setPost] = useState<IPost>(savedPost);

    let edit = false;

    function checkEditMode(){
        setTimeout(()=>{setEditMode(edit); 
            if (!edit) {
                setDivisionIsFocused(false); 
                setPostIsFocused(false);
            }
            edit = false}, 5)
    }
    function attemptToEdit(){
        if(canEdit){
            
            edit = true;
        }
    }
    function saveChanges(){
        setSavedPost(post);
    }

    const copyDiscordId = () => {
        navigator.clipboard.writeText("ROLE_ID_12345");
        alert("ID роли скопирован");
    };


    const changeDivisionFocus = (focus : boolean) =>{
        setDivisionIsFocused(focus);
        setPostIsFocused(!focus);
    }
    const changePostFocus = (focus : boolean) =>{
        setDivisionIsFocused(!focus);
        setPostIsFocused(focus);
    }

    const setDivision = (division : string) => {
        setPost(post=>({...post, division: division}) )
        setSavedPost(savedPost=>({...savedPost, division: division}) )
    }

    function getDivisions (prompt:string) : IDivision[]{
        let list = mockDivisions.filter(post.division?.length == 0? (x=>x == x):(x=>!x.displayName.search(post.division!)));
        list.unshift({
            actualName: "",
            displayName: "[ Без подразделения ]"
        })
        return list;
    }
    function getPosts (prompt:string) : IPost[]{
        let list = mockPosts.filter(post.higherPost?.postName.length == 0? (x=>x == x):(x=>!x.postName.search(post.higherPost?.postName!)));
        return list;
    }

    function setPermission(permissionName :string){
        if(post.permissions.includes(permissionName)){
            setPost(post=>({...post, permissions: post.permissions.filter(x=>x != permissionName)}))
        }else{
            let modList : string[] = post.permissions;
            modList.push(permissionName);
            setPost(post=>({...post, permissions: modList}))
        }
    }
    
    
    return (
        <div className="flex flex-col h-screen" >
            <div className="flex">
                <MainHeader></MainHeader>
            </div>
            <div className="flex flex-1 w-full bg-bg-primary transition-colors duration-300" onClick={()=>{checkEditMode()}}>
                <div className=" flex flex-col max-w-[1200px] mx-auto pt-10 px-6 animate-in fade-in duration-500">
                    <div className="flex flex-col  gap-8 mb-12 items-stretch">
                        <Tooltip tooltipText="Поле цвета в формате HEX" className="flex flex-col self-stretch size-full">
                            <div className="flex relative border border-border-secondary min-w-10 h-full"  onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`, background: `${post.hexColor}`}}>

                                <h1 className={`flex text-text-primary text-shadow-lg  text-shadow-text-inverted font-text-bold tracking-wider text-lg inset-2 transition-all m-2 ${editMode? "absolute pointer-events-none opacity-0" : " opacity-50"}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                {`${post.hexColor}`}
                                </h1>
                                {canEdit&&

                                <textarea value={post.hexColor} onChange={e=>{e.target.value.length <=7? setPost(post=>({...post,hexColor: e.target.value})) : e.target.value}} className={`${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-2 flex flex-1 w-fit text-text-primary text-shadow-lg text-shadow-text-inverted font-text-bold text-lg resize-none py-2 transition-all`} style={{padding: `${editMode? "24" : "0"}px`}} rows={1} cols={7}/>
                                }
                            </div>
                        </Tooltip>
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="flex flex-col relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                <Tooltip tooltipText="Подразделение"> 

                                <h1 className={`flex text-accent font-text-bold tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                {`${savedPost.division?.length == 0 ? "[ Без подразделения ]" : savedPost.division}`}
                                </h1>                                
                                </Tooltip>


                                {canEdit&&
                                <div className={`relative flex ${editMode? "" : "absolute opacity-0 pointer-events-none"}`} onClick={attemptToEdit} >
                                    <input value={post.division} type="text" onFocus={()=>{changeDivisionFocus(true)}}  onChange={e=>{setPost(post=>({...post, division: e.target.value}));}} className={`flex ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                                    <div  className={`absolute flex font-text-bold p-2 gap-2 flex-col mt-2 z-1 top-full min-h-10 max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${divisionIsFocused? "" :"opacity-0 pointer-events-none"}`} style={{minHeight: `${divisionIsFocused? "" :"0px"}`}}>
                                        {
                                        getDivisions(post.division!).map((item)=>(
                                            <div key={item.actualName} className="text-text-primary bg-bg-secondary px-4 hover:bg-accent hover:text-black transition-all" onClick={()=>{setDivision(item.actualName); changeDivisionFocus(false);}}>{item.displayName}</div>
                                        ))
                                        }
                                    </div>

                                </div>
                                }
                            </div>
                            <div className="flex gap-5 relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                
                                <div className="flex gap-5 flex-1">
                                {post.showDivisionName&& savedPost.division?.length != 0 &&
                                
                                <h1 className={`flex text-accent font-text-bold tracking-wider text-lg py-2 transition-all `}>
                                {`${ savedPost.division}`}
                                </h1>
                                }
                                <div className="flex flex-1 gap-5 ">
                                    <div className={`flex text-accent font-text-bold uppercase tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                    <Tooltip tooltipText="Наименование должности">

                                    <h1 className={`flex text-accent font-text-bold uppercase tracking-wider text-lg transition-all ${editMode? "opacity-0" : ""}`} >
                                    {`${post.postName}`}
                                    </h1>
                                    </Tooltip>
                                    </div>
                                    {canEdit&&
                                        <div className={`flex flex-col ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex-1 transition-all`}>
                                            <input value={post.postName} type="text" onChange={e=>{setPost(post=>({...post,postName: e.target.value}));}} className={`flex ${editMode? "" : " opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold uppercase tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                                            
                                            
                                            <button onClick={()=>{setPost(post=>({...post, showDivisionName: !post.showDivisionName}))}} name="showDivisionButton" className={`flex hover:bg-bg-accent px-3 self-end right-0 gap-2 ${editMode? "mt-1 " : "-mt-5"} transition-all`}>
                                                <label htmlFor="showDivisionButton" className="self-center" itemID="">дополнять названием подразделения</label>
                                                <div className=" m-1 bg-bg-secondary border border-border-secondary">

                                                {post.showDivisionName? <Check></Check> : <X></X>}
                                                </div>
                                            </button>
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                            </div>

                            <div className="flex relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 min-h-[120px] group" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                <Tooltip tooltipText="Описание" className="flex size-full">

                                <p className={`flex absolute text-black dark:text-text-primary font-text text-sm leading-relaxed pr-8 transition-all  py-2 ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                {`${post.postDescription}`}
                                </p>
                                </Tooltip>
                                {canEdit&&

                                <textarea value={post.postDescription} spellCheck="false"  onChange={e=>{setPost(post=>({...post,postDescription: e.target.value}));}} className={`flex inset-4 ${editMode? "" : "absolute opacity-0 pointer-events-none"} resize-none flex absolute flex-1 text-black dark:text-text-primary font-text text-sm leading-relaxed py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                                }
                            </div>
                            
                            <div className="flex flex-col relative border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto" onClick={attemptToEdit} style={{cursor: `${canEdit? "pointer" : "auto"}`}}>
                                <Tooltip tooltipText="Вышестоящая должность">

                                <h1 className={`flex text-accent font-text-bold tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                {`${savedPost.higherPost == undefined? "[ Вышестоящая должность отсутствует ]" : savedPost.higherPost?.postName}`}
                                </h1>
                                </Tooltip>

                                {canEdit&&
                                <div className={`relative flex ${editMode? "" : "absolute opacity-0 pointer-events-none"}`} onClick={attemptToEdit} >
                                    <input value={post.higherPost?.postName? post.higherPost?.postName :""} type="text" onFocus={()=>{changePostFocus(true)}}  
                                    onChange={e=>{
                                        let newHP : IPost = {
                                                postName : "",
                                                postDescription : "",
                                                permissions : [],
                                                hexColor : "",
                                                showDivisionName : false
                                            };
                                        
                                        if(post.higherPost != undefined) {
                                            newHP.postName = post.higherPost.postName;
                                        }
                                        
                                        newHP.postName = e.target.value;
                                        setPost(post=>({...post, higherPost: newHP}));
                                        }} className={`flex ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                                    <div  className={`absolute flex font-text-bold p-2 gap-2 flex-col mt-2 z-1 top-full min-h-10 max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${postIsFocused? "" :"opacity-0 pointer-events-none"}`} style={{minHeight: `${postIsFocused? "" :"0px"}`}}>
                                        {
                                        getPosts(post.division!).map((item)=>(
                                            <div key={item.postName} className="text-text-primary bg-bg-secondary px-4 hover:bg-accent hover:text-black transition-all" 
                                            onClick={()=>{
                                                setPost(post=>({...post, higherPost: item}));
                                                setSavedPost(post=>({...post, higherPost: item}));
                                                changePostFocus(false);
                                            }}
                                                >{item.postName}</div>
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
                                            post.permissions.map((item)=>(
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
                                                        <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setPermission(item)}}> <Check className={`${post.permissions.includes(item)? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
                                                    </ToolTip>
                                                    <ToolTip tooltipText="Наследовать разраешение">
                                                        <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setPermission(item)}}> <Check className={`${post.permissions.includes(item)? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
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
                        <div className="flex self-center font-text-bold hover:text-accent cursor-copy transition-all" onClick={()=>{navigator.clipboard.writeText(post.DiscordId)}}>
                            <p>ID Discord роли: {post.DiscordId}</p>
                        </div>
                    </div>

                    <div className="mt-16">
                        <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-header text-black dark:text-text-primary uppercase tracking-wider">
                            Бойцы стоящие на данной должности
                        </h2>
                        
                        {canGrant && (
                            <Link 
                            href={`/awards/grant/${postName}`}
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