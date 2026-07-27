'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
import { SubdivisionService } from "@/shared/api/services/SubdivisionService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UnitService } from "@/shared/api/services/unitService";


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

    const [allPermissions, setAllPermissions] = useState<IGivedPermission[]>([]);
    const [permissions, setPermissions] = useState<IGivedPermission[]>([]);

    function UpdateSearch(prompt : string){
        let prepList : IListedInputItem[] = []
        prepList = availableHeadSubdivisions.filter(x=>!x.name?.toLowerCase().search(prompt.toLowerCase()))
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
            const newRank : ISubdivision = {
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
                const preparedRanks : IListedInputItem[] = [];
                subList.forEach(subdivision => {
                    preparedRanks.push({
                        name: subdivision.name,
                        id: subdivision.id
                    })
                });
                setAvailableHeadSubdivisions([...preparedRanks]);
                UpdateSearch("");
            });

            let unitDiscordId: string | null = null;
            const userRaw = localStorage.getItem("user");

            if (userRaw) {
                try {
                    const userObj = JSON.parse(userRaw);
                    unitDiscordId = userObj.discord_id || null;
                } 
                catch (err) {
                    console.error("Ошибка парсинга объекта user из localStorage:", err);
                }
            }

            if (!unitDiscordId) {
                console.error("Discord ID не найден в localStorage");
                return;
            }

            UnitService.getPermissions(unitDiscordId)
            .then((data: string[]) => {
                const formattedPermissions: IGivedPermission[] = data.map((permName, index) => ({
                    id: index.toString(),
                    permissionType: 1,
                    permission: {
                        name: permName,
                        permissionType: 1,
                        description: "",
                        givedPermissions: []
                    },
                    inherit: false,
                    entity: {}
                }));

                setAllPermissions(formattedPermissions);
            })
            .catch((err) => {
                console.error("Ошибка при загрузке разрешений:", err);
            });
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
                <ListedInputField list={headList} value={headPrompt} onChoice={(el)=>{setHeadPrompt(el.name);  setHeadId(el.id); UpdateSearch(headPrompt? headPrompt : "")}} onChange={(e)=>{setHeadPrompt(e.target.value); UpdateSearch(e.target.value)}} editable={true} editMode={true}></ListedInputField>
            </BaseContainer>
            <BaseContainer>
                <PermissionRollDownList givedPermissionList={permissions} allPermissionsList={allPermissions} onChange={(list)=>{setPermissions(list); console.warn(list)}} editable={true} editMode={true}></PermissionRollDownList>
            </BaseContainer>
        </CreationForm>
    </div>)
}