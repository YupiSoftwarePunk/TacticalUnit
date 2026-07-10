'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, PermissionRollDownList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
import Tooltip from "@/components/ToolTip/ToolTip";
import { RankService } from "@/shared/api/services/RankService";
import { ImageService } from "@/shared/api/services/imageService";
import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { validateColor } from "@/typescript/colorValidator";

// необходимо вызвать ендпоинт с получением настоящих разрешений
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

export default function CreateRankPage(){
    const router = useRouter();
    const [rankName, setRankName] = useState<string>("");
    const [activityToPromotion, setActivityToPromotion] = useState<number>(1);

    const [headId, setHeadId] = useState<string>();
    const [headPrompt, setHeadPrompt] = useState<string>("");
    const [headList, setHeadList] = useState<IListedInputItem[]>([]);

    const [color, setColor] = useState<string>("#ffffff");
    const [availableHeadRanks, setAvailableHeadRanks] = useState<IListedInputItem[]>([]);

    const [permissions, setPermissions] = useState<IGivedPermission[]>([
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

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveFile = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    function UpdateSearch(prompt : string){
        let prepList : IListedInputItem[] = []
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
            alert("Вы забыли указать:\n"+problems);
            return;
        }
        if (!validateColor(color)){
            alert("Цвет указан с ошибками, проверьте, что цвет начинается с \"#\" and содержит 6 символов после \"#\"");
            return;
        }

        const newRank : IRank = {
            counterToReach : activityToPromotion,
            color : color,
            name : rankName,
            lowerId : headId ? parseInt(headId, 10) : undefined,
            givedPermissions : permissions,
        }

        RankService.add({ method: "POST", body: JSON.stringify(newRank) })
        .then(async (createdRank: IRank[]) => { 
            console.log("Ответ сервера при создании звания:", createdRank); null;
            const newrank = createdRank && createdRank.length > 0 ? createdRank[0] : null;
            const targetId = newrank?.id;
            console.log("Проверка перед отправкой фото:", { imageFile, targetId });

            if (imageFile && targetId) {
                const formData = new FormData();
                formData.append("file", imageFile); 

                try {
                    await ImageService.uploadRank(targetId, {
                        method: "POST",
                        body: formData,
                    });
                    alert("Вы успешно создали звание и загрузили шеврон!");
                } 
                catch (imgErr) {
                    console.error("Ошибка при загрузке картинки звания:", imgErr);
                    alert("Звание успешно сохранено, но не удалось загрузить картинку.");
                }
            } 
            else {
                if (!targetId) {
                    console.warn("Не удалось определить ID созданного звания из ответа сервера.");
                }
                alert("Вы успешно создали звание (будет использовано изображение по умолчанию)");
            }
            
            resetForm();
            router.refresh();
        })
        .catch((err) => {
            console.error("Ошибка при создании звания:", err);
            alert("Не удалось создать звание.");
        });
    }

    const resetForm = () => {
        setRankName("");
        setActivityToPromotion(1);
        setHeadId(undefined);
        setHeadPrompt("");
        setColor("#ffffff");
        handleRemoveFile();
    };

    useEffect(()=>{
        RankService.getAll().then((rankList) => {
            const preparedRanks : IListedInputItem[] = [];
            rankList.forEach(rank => {
                preparedRanks.push({
                    Name: rank.name,
                    Id: rank.id?.toString()
                })
            });
            setAvailableHeadRanks([...preparedRanks]);
            setHeadList(preparedRanks);
        })
    },[])

    return (
        <div className="flex flex-col min-h-screen">
            <MainHeader></MainHeader>
            <CreationForm title="Создание звания" onClickSend={() => { sendForm() }}>
                <div className="flex flex-col md:flex-row flex-1 gap-6 md:gap-3 w-full">
                    <Tooltip tooltipText="Картинка звания" className="flex w-full md:flex-1 max-w-full md:max-w-50" innerClassName="flex w-full">
                        <div className="flex flex-col flex-1 h-full w-full">
                            <div className="relative bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center group min-h-[160px] w-full transition-all">
                                
                                {imagePreview ? (
                                    <>
                                        <img 
                                            src={imagePreview} 
                                            alt="Rank Preview" 
                                            className="flex self-start object-top object-contain overflow-hidden w-full max-h-100"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={handleRemoveFile}
                                            className="absolute bottom-2 right-2 p-1.5 bg-black/10 dark:bg-black/50 hover:bg-red-600 opacity-60 hover:opacity-100 transition-all border border-black/20 dark:border-white/10 text-white text-[10px] font-text-bold uppercase tracking-wider px-2"
                                        >
                                            Удалить
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4 text-center group hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[160px]">
                                        <span className="text-[11px] font-text-bold text-accent uppercase tracking-widest border-b border-accent group-hover:text-text-primary group-hover:border-text-primary transition-colors">
                                            Выбрать файл
                                        </span>
                                        <span className="text-[9px] text-text-primary/40 mt-1.5 uppercase tracking-wider">
                                            PNG, JPG, WEBP
                                        </span>
                                        <input 
                                            type="file" 
                                            accept="image/png, image/jpeg, image/jpg, image/webp" 
                                            className="hidden" 
                                            onChange={handleFileChange} 
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </Tooltip>
                    <div className="flex flex-col flex-4 gap-3 w-full">

                        <BaseContainer>
                            <ColorInputField 
                                watermark="Цвет" 
                                value={color} 
                                editMode={true} 
                                onChange={(e) => { setColor(e.target.value) }} 
                                editable={true}
                            />
                        </BaseContainer>

                        <BaseContainer className="flex-col">
                            <MultiroleInputField 
                                tooltip="Название звания" 
                                watermark="Название звания" 
                                value={rankName} 
                                editMode={true} 
                                onChange={(e) => { setRankName(e.target.value) }} 
                                editable={true}
                            />
                            <MultiroleInputField 
                                type="num" 
                                tooltip="Кол-во активности до повышения" 
                                watermark="Кол-во активности до повышения" 
                                value={activityToPromotion} 
                                editMode={true} 
                                onChange={(e) => { setActivityToPromotion(Math.max(Math.abs(e.target.value as unknown as number), 1)) }} 
                                editable={true}
                            />
                        </BaseContainer>

                        <BaseContainer>
                            <ListedInputField 
                                tooltip="Вышестоящее звание" 
                                list={headList} 
                                value={headPrompt} 
                                onChoice={(el) => { setHeadPrompt(el.Name!); setHeadId(el.Id) }} 
                                onChange={(e) => { setHeadPrompt(e.target.value); UpdateSearch(e.target.value) }} 
                                editable={true} 
                                editMode={true}
                            />
                        </BaseContainer>

                        <BaseContainer>
                            <PermissionRollDownList 
                                givedPermissionList={permissions} 
                                allPermissionsList={mockG} 
                                onChange={(list) => { setPermissions(list); console.warn(list) }} 
                                editable={true} 
                                editMode={true}
                            />
                        </BaseContainer>
                        
                    </div>
                </div>
            </CreationForm>
        </div>
    )
}