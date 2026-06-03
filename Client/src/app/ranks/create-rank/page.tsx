'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
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
    const [activityToPromotion, setActivityToPromotion] = useState<number>(1);

    const [availableHeads, setAvailableHead] = useState<IRank[]>([]);
    const [head, setHead] = useState<IRank>();
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
            problems += "Название звания\n";
        }
        if(head == undefined){
            problems += "Вышестоящее звание\n";

        }
        if (problems){
            alert("Вы забыли указать:\n"+problems)
        }
        let newRank : IRank = {
            CounterToReach : activityToPromotion,
            Color : color,
            Name : rankName,
            GivedPermissions : permissions,

        }
    }


    return(<div className="flex flex-col min-h-screen">
        <MainHeader></MainHeader>

        <CreationForm title="Создание звания" onClickSend={()=>{sendForm()}}>
            <BaseContainer className="flex-col">
                <ColorInputField watermark="Цвет" value={color} editMode={true} onChange={(e)=>{setColor(e.target.value)}} editable={true}></ColorInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <MultiroleInputField tooltip="Название звания" watermark="Название звания" value={rankName} editMode={true} onChange={(e)=>{setRankName(e.target.value)}} editable={true}></MultiroleInputField>
                <MultiroleInputField type="num" tooltip="Кол-во активности до повышения" watermark="Кол-во активности до повышения" value={activityToPromotion} editMode={true} onChange={(e)=>{setActivityToPromotion(Math.max(Math.abs(e.target.value as unknown as number),1))}} editable={true}></MultiroleInputField>
            </BaseContainer>

            <BaseContainer>
                <ListedInputField tooltip="Вышестоящее звание" list={headList} value={headPrompt} onChoice={(el)=>{setHeadPrompt(el.Name); setHead(availableHeads?.find(x=>x.Id == el.Id))}} onChange={(e)=>{setHeadPrompt(e.target.value); UpdateSearch(headPrompt? headPrompt : "")}} editable={true} editMode={true}></ListedInputField>
            </BaseContainer>
            <BaseContainer>
                <PermissionRollDownList givedPermissionList={permissions} allPermissionsList={mockG} onChange={(list)=>{setPermissions(list); console.warn(list)}} editable={true} editMode={true}></PermissionRollDownList>
            </BaseContainer>
        </CreationForm>
    </div>)
}