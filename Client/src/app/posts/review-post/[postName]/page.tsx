"use client";

import { AccordingUnitsTable, BaseContainer, ColorInputField, DescriptionInputField, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import Tooltip from "@/components/ToolTip/ToolTip";
import ToolTip from "@/components/ToolTip/ToolTip";
import { PostService } from "@/shared/api/services/postService";
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




interface IDivision{
    displayName : string,
    actualName : string
}


// const mockPosts : IPost[] = [
//     {
//         Color: "#ffffff",
//         Subdivision: "divis",
//         Name: "Крутая должность",
//         AppendSubdivisionName: false,
//         Description: "Описание должносттиии",
//         GivedPermission: ["разр1", "разр2"],
//         DiscordRoleId: "124234512351345135"
//     },
    
//     {
//         Color: "#ffffff",
//         Subdivision: "divis",
//         Name: "олух",
//         AppendSubdivisionName: false,
//         Description: "Описание должносттиии",
//         GivedPermission: ["разр1", "разр2"],
//         DiscordRoleId: "124234512351345135"
//     }
// ]




const mockDivisions : ISubdivision[] = []
const mockPosts : IPost[] = []
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
    const [isNotSaved, setIsNotSaved] = useState(false);

    

    const [savedPost, setSavedPost] = useState<IPost>({
        id : "0",
        description : "Загрузка описания...",
        subdivisionId : undefined,
        subdivision : undefined,
        appendSubdivisionName : false,
        headId : undefined,
        head : undefined,
        maxRank : {
            id : "0",
            counterToReach : 10,
            previousId : undefined,
            previous : undefined,
            nextId : undefined,
            next : undefined,
            units : [],
            color : "#f6f6f6",
            name : "Загрузка названия звания",
            rankChevronURL : "#",
            givedPermissions : [],
            giscordRoleId : -1
        },
        units : [],
        color : "#b4b4b4",
        name : "Загрузка названия должности...",
        givedPermissions : [],
        discordRoleId : ""
    });
    const [post, setPost] = useState<IPost>(savedPost);


    let loaded = false;
    const [error, setError] = useState<string | undefined>();
    function loadData(){
        PostService.getById(postName as unknown as number).then(
            (data)=>{
                loaded = true;
                setPost(data);
            }
        ).catch((er)=>{setError(`Не удалось загрузить данные | ${er}`);})
    }
    useEffect(()=>{
        loadData();
    }, [])

    if(error!= undefined){return <ErrorScreen error={error}></ErrorScreen>}
    if(!loaded){return <LoadingScreen></LoadingScreen>}







    const [subdivisionPrompt, setSubdivisionPrompt] = useState<string>(post.subdivision? post.subdivision.name : "");
    const [postPrompt, setPostPrompt] = useState<string>(post.head? post.head.name : "");

    let edit = false;
    let wasEditing = false;

    function checkEditMode(){
        setTimeout(()=>{setEditMode(edit); 
            if (!edit) {
                setDivisionIsFocused(false); 
                setPostIsFocused(false);
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
        // let midPost : IPost = {
        //     Color: post.Color,
        //     Subdivision: savedPost.Subdivision,
        //     Name: post.Name,
        //     AppendSubdivisionName: post.AppendSubdivisionName,
        //     Description: post.Description,
        //     GivedPermission: post.GivedPermission,
        //     DiscordRoleId: post.DiscordRoleId,
        //     Head: savedPost.Head,
        // }
        // setSavedPost(midPost);
        setIsNotSaved(false);

    }



    const changeDivisionFocus = (focus : boolean) =>{
        setDivisionIsFocused(focus);
        setPostIsFocused(!focus);
    }
    const changePostFocus = (focus : boolean) =>{
        setDivisionIsFocused(!focus);
        setPostIsFocused(focus);
    }

    const setDivision = (division? : ISubdivision) => {
        setPost(post=>({...post, subdivision: division}) )
        setSavedPost(savedPost=>({...savedPost, subdivision: division}) )
    }

    function getDivisions (prompt:string) : ISubdivision[]{
        // let list = mockDivisions.filter(post.Subdivision?.length == 0? (x=>x == x):(x=>!x.displayName.search(post.Subdivision!)));
        // list.unshift({
            //     actualName: "",
            //     displayName: "[ Без подразделения ]"
            // })
        let list = mockDivisions.filter(post.subdivision?.name.length == 0? (x=>x == x):(x=>!x.name.search(post.subdivision?.name!)));
        return list;
    }
    function getPosts (prompt:string) : IPost[]{
        let list = mockPosts.filter(post.head?.name.length == 0? (x=>x == x):(x=>!x.name.search(post.head?.name!)));
        return list;
    }

    return (<RRForm>
        <div className="flex flex-1 gap-3">
        {/* <Tooltip tooltipText="Шеврон" className="flex flex-1 max-w-50" innerClassName="flex">
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
        </Tooltip> */}
        <div className="flex flex-col flex-4">

        <BaseContainer>
                
                <ColorInputField editable={canEdit} editMode={true} value={post.color} onChange={(e)=>{if(validateColor(e.target.value)){setPost(rank=>({...rank, color: e.target.value}))}}}></ColorInputField>
        </BaseContainer>
        <BaseContainer className="flex-col">
            <MultiroleInputField value={post.name} onChange={(e)=>{setPost(rank=>({...rank, name: e.target.value}))}} tooltip="Наименование должности" editable={canEdit}></MultiroleInputField>
            <DescriptionInputField value={post.description} onChange={(e)=>{setPost(rank=>({...rank, description: e.target.value}))}} tooltip="Описание должности" editable={canEdit}></DescriptionInputField>
        </BaseContainer>
        <BaseContainer className="flex-col">
            <ListedInputField editable={canEdit} value={postPrompt} onChange={(e)=>{setPostPrompt(e.target.value)}} tooltip="Нижестоящая по иерархии должность" textWhenEmpty="[ Нижестоящая должность не указана ]"></ListedInputField>
            <ListedInputField editable={canEdit} value={subdivisionPrompt} onChange={(e)=>{setSubdivisionPrompt(e.target.value)}} tooltip="Подразделение к которому относится должность" textWhenEmpty="[ Подразделение не указано ]"></ListedInputField>
            <PermissionRollDownList></PermissionRollDownList>
        </BaseContainer>
        </div>
        </div>
        <AccordingUnitsTable TableName="Бойцы состоящие на этой должности" rightsToGrant={canGrant} GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} GIVEN_DATA={MEMBERS_DATA}></AccordingUnitsTable>
    </RRForm>
    )
}