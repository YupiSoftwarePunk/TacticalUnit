"use client";

import { AccordingUnitsTable, BaseContainer, ColorInputField, CopyField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList, StyledButton } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import { SubdivisionService } from "@/shared/api/services/SubdivisionService";
import { validateColor } from "@/typescript/colorValidator";
import React, { useEffect, useState, useCallback } from "react";

// тут нужно внедрить ендпоинт изменения данных подразделения

const COLUMNS_CONFIG = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
];

export interface IMemberRow {
    rank: string;
    nickname: string;
    roles: string;
    kit: string;
}

interface ISubdivisionWithMembers extends ISubdivision {
    members?: unknown[];
    value?: unknown[];
}

export default function PostPage({ params }: { params: Promise<{ subdivisionName: string }> }) {
    const { subdivisionName } = React.use(params);
    const numericSubdivisionId = Number(subdivisionName);
    const isIdInvalid = isNaN(numericSubdivisionId);

    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [isNotSaved, setIsNotSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    const [subdivision, setSubdivision] = useState<ISubdivision>({
        id: "0",
        description: "Загрузка описания...",
        appendHeadName: false,
        posts: [],
        headId: undefined,
        head: undefined,
        subordinates: [],
        givedPermissions: [],
        color: "#006666",
        name: "Загрузка названия...",
        discordRoleId: "-1"
    });

    const [subdivisionPrompt, setSubdivisionPrompt] = useState<string>("");
    const [members, setMembers] = useState<IMemberRow[]>([]);

    const [headList, setHeadList] = useState<IListedInputItem[]>([]);
    const [availableHeadSubdivisions, setAvailableHeadSubdivisions] = useState<IListedInputItem[]>([]);

    const UpdateHeadSearch = useCallback((prompt: string) => {
        const prepList = availableHeadSubdivisions.filter(
            x => !x.name?.toLowerCase().search(prompt.toLowerCase())
        );
        setHeadList(prepList);
    }, [availableHeadSubdivisions]);

    useEffect(() => {
        SubdivisionService.getAll().then((postList) => {
            const preparedPosts: IListedInputItem[] = [];
            postList.forEach(post => {
                preparedPosts.push({
                    name: post.name,
                    id: post.id
                });
            });
            setAvailableHeadSubdivisions(preparedPosts);
            setHeadList(preparedPosts);
        });
    }, []);
    
    useEffect(() => {
        if (isIdInvalid) {
            return;
        }

        Promise.all([
            SubdivisionService.getById(numericSubdivisionId),
            SubdivisionService.getPermissions(numericSubdivisionId)
        ])
            .then(([subdivisionData, permissionsData]) => {
                const rawPermissions: unknown[] = Array.isArray(permissionsData) 
                    ? permissionsData 
                    : (permissionsData ? [permissionsData] : []);

                const formattedPermissions: IGivedPermission[] = rawPermissions.map((p) => {
                    const item = p as Record<string, unknown>;
                    if (item && typeof item === 'object' && 'permission' in item) {
                        return item as unknown as IGivedPermission;
                    }
                    return {
                        id: item?.id,
                        inherit: false,
                        permission: item as unknown as IPermission
                    } as IGivedPermission;
                });

                setSubdivision({
                    ...subdivisionData,
                    givedPermissions: formattedPermissions
                });

                if (subdivisionData.head?.name) {
                    setSubdivisionPrompt(subdivisionData.head.name);
                } 
                else {
                    setSubdivisionPrompt("");
                }

                const extendedData = subdivisionData as unknown as ISubdivisionWithMembers;
                const rawMembers = Array.isArray(extendedData.members)
                    ? extendedData.members
                    : extendedData.value || [];

                const preparedMembers: IMemberRow[] = rawMembers.map((m) => {
                    const unit = m && typeof m === "object" && "unit" in m ? (m.unit as IUnit) : (m as IUnit);
                    const memberRoles = unit?.posts?.map((p) => p.name).filter(Boolean) || [];
                    
                    return {
                        rank: unit?.rank?.name || "Без звания",
                        nickname: unit?.nickname || "Без никнейма",
                        roles: memberRoles.join(", ") || "Без должности",
                        kit: unit?.favoriteKitId || "Не выбран"
                    };
                });

                setMembers(preparedMembers);
            })
            .catch((er) => {
                setError(`Не удалось загрузить данные с сервера | ${er.message || er}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [numericSubdivisionId]);

    if (error !== undefined) {
        return <ErrorScreen error={error} />;
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <RRForm 
            showSaveChangesButton={isNotSaved} 
            title="Подразделение"
            editable={canEdit}
            saveChangesMethod={() => {
                setIsNotSaved(false);
            }}
        >
            <div className="flex flex-col md:flex-row flex-1 gap-3">
                <div className="flex flex-col flex-4 w-full">
                    <div className="flex justify-end mb-2">
                        <button 
                            type="button"
                            onClick={() => setCanEdit(!canEdit)}
                            className="p-2 bg-black/20 text-white rounded hover:bg-black/50 text-xs transition-all dark:bg-white/10 dark:hover:bg-white/20"
                        >
                            {canEdit ? "Просмотр" : "Редактировать"}
                        </button>
                    </div>

                    <BaseContainer>
                        <ColorInputField 
                            editable={canEdit} 
                            editMode={true}
                            value={subdivision.color} 
                            onChange={(e) => {
                                if (validateColor(e.target.value)) {
                                    setSubdivision(prev => ({ ...prev, color: e.target.value }));
                                    setIsNotSaved(true);
                                }
                            }}
                        />
                    </BaseContainer>
                    
                    <BaseContainer className="flex-col">
                        <MultiroleInputField 
                            value={subdivision.name} 
                            onChange={(e) => {
                                setSubdivision(prev => ({ ...prev, name: e.target.value }));
                                setIsNotSaved(true);
                            }}
                            tooltip="Наименование подразделения" 
                            editable={canEdit} 
                        />
                        <DescriptionInputField 
                            value={subdivision.description} 
                            onChange={(e) => {
                                setSubdivision(prev => ({ ...prev, description: e.target.value }));
                                setIsNotSaved(true);
                            }}
                            tooltip="Описание подразделения" 
                            editable={canEdit} 
                        />
                    </BaseContainer>
                    
                    <BaseContainer className="flex-col">
                        <ListedInputField 
                            editable={canEdit} 
                            value={subdivisionPrompt} 
                            tooltip="Подразделение к которому относится это подразделение" 
                            textWhenEmpty="[ Подразделение не указано ]" 
                            onChange={(e) => {
                                setSubdivisionPrompt(e.target.value);
                                UpdateHeadSearch(e.target.value);
                                setIsNotSaved(true);
                            }}
                            onChoice={(e) => {
                                setIsNotSaved(true);
                                setSubdivision({ ...subdivision, headId: e.id });
                                setSubdivisionPrompt(e.name!);
                            }}
                            list={headList}
                        />
                        <PermissionRollDownList editable={canEdit} givedPermissionList={subdivision.givedPermissions} />
                    </BaseContainer>
                    <div className="flex opacity-50">
                        <CopyField className="flex flex-1" title="Discord Id" copyInfo={subdivision.discordRoleId}></CopyField>
                        <StyledButton title={"обновить роль"}></StyledButton>
                    </div>
                </div>
            </div>
            
            <AccordingUnitsTable 
                TableName="Бойцы состоящие в этом подразделении" 
                rightsToGrant={false} 
                GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} 
                GIVEN_DATA={members} 
            />
        </RRForm>
    );
}