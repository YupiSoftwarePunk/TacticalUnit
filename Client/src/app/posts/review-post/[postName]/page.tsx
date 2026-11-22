"use client";

import { AccordingUnitsTable, BaseContainer, ColorInputField, CopyField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList, StyledButton } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import { PostService } from "@/shared/api/services/postService";
import { RankService } from "@/shared/api/services/RankService";
import { SubdivisionService } from "@/shared/api/services/SubdivisionService";
import { useManagementPermissions } from "@/shared/api/useManagementPermissions";
import { postUpdateBody } from "@/shared/api/services/entityUpdates";
import { validateColor } from "@/typescript/colorValidator";
import React, { useEffect, useState, useMemo } from "react";

// тут нужно внедрить ендпоинт изменения данных должности

const COLUMNS_CONFIG = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
];

type AssignedMember = {
    nickname?: string;
    rankId?: string | number;
    postId?: string | number;
    rank?: string;
    roles?: string;
    kit?: string;
    steamId?: string | number;
    postsIds: string[];
    favoriteKit?: { name?: string };
    unit?: { nickname?: string; rankId?: string | number; postId?: string | number; rank?: { name?: string }; posts?: { name: string }[]; favoriteKit?: { name?: string }; kit?: string };
};

export default function PostPage({ params }: { params: Promise<{ postName: string }> }) {
    const { postName } = React.use(params);
    const numericPostId = Number(postName);

    const [canEdit, setCanEdit] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const hasPermission = useManagementPermissions();
    const canManage = hasPermission(15);
    const canGrant = hasPermission(12);
    const [isNotSaved, setIsNotSaved] = useState(false);

    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState<string | undefined>();

    const [discordRoleId, setDiscordRoleId] = useState<string>("");
    const [givedPermissions, setGivedPermissions] = useState<IGivedPermission[]>([]);

    const [post, setPost] = useState<IPost>({
        id: "0",
        description: "Загрузка описания...",
        subdivisionId: undefined,
        appendSubdivisionName: false,
        headId: undefined,
        maxRankId: "-1",
        color: "#b4b4b4",
        name: "Загрузка названия должности...",
        fullname: "",
        index: 0,
        permissions: [],
        allPermissions: []
    });

    const [members, setMembers] = useState<Record<string, unknown>[]>([]);
    
    const [postPrompt, setPostPrompt] = useState<string>("");
    const [subdivisionPrompt, setSubdivisionPrompt] = useState<string>("");

    const [availableHeadPosts, setAvailableHeadPosts] = useState<IListedInputItem[]>([]);
    const [availableSubdivisions, setAvailableSubdivisions] = useState<IListedInputItem[]>([]);

    const headList = useMemo(() => {
        return availableHeadPosts.filter(x => x.name?.toLowerCase().startsWith(postPrompt.toLowerCase()));
    }, [availableHeadPosts, postPrompt]);

    const subdivisionList = useMemo(() => {
        return availableSubdivisions.filter(x => x.name?.toLowerCase().startsWith(subdivisionPrompt.toLowerCase()));
    }, [availableSubdivisions, subdivisionPrompt]);

    useEffect(() => {
        PostService.getAll().then((postList) => {
            const preparedPosts: IListedInputItem[] = postList.map(p => ({
                name: p.name,
                id: p.id?.toString()
            }));
            setAvailableHeadPosts(preparedPosts);
        });
    }, []);

    useEffect(() => {
        SubdivisionService.getAll().then((subdivList) => {
            const preparedSubdivs: IListedInputItem[] = subdivList.map(subdiv => ({
                name: subdiv.name,
                id: subdiv.id?.toString()
            }));
            setAvailableSubdivisions(preparedSubdivs);
        });
    }, []);

    useEffect(() => {
        if (isNaN(numericPostId)) return;

        PostService.getDiscordRoleOf(numericPostId).then((result) => {
            const data = result as unknown as { discord_role_id?: string };
            setDiscordRoleId(data.discord_role_id || "");
        }).catch(() => setDiscordRoleId(""));

        Promise.all([
            PostService.getById(numericPostId),
            PostService.getAssigned(numericPostId),
            PostService.getPermissions(numericPostId),
            RankService.getAll().catch(() => []),
        ])
        .then(([postData, membersData, permissionsData, rankData]) => {
            const rawPermissions: IPermission[] = Array.isArray(permissionsData) 
                ? permissionsData 
                : (permissionsData ? [permissionsData] : []);

            const formattedPermissions: IGivedPermission[] = rawPermissions.map((p, index) => ({
                id: p.id?.toString() ?? index.toString(),
                permissionType: 1,
                permission: p,
                inherit: false,
                entity: {}
            }));

            setGivedPermissions(formattedPermissions);
            setPost(postData);

            const ranksMap = new Map<string | number | undefined, string>(
                Array.isArray(rankData) ? rankData.map((r) => [r.id?.toString(), r.name]) : []
            );

            const rawMembers = Array.isArray(membersData) 
                ? membersData 
                : (membersData && typeof membersData === 'object' && 'value' in membersData && Array.isArray((membersData as { value: IAssignedReward[] }).value))
                    ? (membersData as { value: IAssignedReward[] }).value
                    : [];

            const formattedMembers = (rawMembers as unknown as AssignedMember[]).map((member: AssignedMember) => ({
                ...member,
                nickname: member.nickname || "—",
                rank: ranksMap.get(member.rankId) || "—",
                roles: member.roles || postData.name || "—",
                kit: member.favoriteKit?.name || member.kit || "Не выбран"
            }));

            setMembers(formattedMembers);

            if (postData.headId) {
                PostService.getById(postData.headId)
                    .then(head => setPostPrompt(head.name))
                    .catch(() => setPostPrompt(""));
            }

            if (postData.subdivisionId) {
                SubdivisionService.getById(Number(postData.subdivisionId))
                    .then(subdiv => setSubdivisionPrompt(subdiv.name))
                    .catch(() => setSubdivisionPrompt(""));
            }
        })
        .catch((er) => {
            setError(`Не удалось загрузить данные с сервера | ${er.message || er}`);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [numericPostId]);

    async function savePost() {
        if (!canManage || isSaving) return;
        setIsSaving(true);
        try {
            const body = postUpdateBody(post);
            await PostService.patchById(numericPostId, { body: JSON.stringify(body) });
            const updated = await PostService.getById(numericPostId);
            if (JSON.stringify(postUpdateBody(updated)) !== JSON.stringify(body)) throw new Error("Сервер не подтвердил все изменения должности");
            setPost(updated);
            setIsNotSaved(false);
        } catch (err) { alert(err instanceof Error ? err.message : "Не удалось сохранить должность"); }
        finally { setIsSaving(false); }
    }

    if (isNaN(numericPostId)) {
        return <ErrorScreen error="Некорректный ID должности" />;
    }

    if (error !== undefined) {
        return <ErrorScreen error={error} />;
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <RRForm title="Должность" editable={canEdit && canManage} showSaveChangesButton={isNotSaved} saveChangesMethod={savePost}>
            <div className="flex flex-1 gap-3">
                <div className="flex flex-col flex-4">
                    {canManage && <button type="button" onClick={() => setCanEdit(!canEdit)} className="self-end p-2 bg-bg-secondary text-text-primary hover:bg-bg-accent transition-all">{canEdit ? "Просмотр" : "Редактировать"}</button>}
                    <BaseContainer>
                        <ColorInputField 
                            editable={canEdit && canManage && !isSaving}
                            editMode={true} 
                            value={post.color} 
                            onChange={(e) => {
                                if (validateColor(e.target.value)) {
                                    setPost((prev: IPost) => ({ ...prev, color: e.target.value }));
                                    setIsNotSaved(true);
                                }
                            }}
                        />
                    </BaseContainer>
                    <BaseContainer className="flex-col mb-2">
                        <MultiroleInputField 
                            value={post.name} 
                            onChange={(e) => {
                                setPost((prev: IPost) => ({ ...prev, name: e.target.value }));
                                setIsNotSaved(true);
                            }} 
                            tooltip="Наименование должности" 
                            editable={canEdit && canManage && !isSaving}
                        />
                        <DescriptionInputField 
                            className="mt-3"
                            value={post.description} 
                            onChange={(e) => {
                                setPost((prev: IPost) => ({ ...prev, description: e.target.value }));
                                setIsNotSaved(true);
                            }} 
                            tooltip="Описание должности" 
                            editable={canEdit && canManage && !isSaving}
                        />
                    </BaseContainer>
                    <BaseContainer className="flex-col">
                        <ListedInputField 
                            editable={canEdit && canManage && !isSaving}
                            value={postPrompt} 
                            onChange={(e) => {
                                setPostPrompt(e.target.value);
                                setIsNotSaved(true);
                            }} 
                            onChoice={(e: IListedInputItem) => {
                                setIsNotSaved(true);
                                setPost(prev => ({ ...prev, headId: e.id }));
                                setPostPrompt(e.name!);
                            }}
                            list={headList}
                            tooltip="Нижестоящая по иерархии должность" 
                            textWhenEmpty="[ Нижестоящая должность не указана ]"
                        />
                        <ListedInputField 
                            editable={canEdit && canManage && !isSaving}
                            value={subdivisionPrompt} 
                            onChange={(e) => {
                                setSubdivisionPrompt(e.target.value);
                                setIsNotSaved(true);
                            }} 
                            onChoice={(e: IListedInputItem) => {
                                setIsNotSaved(true);
                                setPost(prev => ({ ...prev, subdivisionId: e.id }));
                                setSubdivisionPrompt(e.name!);
                            }}
                            list={subdivisionList}
                            tooltip="Подразделение к которому относится должность" 
                            textWhenEmpty="[ Подразделение не указано ]"
                        />
                        <PermissionRollDownList editable={false} givedPermissionList={givedPermissions}/>
                        {canEdit && canManage && <p className="text-sm text-text-secondary">Изменение разрешений пока недоступно.</p>}
                    </BaseContainer>
                    <div className="flex opacity-50">
                        <CopyField className="flex flex-1" title="Discord Id" copyInfo={discordRoleId} />
                        {canManage && <button type="button" onClick={async () => { try { await PostService.postDiscordRoleOf(numericPostId, {}); alert("Сервер принял запрос. Синхронизация роли с Discord ещё требует реализации на сервере."); } catch (err) { alert(err instanceof Error ? err.message : "Не удалось обновить роль"); } }} className="text-text-secondary px-2 hover:text-text-primary-accent hover:bg-bg-secondary transition-all">обновить роль</button>}
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
