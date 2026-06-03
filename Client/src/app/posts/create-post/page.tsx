'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { validateColor } from "@/typescript/colorValidator";
import { error } from "console";
import { useState } from "react";



const mockG : IGivedPermission[] = [
    {
        Id : 0,
        PermissionType : 1,
        Permission : {
            Name: "Разрешен1",
            PermissionType : 1,
            Description : "",
            GivedPermissions: []
        },
        Inherit : false,
        Entity: {}
    },
    {
        Id : 1,
        PermissionType : 1,
        Permission : {
            Name: "Разрешен2",
            PermissionType : 1,
            Description : "какая-то крутая разрешение",
            GivedPermissions: []
        },
        Inherit : false,
        Entity: {}
    },
    {
        Id : 2,
        PermissionType : 1,
        Permission : {
            Name: "Разрешен3",
            PermissionType : 1,
            Description : "какая-то НЕ ОЧЕНЬ разрешение",
            GivedPermissions: []
        },
        Inherit : false,
        Entity: {}
    }
]


export default function createSubdivPage(){
    const [rankName, setRankName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [activityToPromotion, setActivityToPromotion] = useState<number>(1);

    const [availableRanks, setAvailableRanks] = useState<IRank[]>([]);
    const [maxRank, setMaxRank] = useState<IRank>();
    const [headPrompt, setHeadPrompt] = useState<string>();
    const [headList, setHeadList] = useState<IListedInputItem[]>([]);

    const [color, setColor] = useState<string>("#ffffff");

    let [permissions, setPermissions] = useState<IGivedPermission[]>([
        {
            Id : 1,
            PermissionType : 1,
            Permission : {
                Name: "Разрешен2",
                PermissionType : 1,
                Description : "какая-то крутая разрешение",
                GivedPermissions: []
            },
            Inherit : false,
            Entity: {}
        },
        {
            Id : 2,
            PermissionType : 1,
            Permission : {
                Name: "Разрешен3",
                PermissionType : 1,
                Description : "какая-то НЕ ОЧЕНЬ разрешение",
                GivedPermissions: []
            },
            Inherit : false,
            Entity: {}
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
        if(maxRank == undefined){
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
            Color : color,
            Description : description,
            AppendSubdivisionName : true,
            Name : rankName,
            GivedPermissions : permissions,
            MaxRank : maxRank!


        }
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
                <ListedInputField tooltip="Вышестоящая должность" list={headList} value={headPrompt} onChoice={(el)=>{setHeadPrompt(el.Name); setMaxRank(availableRanks?.find(x=>x.Id == el.Id))}} onChange={(e)=>{setHeadPrompt(e.target.value); UpdateSearch(headPrompt? headPrompt : "")}} editable={true} editMode={true}></ListedInputField>
            </BaseContainer>
            <BaseContainer>
                <PermissionRollDownList givedPermissionList={permissions} allPermissionsList={mockG} onChange={(list)=>{setPermissions(list); console.warn(list)}} editable={true} editMode={true}></PermissionRollDownList>
            </BaseContainer>
        </CreationForm>
    </div>)
}