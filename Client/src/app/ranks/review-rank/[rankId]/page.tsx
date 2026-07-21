"use client";

import { AccordingUnitsTable, BaseContainer, ColorInputField, CopyField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList, StyledButton } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { StaticImage } from "@/components/ImagesComponent/StaticImage";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import Tooltip from "@/components/ToolTip/ToolTip";
import { RankService } from "@/shared/api/services/RankService";
import { ImageService } from "@/shared/api/services/imageService";
import { validateColor } from "@/typescript/colorValidator";
import { Pencil } from "lucide-react";
import React, { useEffect, useState, ChangeEvent, useCallback } from "react";

// тут нужно внедрить ендпоинт изменения данных звания

const COLUMNS_CONFIG = [
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "top_role", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
    { key: "steamId", label: "SteamID", sortable: false, filterable: true },
];

interface IMemberRow {
    nickname: string;
    top_role: string;
    kit: string;
    steamId: string;
    discordId: string;
}

interface IRankAssignment {
    unit?: IUnit;
    [key: string]: unknown;
}

export default function PostPage({ params }: { params: Promise<{ rankId: string }> }) {
    const { rankId } = React.use(params);
    const numericRankId = Number(rankId);
    const isIdInvalid = isNaN(numericRankId);

    const [canEdit, setCanEdit] = useState(false);
    const [canGrant] = useState(true);
    const [isNotSaved, setIsNotSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [imageVersion, setImageVersion] = useState<number>(0);

    const [rank, setRank] = useState<IRank>({
        id: "0",
        counterToReach: 0,
        color: "#f3f3f3",
        name: "Загрузка...",
        rankChevronURL: "#",
        givedPermissions: [],
        discordRoleId: "-1"
    });

    const [members, setMembers] = useState<IMemberRow[]>([]);
    const [rankPrompt, setRankPrompt] = useState<string>("");

    const [headList, setHeadList] = useState<IListedInputItem[]>([]);
    const [availableHeadRanks, setAvailableHeadRanks] = useState<IListedInputItem[]>([]);

    const UpdateHeadSearch = useCallback((prompt: string) => {
        const prepList = availableHeadRanks.filter(x => !x.name?.toLowerCase().search(prompt.toLowerCase()));
        setHeadList(prepList);
    }, [availableHeadRanks]);

    useEffect(() => {
        RankService.getAll().then((postList) => {
            const preparedPosts: IListedInputItem[] = [];
            postList.forEach(post => {
                preparedPosts.push({
                    name: post.name,
                    id: post.id?.toString()  
                });
            });
            setAvailableHeadRanks(preparedPosts);
            setHeadList(preparedPosts);
        });
    }, []);
    
    useEffect(() => {
        if (isIdInvalid) {
            return;
        }

        Promise.all([
            RankService.getById(numericRankId),
            RankService.getAssigned(numericRankId)
        ])
        .then(([rankData, membersData]) => {
            setRank(rankData);
            setRankPrompt(rankData.previous?.name || "");

            const rawUnits = Array.isArray(membersData) 
                ? membersData 
                : (membersData as { value?: unknown[] })?.value || [];

            const preparedMembers: IMemberRow[] = (rawUnits as Array<IUnit | IRankAssignment>).map((element) => {
                const unit = element && typeof element === 'object' && 'unit' in element && element.unit
                    ? (element.unit as IUnit) 
                    : (element as IUnit);

                const memberRoles = unit.posts?.map((p: IPost) => p.name).filter(Boolean) || [];

                return {
                    nickname: unit.nickname || "Без никнейма",
                    top_role: memberRoles[0] || "Без должности",
                    kit: unit.favoriteKitId || "Не выбран", 
                    steamId: unit.steamId ? String(unit.steamId) : "—",
                    discordId: String(unit.discordId)
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
    }, [numericRankId]);

    const handleImageUpdate = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);
            try {
                await ImageService.uploadRank(numericRankId, {
                    method: "POST",
                    body: formData
                });
                setImageVersion(prev => prev + 1);
                alert("Шеврон звания успешно обновлен!");
            } catch (err) {
                console.error("Не удалось обновить картинку звания:", err);
                alert("Ошибка при сохранении изображения на сервере.");
            }
        }
    };

    if (error !== undefined) {
        return <ErrorScreen error={error} />;
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <RRForm 
            title="Звание" 
            editable={canEdit} 
            showSaveChangesButton={isNotSaved} 
            saveChangesMethod={() => {
                setIsNotSaved(false);
            }}
        >
            <div className="flex flex-col md:flex-row flex-1 gap-6 md:gap-3">
                <Tooltip tooltipText="Погон" className="flex w-full md:flex-1 max-w-full md:max-w-50" innerClassName="flex w-full">
                    <div className="flex flex-col flex-1 h-full">
                        <div className="relative bg-bg-secondary border border-black/10 dark:border-white/5 flex items-center justify-center group min-h-[160px] w-full">
                            <StaticImage
                                type="rank"
                                entityId={rank.id?.toString() || ""}
                                alt={rank.name}
                                className="mx-auto max-h-[300px] object-contain p-6 transition-all duration-500"
                                key={imageVersion}
                            />
                            <button 
                                type="button"
                                onClick={() => setCanEdit(!canEdit)}
                                className="absolute top-2 right-2 p-2 bg-black/20 text-white rounded hover:bg-black/50 text-xs transition-all"
                            >
                                {canEdit ? "Просмотр" : "Редактировать"}
                            </button>

                            {canEdit && (
                                <>
                                    <label 
                                        htmlFor="rank-file-updater"
                                        className="absolute bottom-2 right-2 p-2 bg-black/10 dark:bg-black/50 hover:bg-accent opacity-50 hover:opacity-100 transition-all border border-black/20 dark:border-white/10 cursor-pointer"
                                    >
                                        <Pencil className="text-white hover:text-white w-5 h-5" />
                                    </label>
                                    <input 
                                        type="file"
                                        id="rank-file-updater"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                        onChange={handleImageUpdate}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </Tooltip>
                <div className="flex flex-col flex-4 w-full">
                    <BaseContainer>
                        <ColorInputField 
                            editable={canEdit} 
                            editMode={true} 
                            value={rank.color} 
                            onChange={(e) => {
                                if (validateColor(e.target.value)) {
                                    setRank(prev => ({ ...prev, color: e.target.value }));
                                    setIsNotSaved(true);
                                }
                            }}
                        />
                    </BaseContainer>
                    <BaseContainer className="flex-col">
                        <MultiroleInputField 
                            value={rank.name} 
                            onChange={(e) => {
                                setRank(prev => ({ ...prev, name: e.target.value }));
                                setIsNotSaved(true);
                            }} 
                            tooltip="Наименование звания" 
                            editable={canEdit}
                        />
                        <MultiroleInputField 
                            value={rank.counterToReach} 
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                setRank(prev => ({ ...prev, counterToReach: Math.max(val, 0) }));
                                setIsNotSaved(true);
                            }} 
                            tooltip="Кол-во активности до повышения" 
                            type="num" 
                            editable={canEdit}
                        />
                    </BaseContainer>
                    <BaseContainer className="flex-col">
                        <ListedInputField 
                            editable={canEdit} 
                            value={rankPrompt} 
                            onChange={(e) => {
                                setRankPrompt(e.target.value);
                                UpdateHeadSearch(e.target.value);
                                setIsNotSaved(true);
                            }} 
                            onChoice={(e)=>{
                                setIsNotSaved(true);
                                setRank({...rank, lowerId: e.id ? parseInt(e.id, 10) : undefined});
                                setRankPrompt(e.name!);
                            }}
                            list={headList}
                            tooltip="Нижестоящее по иерархии звание" 
                            textWhenEmpty="[ Нижестоящее звание не указано ]"
                        />
                        <PermissionRollDownList editable={canEdit} />
                    </BaseContainer>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 opacity-50 w-full">
                        <CopyField className="flex flex-1" title="Discord Id" copyInfo={rank.discordRoleId}></CopyField>
                        <StyledButton title={"обновить роль"}></StyledButton>
                    </div>
                </div>
            </div>
            <AccordingUnitsTable 
                TableName="Бойцы, носящие это звание" 
                rightsToGrant={canGrant} 
                GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} 
                GIVEN_DATA={members}
                UrlToGrantPage={`/ranks/assign-rank/${rank.id}`}
            />
        </RRForm>
    );
}