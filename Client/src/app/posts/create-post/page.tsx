'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { PostService } from "@/shared/api/services/postService";
import { RankService } from "@/shared/api/services/RankService";
import { validateColor } from "@/typescript/colorValidator";
import { error } from "console";
import { useState } from "react";



const mockG : IGivedPermission[] = [
    {
        id : "0",
        permissionType : 1,
        permission : {
            name: "Разрешен1",
            permissionType : 1,
            description : "",
            givedPermissions: []
        },
        inherit : false,
        entity: {}
    },
    {
        id : "1",
        permissionType : 1,
        permission : {
            name: "Разрешен2",
            permissionType : 1,
            description : "какая-то крутая разрешение",
            givedPermissions: []
        },
        inherit : false,
        entity: {}
    },
    {
        id : "2",
        permissionType : 1,
        permission : {
            name: "Разрешен3",
            permissionType : 1,
            description : "какая-то НЕ ОЧЕНЬ разрешение",
            givedPermissions: []
        },
        inherit : false,
        entity: {}
    }
]


export default function createSubdivPage(){
    const [rankName, setRankName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [availableRanks, setAvailableRanks] = useState<IRank[]>([]);
    const [maxRankId, setMaxRankId] = useState<number>();
    const [headPrompt, setHeadPrompt] = useState<string>();
    const [headList, setHeadList] = useState<IListedInputItem[]>([]);

    const [color, setColor] = useState<string>("#ffffff");

    let [permissions, setPermissions] = useState<IGivedPermission[]>([
        {
            id : "1",
            permissionType : 1,
            permission : {
                name: "Разрешен2",
                permissionType : 1,
                description : "какая-то крутая разрешение",
                givedPermissions: []
            },
            inherit : false,
            entity: {}
        },
        {
            id : "2",
            permissionType : 1,
            permission : {
                name: "Разрешен3",
                permissionType : 1,
                description : "какая-то НЕ ОЧЕНЬ разрешение",
                givedPermissions: []
            },
            inherit : false,
            entity: {}
        }
    ])

    function UpdateSearch(prompt : string){
        setHeadList( [
            {
                Name : ""
        },
            {
                Id: 0,
                Name : "Первый"
        },
            {
                Id: 1,
                Name : "Второй"
        }
    ])
    }


    function sendForm(){
        let problems : string = "";
        if(rankName.replace(' ', '').length == 0){
            problems += "Название должности\n";
        }
        if(maxRankId == undefined){
            problems += "Высшее звание\n";
        }
        if (problems){
            alert("Вы забыли указать:\n"+problems)
            return;
        }
        if (!validateColor(color)){
            alert("Цвет указан с ошибками, проверьте, что цвет начинается с \"#\" и содержит 6 символов после \"#\"");
            return
        }
        let newRank : IPost = {
            color : color,
            description : description,
            appendSubdivisionName : true,
            name : rankName,
            givedPermissions : permissions,
            maxRankId : maxRankId!


        }
        PostService.add({method: "POST", body:JSON.stringify({newRank})});
        
    }


    return(<div className="flex flex-col min-h-screen">
        <MainHeader></MainHeader>

        <CreationForm title="Создание должности" onClickSend={()=>{sendForm()}}>
            <BaseContainer className="flex-col">
                <ColorInputField watermark="Цвет" value={color} editMode={true} onChange={(e)=>{setColor(e.target.value)}} editable={true}></ColorInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <MultiroleInputField tooltip="Название должности" watermark="Название должности" value={rankName} editMode={true} onChange={(e)=>{setRankName(e.target.value)}} editable={true}></MultiroleInputField>
                <DescriptionInputField watermark="Описание должности" value={description} onChange={(e)=>{setDescription(e.target.value)}} editMode={true} editable={true}></DescriptionInputField>
            </BaseContainer>

            <BaseContainer>
                <ListedInputField tooltip="Вышестоящая должность" list={headList} value={headPrompt} onChoice={(el)=>{setHeadPrompt(el.Name); setMaxRankId(el.Id)}} onChange={(e)=>{setHeadPrompt(e.target.value); UpdateSearch(headPrompt? headPrompt : "")}} editable={true} editMode={true}></ListedInputField>
            </BaseContainer>
            <BaseContainer>
                <PermissionRollDownList givedPermissionList={permissions} allPermissionsList={mockG} onChange={(list)=>{setPermissions(list); console.warn(list)}} editable={true} editMode={true}></PermissionRollDownList>
            </BaseContainer>
        </CreationForm>
    </div>)
}