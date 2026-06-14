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
    const [availableHeadPosts, setAvailableHeadPosts] = useState<IListedInputItem[]>([]);
    
    const [subdivisionList, setSubdivisionList] = useState<IListedInputItem[]>([]);
    const [availableSubdivisions, setAvailableSubdivisions] = useState<IListedInputItem[]>([]);


    useEffect(() => {
        if (isNaN(numericPostId)) {
            setError("Некорректный ID должности");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        Promise.all([
            PostService.getById(numericPostId),
            RankService.getAll(),
            PostService.getAll(),
            UnitService.getAll()
        ])
        .then(([postData, ranksData, postsData, unitsData]) => {
            setPost(postData);
            setPostPrompt(postData.head?.name || "");
            setSubdivisionPrompt(postData.subdivision?.name || "");

            const preparedPosts = postsData.map(p => ({ Name: p.name, Id: p.id }));
            setAvailableHeadPosts(preparedPosts);

            if (Array.isArray(unitsData)) {
                const targetPostIdStr = String(numericPostId);

                const filteredUnits = unitsData.filter(unit => 
                    unit.posts?.some(postId => String(postId) === targetPostIdStr)
                );

                const preparedMembers = filteredUnits.map((element: IUnit) => {
                    const memberRoles = element.posts?.map((postId) => {
                        const foundPost = postsData.find(p => String(p.id) === String(postId));
                        return foundPost ? foundPost.name : null;
                    }).filter(Boolean) || [];
                    
                    const currentRank = ranksData.find(r => String(r.id) === String(element.rankId));

                    return {
                        rank: currentRank ? currentRank.name : "Без звания",
                        nickname: element.nickname,
                        roles: memberRoles.join(", ") || "Без должности", 
                        top_role: memberRoles[0] || "Без должности",
                        unit: "В разработке",
                        kit: element.favoriteKitId || "Не выбран", 
                        steamId: element.steamId ? String(element.steamId) : "—",
                        discordId: String(element.discordId),
                    };
                });

                setMembers(preparedMembers);
            }
        })
        .catch((er) => {
            console.error("Ошибка загрузки данных страницы должности:", er);
            setError(`Не удалось загрузить данные с сервера | ${er.message || er}`);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [numericPostId]);

    useEffect(() => {
        SubdivisionService.getAll()
            .then((subdivList) => {
                const preparedSubdivs = subdivList.map(subdiv => ({
                    Name: subdiv.name,
                    Id: subdiv.id
                }));
                setAvailableSubdivisions(preparedSubdivs);
                setSubdivisionList(preparedSubdivs);
            })
            .catch(err => console.error("Ошибка загрузки подразделений:", err));
    }, []);

    function UpdateHeadSearch(prompt: string) {
        const prepList = availableHeadPosts.filter(x => 
            x.Name?.toLowerCase().includes(prompt.toLowerCase())
        );
        setHeadList(prepList);
    }

    function UpdateSubdivisionSearch(prompt: string) {
        const prepList = availableSubdivisions.filter(x => 
            x.Name?.toLowerCase().includes(prompt.toLowerCase())
        );
        setSubdivisionList(prepList);
    }

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
                            onChoice={(e) => {
                                setIsNotSaved(true);
                                setPost({ ...post, headId: e.Id });
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
                            onChoice={(e) => {
                                setPost({ ...post, subdivisionId: e.Id });
                                setSubdivisionPrompt(e.Name!);
                                setIsNotSaved(true);
                            }}
                            list={subdivisionList}
                            tooltip="Подразделение к которому относится должность" 
                            textWhenEmpty="[ Подразделение не указано ]"
                        />
                        <PermissionRollDownList 
                            givedPermissionList={post.givedPermissions} 
                            allPermissionsList={[]}
                            editable={canEdit} 
                            editMode={true}
                        />
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