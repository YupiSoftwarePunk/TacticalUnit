"use client";

import { AccordingUnitsTable, BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import Tooltip from "@/components/ToolTip/ToolTip";
import { PostService } from "@/shared/api/services/postService";
import { RankService } from "@/shared/api/services/RankService";
import { SubdivisionService } from "@/shared/api/services/SubdivisionService";
import { UnitService } from "@/shared/api/services/unitService";
import { validateColor } from "@/typescript/colorValidator";
import React, { useEffect, useState } from "react";

const COLUMNS_CONFIG = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
];

export default function PostPage({ params }: { params: Promise<{ postName: string }> }) {
    const { postName } = React.use(params);
    const numericPostId = Number(postName);

    const [canEdit, setCanEdit] = useState(true);
    const [canGrant, setCanGrant] = useState(true);
    const [isNotSaved, setIsNotSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();


    const [post, setPost] = useState<IPost>({
        id: "0",
        description: "Загрузка описания...",
        subdivisionId: undefined,
        subdivision: undefined,
        appendSubdivisionName: false,
        headId: undefined,
        head: undefined,
        maxRankId: "-1",
        units: [],
        color: "#b4b4b4",
        name: "Загрузка названия должности...",
        givedPermissions: [],
        discordRoleId: ""
    });

    const [members, setMembers] = useState<any[]>([]);
    const [postPrompt, setPostPrompt] = useState<string>("");
    const [subdivisionPrompt, setSubdivisionPrompt] = useState<string>("");


    const [headList, setHeadList] = useState<IListedInputItem[]>([]);
    const [availableHeadPosts, setAvailableHeadPosts] = useState<IListedInputItem[]>([])
    
    useEffect(()=>{
            PostService.getAll().then((postList) => {
                let preparedPosts : IListedInputItem[] = [];
                postList.forEach(post => {
                    preparedPosts.push({
                        Name: post.name,
                        Id: post.id
                    })
                });
                setAvailableHeadPosts([...preparedPosts]);
                UpdateHeadSearch("");
            })
        },[])

    function UpdateHeadSearch(prompt : string){
        let prepList : IListedInputItem[] = []
        prepList = availableHeadPosts.filter(x=>!x.Name?.toLowerCase().search(prompt.toLowerCase()))
        setHeadList(prepList)
    }

    const [subdivisionList, setSubdivisionList] = useState<IListedInputItem[]>([]);
    const [availableSubdivisions, setAvailableSubdivisions] = useState<IListedInputItem[]>([])
    
    useEffect(()=>{
            SubdivisionService.getAll().then((postList) => {
                let preparedPosts : IListedInputItem[] = [];
                postList.forEach(subdiv => {
                    preparedPosts.push({
                        Name: subdiv.name,
                        Id: subdiv.id
                    })
                });
                setAvailableSubdivisions([...preparedPosts]);
                UpdateSubdivisionSearch("");
            })
        },[])

    function UpdateSubdivisionSearch(prompt : string){
        let prepList : IListedInputItem[] = []
        prepList = availableSubdivisions.filter(x=>!x.Name?.toLowerCase().search(prompt.toLowerCase()))
        setSubdivisionList(prepList)
    }



    useEffect(() => {
        if (isNaN(numericPostId)) {
            setError("Некорректный ID должности");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        Promise.all([
            PostService.getById(numericPostId),
            PostService.getAssigned(numericPostId)
        ])
        .then(([postData, membersData]) => {
            setPost(postData);
            
            if (Array.isArray(membersData)) {
                setMembers(membersData);
            } else if (membersData && (membersData as any).value) {
                setMembers((membersData as any).value);
            }

            setPostPrompt(postData.head?.name || "");
            setSubdivisionPrompt(postData.subdivision?.name || "");
        })
        .catch((er) => {
            setError(`Не удалось загрузить данные с сервера | ${er.message || er}`);
        })
        .finally(() => {
            setIsLoading(false);
        });






        let ranks : IRank[] = []
            let posts : IPost[] = []
    
    
            const fetchMembers = async () => {
                
    
                try {
                    await RankService.getAll().then(sRanks => {
                    ranks = [...sRanks];
                    })
                    await PostService.getAll().then(sPosts => {
                        posts = [...sPosts];
                    })
                    const units = await UnitService.getAll();
                    if (!units || !Array.isArray(units)) return;

                    let filteredUnits : IUnit[] = []
                    units.forEach(unit => {
                        if (unit.posts.find(x=>x.id == post.id)){
                            filteredUnits.push(unit);
                        }
                    });
    
                    const preparedMemberArray = filteredUnits.map((element: IUnit) => {
                        const memberRoles: string[] = element.posts?.map((p) => p.name).filter(Boolean) || [];
                        const topRole = memberRoles[0] || "Без должности";
                        const unitName = element.posts?.[0]?.subdivision?.name || "Вне подразделения";
    
                        let formattedJoinDate = "—";
                        if (element.joined) {
                            const date = new Date(element.joined);
                            if (!isNaN(date.getTime())) {
                                const day = String(date.getDate()).padStart(2, "0");
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const year = date.getFullYear();
                                formattedJoinDate = `${day}.${month}.${year}`;
                            }
                        }
                        // console.warn(`${element.rankId}`);
                        // console.warn(ranks.find(x=>`${x.id}` == `${element.rankId}`)?.name);
                        
                        let setRank = ranks.find(x=>x.id == element.rankId)
                        let setPost = posts.find(x=>x.id == element.posts[0]?.id)
                        
                        // console.warn(setRank);
    
                        return {
                            rank: setRank? setRank.name : "Без звания",
                            nickname: element.nickname,
                            top_role: topRole,
                            roles: memberRoles,
                            unit: unitName,
                            activity_week: (element as any).activity_week ?? (element as any).activityWeek ?? 0,
                            activity_month: (element as any).activity_month ?? (element as any).activityMonth ?? 0,
                            activity_year: (element as any).activity_year ?? (element as any).activityYear ?? 0,
                            activity_total: (element as any).activity_total ?? (element as any).activityTotal ?? 0,
                            kit: (element as any).favoriteKit?.name || (element as any).kit || "Не выбран",
                            steamId: element.steamId ? String(element.steamId) : "—",
                            discordId: String(element.discordId),
                            joinDate: formattedJoinDate
                        };
                    });
    
                    setMembers(preparedMemberArray);
                    setIsLoading(false);
                } 
                catch (err) {
                    console.error("Ошибка при получении личного состава:", err);
                    setError(err as string);
                }
            };
    
            fetchMembers();



    }, [numericPostId]);

    if (error !== undefined) {
        return <ErrorScreen error={error} />;
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <RRForm>
            <div className="flex flex-1 gap-3">
                <div className="flex flex-col flex-4">
                    <BaseContainer>
                        <ColorInputField 
                            editable={canEdit} 
                            editMode={true} 
                            value={post.color} 
                            onChange={(e) => {
                                if (validateColor(e.target.value)) {
                                    setPost((prev: any) => ({ ...prev, color: e.target.value }));
                                    setIsNotSaved(true);
                                }
                            }}
                        />
                    </BaseContainer>
                    <BaseContainer className="flex-col">
                        <MultiroleInputField 
                            value={post.name} 
                            onChange={(e) => {
                                setPost((prev: any) => ({ ...prev, name: e.target.value }));
                                setIsNotSaved(true);
                            }} 
                            tooltip="Наименование должности" 
                            editable={canEdit}
                        />
                        <DescriptionInputField 
                            value={post.description} 
                            onChange={(e) => {
                                setPost((prev: any) => ({ ...prev, description: e.target.value }));
                                setIsNotSaved(true);
                            }} 
                            tooltip="Описание должности" 
                            editable={canEdit}
                        />
                    </BaseContainer>
                    <BaseContainer className="flex-col">
                        <ListedInputField 
                            editable={canEdit} 
                            value={postPrompt} 
                            onChange={(e) => {
                                UpdateHeadSearch(e.target.value);
                                setPostPrompt(e.target.value);
                                setIsNotSaved(true);
                            }} 
                            onChoice={(e)=>{
                                setIsNotSaved(true);
                                setPost({...post, headId: e.Id})
                                setPostPrompt(e.Name!);
                            }}
                            list={headList}
                            tooltip="Нижестоящая по иерархии должность" 
                            textWhenEmpty="[ Нижестоящая должность не указана ]"
                        />
                        <ListedInputField 
                            editable={canEdit} 
                            value={subdivisionPrompt} 
                            onChange={(e) => {
                                UpdateSubdivisionSearch(e.target.value);
                                setSubdivisionPrompt(e.target.value);
                                setIsNotSaved(true);
                            }} 
                            onChoice={(e)=>{
                                setPost({...post, subdivisionId: e.Id})
                                setSubdivisionPrompt(e.Name!);

                            }}
                            list={subdivisionList}
                            tooltip="Подразделение к которому относится должность" 
                            textWhenEmpty="[ Подразделение не указано ]"
                        />
                        <PermissionRollDownList />
                    </BaseContainer>
                </div>
            </div>
            <AccordingUnitsTable 
                TableName="Бойцы состоящие на этой должности" 
                rightsToGrant={canGrant} 
                GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} 
                GIVEN_DATA={members}
                UrlToGrantPage={`/posts/assign-post/${post.id}`}
            />
        </RRForm>
    );
}