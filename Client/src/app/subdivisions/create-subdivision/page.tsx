'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/CreationForm.tsx/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
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
    const [subdivisionName, setSubdivisionName] = useState<string>("");
    const [subdivisionDescription, setSubdivisionDescription] = useState<string>("");

    const [head, setHead] = useState<ISubdivision>();
    const [headPrompt, setHeadPrompt] = useState<string>();
    const [headList, setHeadList] = useState<IListedInputItem[]>();

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


    return(<div className="flex flex-col min-h-screen">
        <MainHeader></MainHeader>

        <CreationForm title="Создание подразделения">
            <BaseContainer className="flex-col">
                <ColorInputField watermark="Цвет" value={color} editMode={true} onChange={(e)=>{setColor(e.target.value)}} editable={true}></ColorInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <MultiroleInputField watermark="Название подразделения" value={subdivisionName} editMode={true} onChange={(e)=>{setSubdivisionName(e.target.value)}} editable={true}></MultiroleInputField>
                <DescriptionInputField watermark="Описание подразделения" value={subdivisionDescription} onChange={(e)=>{setSubdivisionDescription(e.target.value)}} editMode={true} editable={true}></DescriptionInputField>
            </BaseContainer>

            <BaseContainer>
                <ListedInputField list={headList} value={headPrompt} onChoice={(el)=>{console.warn(el.Id)}} onChange={(e)=>{setHeadPrompt(e.target.value); UpdateSearch(headPrompt? headPrompt : "")}} editable={true} editMode={true}></ListedInputField>
            </BaseContainer>
            <BaseContainer>
                <PermissionRollDownList givedPermissionList={permissions} allPermissionsList={mockG} onChange={(list)=>{setPermissions(list); console.warn(list)}} editable={true} editMode={true}></PermissionRollDownList>
            </BaseContainer>
        </CreationForm>
    </div>)
}