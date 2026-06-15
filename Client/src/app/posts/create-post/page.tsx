'use client';
import { BaseContainer, CheckButton, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { PostService } from "@/shared/api/services/postService";
import { RankService } from "@/shared/api/services/RankService";
import { validateColor } from "@/typescript/colorValidator";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
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
    const [description, setDescription] = useState<string>("");

    const [availableRanks, setAvailableRanks] = useState<IRank[]>([]);
    const [headPostId, setHeadPostId] = useState<string>();
    const [maxRankId, setMaxRankId] = useState<string>();
    const [headPrompt, setHeadPrompt] = useState<string>();
    const [headList, setHeadList] = useState<IListedInputItem[]>([]);
    const [color, setColor] = useState<string>("#ffffff");
    const [appendSubdivisionName, setAppendSubdivisionName] = useState<boolean>(false)
    const [availableHeadPosts, setAvailableHeadPosts] = useState<IListedInputItem[]>([])

    const router = useRouter();

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

    function UpdateSearch(prompt : string, list : IListedInputItem[] = headList){
        let prepList : IListedInputItem[] = []
        prepList = availableHeadPosts.filter(x=>!x.Name?.toLowerCase().search(prompt.toLowerCase()))
        setHeadList(prepList)
    }


    function sendForm(){
        let problems : string = "";
        if(rankName.replace(' ', '').length == 0){
            problems += "Название должности\n";
        }
        // if(maxRankId == undefined){
        //     problems += "Высшее звание\n";
        // }
        if (problems){
            alert("Вы забыли указать:\n"+problems)
            return;
        }
        if (!validateColor(color)){
            alert("Цвет указан с ошибками, проверьте, что цвет начинается с \"#\" и содержит 6 символов после \"#\"");
            return
        }
        const postDto = {
            name: rankName,
            description: description,
            subdivisionId: null,
            headId: headPostId ? parseInt(headPostId, 10) : 0,
            maxRankId: maxRankId ? parseInt(maxRankId, 10) : 19,
            color: color,
            appendSubdivisionName: appendSubdivisionName,
            permissionsId: permissions.map(p => parseInt(p.id || '0', 10)) 
        };
        PostService.add({ 
            method: "POST", 
            body: JSON.stringify(postDto) 
        })
        .then(() => {
            alert("Вы успешно создали должность");
            router.refresh();
        })
        .catch((error) => {
            console.error("Ошибка при создании должности:", error);
        });
    }
    useEffect(()=>{
            PostService.getAll().then((postList) => {
                let preparedPosts : IListedInputItem[] = [];
                postList.forEach(post => {
                    preparedPosts.push({
                        Name: post.name,
                        Id: post.id
                    })
                });
                setAvailableHeadPosts([...preparedPosts]);
                UpdateSearch("", preparedPosts);
            })
        },[])

    return(<div className="flex flex-col min-h-screen">
        <MainHeader></MainHeader>

        <CreationForm title="Создание должности" onClickSend={()=>{sendForm()}}>
            <BaseContainer className="flex-col">
                <ColorInputField watermark="Цвет" value={color} editMode={true} onChange={(e)=>{setColor(e.target.value)}} editable={true}></ColorInputField>
            </BaseContainer>
            <BaseContainer className="flex-col">
                <MultiroleInputField tooltip="Название должности" watermark="Название должности" value={rankName} editMode={true} onChange={(e)=>{setRankName(e.target.value)}} editable={true}></MultiroleInputField>
                <CheckButton title="Дополнять названием подразделения" value={appendSubdivisionName} onClick={(e)=>{setAppendSubdivisionName(!appendSubdivisionName)}}></CheckButton>
                <DescriptionInputField watermark="Описание должности" value={description} onChange={(e)=>{setDescription(e.target.value)}} editMode={true} editable={true}></DescriptionInputField>
            </BaseContainer>

            <BaseContainer>
                <ListedInputField tooltip="Вышестоящая должность" list={headList} value={headPrompt} onChoice={(el)=>{setHeadPrompt(el.Name); setHeadPostId(el.Id)}} onChange={(e)=>{setHeadPrompt(e.target.value); UpdateSearch(e.target.value)}} editable={true} editMode={true}></ListedInputField>
            </BaseContainer>
            <BaseContainer>
                <PermissionRollDownList givedPermissionList={permissions} allPermissionsList={mockG} onChange={(list)=>{setPermissions(list); console.warn(list)}} editable={true} editMode={true}></PermissionRollDownList>
            </BaseContainer>
        </CreationForm>
    </div>)
}