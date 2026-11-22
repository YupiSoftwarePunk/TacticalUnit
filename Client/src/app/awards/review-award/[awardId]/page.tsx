'use client';

import { AccordingUnitsTable, BaseContainer, ColorInputField, CopyField, DescriptionInputField, MultiroleInputField, StyledButton } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import Tooltip from "@/components/ToolTip/ToolTip";
import { PostService } from "@/shared/api/services/postService";
import { RankService } from "@/shared/api/services/RankService";
import { RewardService } from "@/shared/api/services/RewardService";
import { validateColor } from "@/typescript/colorValidator";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ImageService } from "@/shared/api/services/imageService";
import { rewardUpdateBody } from "@/shared/api/services/entityUpdates";
import { useManagementPermissions } from "@/shared/api/useManagementPermissions";
import { StaticImage } from "@/components/ImagesComponent/StaticImage";

// тут нужно внедрить ендпоинт изменения данных награды

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

export default function Page({ params }: { params: Promise<{ awardId: string }> }) {
    const { awardId } = React.use(params);
    const [canEdit, setCanEdit] = useState(false);
    const hasPermission = useManagementPermissions();
    const canManage = hasPermission(16);
    const canGrant = hasPermission(13);
    const [isNotSaved, setIsNotSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [imageVersion, setImageVersion] = useState(0);

    const [reward, setReward] = useState<IReward>({
        id: "0",
        name: "Название загружается...",
        conditions: "Условия получения загружаются...",
        privileges: "Привилегии загружаются...",
        color: "#F100FF"
    });

    const [assignedMembers, setAssignedMembers] = useState<Record<string, unknown>[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        async function loadData() {
            try {
                const rewardId = Number(awardId);
                if (isNaN(rewardId)) {
                    throw new Error("Некорректный идентификатор награды (awardId)");
                }

                const [rewardData, membersData, rankData, postData] = await Promise.all([
                    RewardService.getById(awardId),
                    RewardService.getAssigned(awardId),
                    RankService.getAll().catch(() => []),
                    PostService.getAll().catch(() => []),
                ]);

                setReward(rewardData);

                const ranksMap = new Map<string | number | undefined, string>(
                    Array.isArray(rankData) ? rankData.map((r) => [r.id?.toString(), r.name]) : []
                );

                const postsMap = new Map<string | number | undefined, string>(
                    Array.isArray(postData) ? postData.map((p) => [p.id?.toString(), p.name]) : []
                );

                const rawMembers = Array.isArray(membersData) 
                    ? membersData 
                    : (membersData && typeof membersData === 'object' && 'value' in membersData && Array.isArray((membersData as { value: AssignedMember[] }).value))
                        ? (membersData as { value: AssignedMember[] }).value
                        : [];

                const formattedMembers = (rawMembers as unknown as AssignedMember[]).map((member: AssignedMember) => ({
                    ...member,
                    nickname: member.nickname || member.unit?.nickname || "—",
                    rank: ranksMap.get(member.rankId?.toString() || member.unit?.rankId?.toString()) || member.rank || member.unit?.rank?.name || "—",
                    roles: postsMap.get(member.postId?.toString() || member.unit?.postId?.toString()) || member.roles || member.unit?.posts?.map((p) => p.name).join(", ") || "—",
                    kit: member.favoriteKit?.name || member.unit?.favoriteKit?.name || member.kit || member.unit?.kit || "Не выбран"
                }));

                setAssignedMembers(formattedMembers);
                setLoaded(true);
            } 
            catch (er) {
                console.error(er);
                const errorMessage = er instanceof Error ? er.message : "Ошибка при загрузке данных";
                setError(errorMessage);
            }
        }

        loadData();
    }, [awardId]);

    async function saveReward() {
        if (!canManage || isSaving) return;
        setIsSaving(true);
        try {
            const body = rewardUpdateBody(reward);
            await RewardService.patchById(awardId, { body: JSON.stringify(body) });
            const updated = await RewardService.getById(awardId);
            if (JSON.stringify(rewardUpdateBody(updated)) !== JSON.stringify(body)) throw new Error("Сервер не подтвердил все изменения награды");
            setReward(updated);
            setIsNotSaved(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Не удалось сохранить награду");
        } finally { setIsSaving(false); }
    }

    async function updateImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !canManage) return;
        const body = new FormData();
        body.append("file", file);
        try {
            await ImageService.uploadReward(awardId, { body });
            setImageVersion(v => v + 1);
        } catch (err) { alert(err instanceof Error ? err.message : "Не удалось загрузить изображение"); }
        finally { e.target.value = ""; }
    }

    if (error !== undefined) { return <ErrorScreen error={error}></ErrorScreen> }
    if (!loaded) { return <LoadingScreen></LoadingScreen> }

    return (
        <RRForm editable={canEdit && canManage} showSaveChangesButton={isNotSaved} saveChangesMethod={saveReward}>
            <div className="flex flex-col md:flex-row flex-1 gap-6 md:gap-3 w-full">
                <Tooltip tooltipText="награда" className="flex w-full md:flex-1 max-w-full md:max-w-50" innerClassName="flex w-full">
                    <div className="flex flex-col flex-1 h-full">
                        <div className="relative flex items-center justify-center group">
                            <StaticImage
                                key={imageVersion}
                                type="reward"
                                entityId={reward.id?.toString() || ""}
                                alt={reward.name}
                                className="w-full h-full object-contain p-6 transition-all duration-500"
                            />
                            {canManage && <button type="button" onClick={() => setCanEdit(!canEdit)} className="absolute top-2 right-2 p-2 bg-bg-secondary text-text-primary hover:bg-bg-accent text-xs transition-all">{canEdit ? "Просмотр" : "Редактировать"}</button>}
                            {canEdit && canManage && <>
                                <label htmlFor="reward-image" className="absolute bottom-2 right-2 p-2 bg-bg-secondary hover:bg-accent cursor-pointer"><Pencil className="text-text-primary" /></label>
                                <input id="reward-image" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={updateImage} />
                            </>}
                        </div>
                    </div>
                </Tooltip>
                
                <div className="flex flex-col flex-4 gap-2 w-full">
                    <BaseContainer>
                        <ColorInputField 
                            editable={canEdit && canManage && !isSaving}
                            editMode={true} 
                            value={reward.color} 
                            onChange={(e) => {
                                if (validateColor(e.target.value)) {
                                    setReward(prev => ({ ...prev, color: e.target.value })); setIsNotSaved(true)
                                }
                            }}
                        />
                    </BaseContainer>
                    
                    <BaseContainer className="flex-col">
                        <MultiroleInputField 
                            value={reward.name} 
                            onChange={(e) => { setReward(prev => ({ ...prev, name: e.target.value })); setIsNotSaved(true) }}
                            tooltip="Наименование награды" 
                            editable={canEdit && canManage && !isSaving}
                        />
                        <DescriptionInputField 
                            value={reward.conditions} 
                            onChange={(e) => { setReward(prev => ({ ...prev, conditions: e.target.value })); setIsNotSaved(true) }}
                            tooltip="Описание награды" 
                            editable={canEdit && canManage && !isSaving}
                        />
                    </BaseContainer>
                    
                    <BaseContainer className="flex-col">
                        <DescriptionInputField 
                            value={reward.privileges} 
                            onChange={(e) => { setReward(prev => ({ ...prev, privileges: e.target.value })); setIsNotSaved(true) }}
                            tooltip="Привилегии" 
                            editable={canEdit && canManage && !isSaving}
                        />
                    </BaseContainer>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 opacity-50 w-full">
                        <CopyField className="flex flex-1" title="Discord Id" copyInfo={reward.discordRoleId}></CopyField>
                        {canManage && <button type="button" onClick={async () => { try { await RewardService.postDiscordRoleOf(awardId); alert("Сервер принял запрос. Синхронизация роли с Discord ещё требует реализации на сервере."); } catch (err) { alert(err instanceof Error ? err.message : "Не удалось обновить роль"); } }} className="text-text-secondary px-2 hover:text-text-primary-accent hover:bg-bg-secondary transition-all">обновить роль</button>}
                    </div>
                </div>
            </div>

            <AccordingUnitsTable 
                TableName="Награждённые бойцы" 
                rightsToGrant={canGrant} 
                GIVEN_COLUMNS_LAYOUT={COLUMNS_CONFIG} 
                GIVEN_DATA={assignedMembers} 
                UrlToGrantPage={`/awards/assign-award/${reward.id}`}
            />
        </RRForm>
    );
}
