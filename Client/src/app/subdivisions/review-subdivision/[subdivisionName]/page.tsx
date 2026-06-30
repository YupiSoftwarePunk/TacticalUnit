"use client";

import { AccordingUnitsTable, BaseContainer, ColorInputField, CopyField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList, StyledButton } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { RRForm } from "@/components/Forms/Review-RedactForm";
import { ErrorScreen, LoadingScreen } from "@/components/StatusScreens/Screens";
import { SubdivisionService } from "@/shared/api/services/SubdivisionService";
import React, { useEffect, useState } from "react";

const COLUMNS_CONFIG = [
    { key: "rank", label: "Звание", sortable: true, filterable: true },
    { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
    { key: "roles", label: "Должность", sortable: false, filterable: true },
    { key: "kit", label: "Избранный кит", sortable: false, filterable: true },
];

export default function PostPage({ params }: { params: Promise<{ subdivisionName: string }> }) {
    const { subdivisionName: subdivisionName } = React.use(params);
    const numericSubdivisionId = Number(subdivisionName);

    const [canEdit, setCanEdit] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isNotSaved, setIsNotSaved] = useState(false);
    
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
    const [members, setMembers] = useState<any[]>([]);

    const [headList, setHeadList] = useState<IListedInputItem[]>([]);
    const [availableHeadSubdivisions, setAvailableHeadSubdivisions] = useState<IListedInputItem[]>([])
    
    useEffect(()=>{
            SubdivisionService.getAll().then((postList) => {
                let preparedPosts : IListedInputItem[] = [];
                postList.forEach(post => {
                    preparedPosts.push({
                        Name: post.name,
                        Id: post.id
                    })
                });
                setAvailableHeadSubdivisions([...preparedPosts]);
                UpdateHeadSearch("");
            })
        },[])

    function UpdateHeadSearch(prompt : string){
        let prepList : IListedInputItem[] = []
        prepList = availableHeadSubdivisions.filter(x=>!x.Name?.toLowerCase().search(prompt.toLowerCase()))
        setHeadList(prepList)
    }
    
    useEffect(() => {
        if (isNaN(numericSubdivisionId)) {
            setError("Некорректный ID подразделения");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        SubdivisionService.getById(numericSubdivisionId)
            .then((subdivisionData) => {
                setSubdivision(subdivisionData);

                if (subdivisionData.head?.name) {
                    setSubdivisionPrompt(subdivisionData.head.name);
                } 
                else {
                    setSubdivisionPrompt("");
                }

                if (Array.isArray((subdivisionData as any).members)) {
                    setMembers((subdivisionData as any).members);
                } 
                else if ((subdivisionData as any).value) {
                    setMembers((subdivisionData as any).value);
                } 
                else {
                    setMembers([]);
                }
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
        <RRForm showSaveChangesButton={isNotSaved} title="Подразделение">
            <div className="flex flex-1 gap-3">
                <div className="flex flex-col flex-4">
                    <BaseContainer>
                        <ColorInputField 
                            editable={canEdit} 
                            value={subdivision.color} 
                        />
                    </BaseContainer>
                    
                    <BaseContainer className="flex-col">
                        <MultiroleInputField 
                            value={subdivision.name} 
                            tooltip="Наименование подразделения" 
                            editable={canEdit} 
                        />
                        <DescriptionInputField 
                            value={subdivision.description} 
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
                            onChange={(e)=>{
                                setSubdivisionPrompt(e.target.value);
                                UpdateHeadSearch(e.target.value);
                                setIsNotSaved(true);
                            }}
                            onChoice={(e)=>{
                                
                                setIsNotSaved(true);
                                setSubdivision({...subdivision, headId: e.Id})
                                setSubdivisionPrompt(e.Name!);
                                
                            }}
                            list={headList}
                        />
                        <PermissionRollDownList editable={canEdit}></PermissionRollDownList>
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