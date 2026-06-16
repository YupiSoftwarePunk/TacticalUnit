"use client";

import { AccordingUnitsTable, BaseContainer, ColorInputField, CopyField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList, StyledButton } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
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

    const [canEdit, setCanEdit] = useState(false);
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





    }, [numericPostId]);

    if (error !== undefined) {
        return <ErrorScreen error={error} />;
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <RRForm title="Должность" editable={canEdit} showSaveChangesButton={isNotSaved} saveChangesMethod={()=>{setIsNotSaved(false)}}>
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
                        <PermissionRollDownList editable={canEdit}></PermissionRollDownList>
                    </BaseContainer>
                    <div className="flex opacity-50">
                        <CopyField className="flex flex-1" title="Discord Id" copyInfo={post.discordRoleId}></CopyField>
                        <StyledButton title={"обновить роль"}></StyledButton>
                    </div>
                    
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