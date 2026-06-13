'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { RankService } from "@/shared/api/services/RankService";
import { error } from "console";
import { useEffect, useState } from "react";



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
    const [activityToPromotion, setActivityToPromotion] = useState<number>(1);

    const [headId, setHeadId] = useState<string>();
    const [headPrompt, setHeadPrompt] = useState<string>("");
    const [headList, setHeadList] = useState<IListedInputItem[]>([]);

    const [color, setColor] = useState<string>("#ffffff");


    const [availableHeadRanks, setAvailableHeadRanks] = useState<IListedInputItem[]>([]);



    let [permissions, setPermissions] = useState<IGivedPermission[]>([
        {
            id : '1',
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
        let prepList : IListedInputItem[] = []
        console.warn(prompt)
        prepList = availableHeadRanks.filter(x=>!x.Name?.toLowerCase().search(prompt.toLowerCase()))
        setHeadList(prepList)
    }


    function sendForm(){
        let problems : string = "";
        if(rankName.replace(' ', '').length == 0){
            problems += "Название звания\n";
        }
        if(headId == undefined){
            problems += "Вышестоящее звание\n";

        }
        if (problems){
            alert("Вы забыли указать:\n"+problems)
        }
        let newRank : IRank = {
            counterToReach : activityToPromotion,
            color : color,
            name : rankName,
            lowerId : headId,
            givedPermissions : permissions,

        }
        RankService.add({method: "POST", body:JSON.stringify(newRank)}).then(()=>{alert("Вы успешно создали звание");navigation.reload();});
        
    }
    useEffect(()=>{
        RankService.getAll().then((rankList) => {
            let preparedRanks : IListedInputItem[] = [];
            rankList.forEach(rank => {
                preparedRanks.push({
                    Name: rank.name,
                    Id: rank.id
                })
            });
            setAvailableHeadRanks([...preparedRanks]);
            UpdateSearch(headPrompt);
        })
    },[])

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
                <ListedInputField tooltip="Вышестоящее звание" list={headList} value={headPrompt} onChoice={(el)=>{setHeadPrompt(el.Name!); setHeadId(el.Id)}} onChange={(e)=>{setHeadPrompt(e.target.value); UpdateSearch(e.target.value)}} editable={true} editMode={true}></ListedInputField>
            </BaseContainer>
            <BaseContainer>
                <PermissionRollDownList givedPermissionList={permissions} allPermissionsList={mockG} onChange={(list)=>{setPermissions(list); console.warn(list)}} editable={true} editMode={true}></PermissionRollDownList>
            </BaseContainer>
        </CreationForm>
    </div>)
}