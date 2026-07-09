'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { SubdivisionService } from "@/shared/api/services/SubdivisionService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


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


export default function CreateSubdivPage(){
    const router = useRouter();
    const [subdivisionName, setSubdivisionName] = useState<string>("");
    const [subdivisionDescription, setSubdivisionDescription] = useState<string>("");
    const [appendHeadName, setAppendHeadName] = useState<boolean>(false);

    const [availableHeads, setAvailableHead] = useState<ISubdivision[]>([]);
    const [headId, setHeadId] = useState<string>();
    const [headPrompt, setHeadPrompt] = useState<string>();
    const [headList, setHeadList] = useState<IListedInputItem[]>([]);

    const [color, setColor] = useState<string>("#ffffff");


    const [availableHeadSubdivisions, setAvailableHeadSubdivisions] = useState<IListedInputItem[]>([]);


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
        let prepList : IListedInputItem[] = []
        prepList = availableHeadSubdivisions.filter(x=>!x.Name?.toLowerCase().search(prompt.toLowerCase()))
        setHeadList(prepList)
    }


    function sendForm(){
            let problems : string = "";
            if(subdivisionName.replace(' ', '').length == 0){
                problems += "Название звания\n";
            }
            if (problems){
                alert("Вы забыли указать:\n"+problems)
                return;
            }
            let newRank : ISubdivision = {
                description: subdivisionDescription,
                appendHeadName: appendHeadName,
                givedPermissions: permissions,
                color: color,
                name: subdivisionName
            }
            SubdivisionService.add({method: "POST", body:JSON.stringify(newRank)})
            .then(()=>{alert("Вы успешно создали подразделение");
                router.refresh();});
            
        }

    useEffect(()=>{
            SubdivisionService.getAll().then((subList) => {
                let preparedRanks : IListedInputItem[] = [];
                subList.forEach(subdivision => {
                    preparedRanks.push({
                        Name: subdivision.name,
                        Id: subdivision.id
                    })
                });
                setAvailableHeadSubdivisions([...preparedRanks]);
                UpdateSearch("");
            })
        },[])
    return(<div className="flex flex-col min-h-screen">
        <MainHeader></MainHeader>

        <CreationForm title="Создание подразделения" onClickSend={()=>{sendForm()}}>
            <BaseContainer className="flex-col">
                <ColorInputField watermark="Цвет" value={color} editMode={true} onChange={(e)=>{setColor(e.target.value)}} editable={true}></ColorInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <MultiroleInputField watermark="Название подразделения" value={subdivisionName} editMode={true} onChange={(e)=>{setSubdivisionName(e.target.value)}} editable={true}></MultiroleInputField>
                <DescriptionInputField watermark="Описание подразделения" value={subdivisionDescription} onChange={(e)=>{setSubdivisionDescription(e.target.value)}} editMode={true} editable={true}></DescriptionInputField>
            </BaseContainer>

            <BaseContainer>
                <ListedInputField list={headList} value={headPrompt} onChoice={(el)=>{setHeadPrompt(el.Name);  setHeadId(el.Id); UpdateSearch(headPrompt? headPrompt : "")}} onChange={(e)=>{setHeadPrompt(e.target.value); UpdateSearch(e.target.value)}} editable={true} editMode={true}></ListedInputField>
            </BaseContainer>
            <BaseContainer>
                <PermissionRollDownList givedPermissionList={permissions} allPermissionsList={mockG} onChange={(list)=>{setPermissions(list); console.warn(list)}} editable={true} editMode={true}></PermissionRollDownList>
            </BaseContainer>
        </CreationForm>
    </div>)
}