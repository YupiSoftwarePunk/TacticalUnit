'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { RewardService } from "@/shared/api/services/RewardService";
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
    const [rewardName, setRewardName] = useState<string>("");
    const [privileges, setPrivileges] = useState<string>("");
    const [conditions, setConditions] = useState<string>("");


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

    


    function sendForm(){
        let problems : string = "";
        if(rewardName.replace(' ', '').length == 0){
            problems += "Название награды\n";
        }
        if(privileges.replace(" ", "") == ""){
            problems += "Привилегии награды\n";
        }
        if(conditions.replace(" ", "") == ""){
            problems += "Условия получения награды\n";
        }
        if (problems){
            alert("Вы забыли указать:\n"+problems)
            return;
        }
        if (!validateColor(color)){
            alert("Цвет указан с ошибками, проверьте, что цвет начинается с \"#\" и содержит 6 символов после \"#\"");
            return
        }
        let newRank : IReward = {
            color: color,
            conditions: conditions,
            privileges: privileges,
            name: rewardName
        }
        
        RewardService.add(newRank)
        .then((createdReward) => {
            alert(`Награда "${createdReward.name}" успешно создана!`);
        })
        .catch((err) => {
            console.error("Ошибка при создании награды:", err);
            alert("Не удалось создать награду. Проверьте консоль или права доступа.");
        });
    }


    return(<div className="flex flex-col min-h-screen">
        <MainHeader></MainHeader>

        <CreationForm title="Создание награды" onClickSend={()=>{sendForm()}}>
            <BaseContainer className="flex-col">
                <ColorInputField watermark="Цвет" value={color} editMode={true} onChange={(e)=>{setColor(e.target.value)}} editable={true}></ColorInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <MultiroleInputField tooltip="Название награды" watermark="Название награды" value={rewardName} editMode={true} onChange={(e)=>{setRewardName(e.target.value)}} editable={true}></MultiroleInputField>
                <DescriptionInputField watermark="Привилегии награды" displayOnEmpty="[ Привилегии награды не заполнены ]" value={privileges} onChange={(e)=>{setPrivileges(e.target.value)}} editMode={true} editable={true}></DescriptionInputField>
                <DescriptionInputField watermark="Условия получения награды"  displayOnEmpty="[ Условия получения награды не заполнены ]" value={conditions} onChange={(e)=>{setConditions(e.target.value)}} editMode={true} editable={true}></DescriptionInputField>
            </BaseContainer>
        </CreationForm>
    </div>)
}