'use client';

import React, { useState, useRef, useEffect, Suspense } from "react";
import { MainHeader } from "@/components/Header/MainHeader";
import { Upload, FileText, CheckCircle2, AlertTriangle, Check } from "lucide-react";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { UnitService } from "@/shared/api/services/unitService";
import { BaseContainer, CheckButton, DescriptionInputField, IListedInputItem, ListedInputField, MultiroleInputField, SelectionList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { useSearchParams } from "next/navigation";
import { RewardService } from "@/shared/api/services/RewardService";
import { PostService } from "@/shared/api/services/postService";
import { RankService } from "@/shared/api/services/RankService";
import axios from "axios";
import Tooltip from "@/components/ToolTip/ToolTip";

interface IUnitCompressed {
    discordId: string;
    nickname: string;
    steamId?: string;
    favoriteKit: IfavoriteKit;
    backgroundPicture: IBackgroundPicture;
    rankUpCounter?: string | number;
    joined?: string;
    rankId?: number;
    postsIds?: number[];
    assignedRewardsIds?: number[];
    gender?: number;
    rankIndex?: number;
    postIndex?: number;
    weekActivityCount?: number;
    monthActivityCount?: number;
    yearActivityCount?: number;
    totalActivityCount?: number;
}


const ACT_TYPES_INFO = new Map<string, { title: string; description: string }>([
    ["rewards", { 
        title: "Акт награждения", 
        description: "Выбранным бойцам будут вручены выбранные награды." 
    }],
    ["posts", { 
        title: "Акт назначения на должность(-и)", 
        description: "Выбранные бойцы будут назначены на выбранные должности. Опционально, они могут быть сняты с предыдущих должностей, за исключением тех, что отсутствуют в списке доступных к выбору. К выбору доступны все должности, не являющиеся для Вас вышестоящими. К выбору доступны все бойцы из актуального состава клана. Попытка снять с бойца все должности будет проигнорирована." 
    }],
    ["ranks", { 
        title: "Акт присвоения звания", 
        description: "Выбранным бойцам будет присвоено выбранное звание вне зависимости от их предыдущего звания. К выбору доступны все существующие в клане звания. К выбору доступны все бойцы из актуального состава клана." 
    }],
    ["rank-altering", { 
        title: "Акт повышения/понижения в звании", 
        description: "Выбранные бойцы будут повышены или понижены на количество указанных ступеней. «1» ступень будет означать «очередное» повышение, а «2» и больше – внеочередное. К выбору доступны все бойцы из актуального состава клана. Попытка понижения ниже минимального звания будет проигнорирована. Попытка повышения выше максимального существующего звания или максимально доступного по должности будет проигнорирована. Последнее ограничение может быть проигнорировано включением соответствующей опции." 
    }],
    ["sanctions", { 
        title: "Акт выдачи благодарностей/выговоров", 
        description: "Выбранным бойцам будет прибавлен выбранный статус. При установлении нового статуса будет арифметически учитываться текущий активный статус. То есть благодарность повышает, а выговор снижает текущий статус на 1 ступень. Строгий выговор понижает на 2 ступени." 
    }],
    ["resignation", { 
        title: "Акт оформления отставки", 
        description: "Выбранные бойцы будут сняты со всех должностей и лишены званий. В профиле будет отображаться статус отставки." 
    }],
    ["dismissal", { 
        title: "Акт увольнения", 
        description: "Выбранные бойцы будут сняты со всех должностей и лишены званий." 
    }],
    ["returnal", { 
        title: "Акт возвращения в состав", 
        description: "Выбранным бойцам будет присвоено выбранное звание. Они будут назначены на выбранные должности. Статус отставки, при наличии, будет терминирован." 
    }],
]);

function UploadDocumentContent() {
    const searchParameters = useSearchParams()
    const actType = searchParameters?.get('type') // Types possible: "rewards" | "posts" | "ranks" | "rank-altering" | "sanctions" | "resignation" | "dismissal" | "returnal"

    const actTypesInfo = new Map<string, {title : string, description : string}>();
    
    const [today, setToday] = useState<Date>(new Date());
    const [dateInAWeek, setDateInAWeek] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), today.getDate()+7));
    const [selectedDate, setSelectedDate] = useState<string>(
                    `
                        ${dateInAWeek.getFullYear()}-
                        ${(dateInAWeek.getMonth() + 1).toString().length > 1? ((dateInAWeek.getMonth() + 1).toString()) : `0${((dateInAWeek.getMonth() + 1).toString())}`}-
                        ${dateInAWeek.getDate().toString().length > 1? (dateInAWeek.getDate().toString()) : `0${(dateInAWeek.getDate().toString())}`}
                    `.replaceAll(" ", "").replaceAll("\n", "")
    );


    const [selectedRankId, setSelectedRankId] = useState<string>();
    const [RankPrompt, setRankPrompt] = useState<string>();

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    
    useEffect(()=>{
        if (!actType) return;

        const info = ACT_TYPES_INFO.get(actType);
        if (info) {
            setTitle(info.title);
            setDescription(info.description);
        }
    }, [actType]);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    interface IFormattedUnit {
    discordId: string;
    nickname: string;
    rank: string;
    posts: string;
    }

    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [units, setUnits] = useState<IFormattedUnit[]>([]);

    // const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
    const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
    const [typeOfDocument, setTypeOfDocument] = useState<"selection" | "new" | "existing" | "empty">("selection");
    const [documentsAtDisposal, setDocumentsAtDisposal] = useState<IListedInputItem[]>([]);
    const [documentPrompt, setDocumentPrompt] = useState<string>("")
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>()

    const [removePreviousPosts, setRemovePreviousPosts] = useState(false);

    const [multiroleList, setMultiroleList] = useState<IListedInputItem[]>([]);
    const [multiroleList2, setMultiroleList2] = useState<IListedInputItem[]>([]);
    
    const [foundRanks, setFoundRanks] = useState<IListedInputItem[]>([]);
    

    function findRanks(prompt : string, list : IListedInputItem[]){
        let ranks = [];
        ranks = list.filter(x=>!x.name?.toLowerCase().search(prompt.toLowerCase()))
        if (ranks.length == 0) ranks = list.filter(x=>!x.id?.toLowerCase().search(prompt.toLowerCase()))
        setFoundRanks(ranks)
    }

    const [rankTweaking, setRankTweaking] = useState<IListedInputItem[]>([
        {
            name: "Повышению",
            id: "0",
            selected: true
        },
        {
            name: "Понижению",
            id: "1",
            selected: false
        }
    ]);
    const [amountOfSteps, setAmountOfSteps] = useState<number>(1);
    const [ignorePostMaxRank, setIgnorePostMaxRank] = useState<boolean>(false);


    const [sanctions, setSanctions] = useState<IListedInputItem[]>([
        {
            name: "Благодарность",
            id: "0",
            selected: false
        },
        {
            name: "Без статуса",
            id: "1",
            selected: false
        },
        {
            name: "Выговор",
            id: "2",
            selected: false
        },
        {
            name: "Строгий выговор",
            id: "3",
            selected: false
        },
    ]);
    const [overridePrevStatus, setOverridePrevStatus] = useState<boolean>(false);
    
    
    useEffect(()=>{
        // Recieving data about currently available acts from the server [endpoints are not ready yet. Wait until better times.]
    }, [])

    useEffect(()=>{
        if(actType == "rewards"){
            RewardService.getAll().then((rds)=>{
                const preparedList : IListedInputItem[] = [];
                rds.forEach(el => {
                    preparedList.push(
                        {
                            name : el.name,
                            description : el.privileges,
                            id : el.id,
                            selected : false
                        }
                    )
                });
                setMultiroleList(preparedList);
            })
        }
        else if(actType == "posts"){
            PostService.getAll().then((pst)=>{
                const preparedList : IListedInputItem[] = [];
                pst.forEach(el => {
                    preparedList.push(
                        {
                            name : el.fullname,
                            description : el.description,
                            id : `${el.id}`,
                            selected : false
                        }
                    )
                });
                setMultiroleList(preparedList);
            })
        }
        else if(actType == "ranks"){
            RankService.getAll().then((rnk)=>{
                const preparedList : IListedInputItem[] = [];
                rnk.forEach(el => {
                    preparedList.push(
                        {
                            name : el.name,
                            id : `${el.id}`,
                            selected : false
                        }
                    )
                });
                setMultiroleList(preparedList);
            })
        }
        else if(actType == "resignation"){
            UnitService.getAll().then((u)=>{
                const preparedList : IListedInputItem[] = [];
                u.forEach(el => {
                    preparedList.push(
                        {
                            name : el.nickname,
                            id : `${el.discordId}`,
                            selected : false
                        }
                    )
                });
                setMultiroleList(preparedList);
            })
        }
        else if(actType == "dismissal"){
            UnitService.getAll().then((u)=>{
                const preparedList : IListedInputItem[] = [];
                u.forEach(el => {
                    preparedList.push(
                        {
                            name : el.nickname,
                            id : `${el.discordId}`,
                            selected : false
                        }
                    )
                });
                setMultiroleList(preparedList);
            })
        }
        else if(actType == "returnal"){
            PostService.getAll().then((pst)=>{
                const preparedList : IListedInputItem[] = [];
                pst.forEach(el => {
                    preparedList.push(
                        {
                            name : el.fullname,
                            description : el.description,
                            id : `${el.id}`,
                            selected : false
                        }
                    )
                });
                setMultiroleList(preparedList);
            })
            RankService.getAll().then((rnk)=>{
                const preparedList : IListedInputItem[] = [];
                rnk.forEach(el => {
                    preparedList.push(
                        {
                            name : el.name,
                            id : `${el.id}`,
                            selected : false
                        }
                    )
                });
                setMultiroleList2(preparedList);
            })
        }
    }, [])


    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // if (!documentName) {
            //     const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            //     setDocumentName(nameWithoutExt);
            // }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            // if (!documentName) {
            //     const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            //     setDocumentName(nameWithoutExt);
            // }
        }
    };

    const handleSaveDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            setStatus({ type: 'error', message: 'Выберите файл' });
            return;
        }

        setIsLoading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append("file", selectedFile);
        // formData.append("name", documentName.trim());

        try {
            // обращение к ендпоинту
            setStatus({ type: 'success', message: 'Документ успешно загружен в базу данных' });
            // setDocumentName("");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } 
        catch (err) {
            console.error("Ошибка при отправке документа:", err);
            setStatus({ type: 'error', message: 'Не удалось отправить документ' });
        } 
        finally {
            setIsLoading(false);
        }
    };


    const tableColumns: ColumnConfig[] = [
        {
            key: "selection",
            label: "Выбор",
            sortable: false,
            filterable: false,
            className: "w-12",
            render: (_, item: IFormattedUnit) => (
                <button
                    onClick={() => toggleUnitSelection(item.discordId)}
                    className="flex items-center justify-center w-6 h-6 border border-border-secondary bg-bg-dark hover:bg-bg-accent hover:text-text-primary-accent transition-colors"
                >
                    {selectedUnits.has(item.discordId) && (
                        <Check className="w-4 h-4" />
                    )}
                </button>
            )
        },
        { key: "nickname", label: "Никнейм", sortable: false, filterable: true },
        { 
            key: "rank", 
            label: "Текущее звание", 
            sortable: true, 
            filterable: true
        },
        { 
            key: "posts", 
            label: "Должность", 
            sortable: false, 
            filterable: true
        },
    ];

    const handleExport = (data: IFormattedUnit[]) => {
        console.log("Экспорт данных:", data);
    };

    useEffect(() => {
        Promise.all([
            UnitService.getAll(),
            RankService.getAll(),
            PostService.getAll()
        ]).then(([unitsData, ranksData, postsData]) => {
            const formattedUnits: IFormattedUnit[] = unitsData.map((unit: IUnitCompressed) => {
                const rObj = ranksData.find(r => r.id?.toString() === unit.rankId?.toString());
                const uPosts = (unit.postsIds || [])
                    .map(pId => postsData.find(p => p.id?.toString() === pId?.toString())?.name)
                    .filter((name): name is string => Boolean(name));

                return {
                    discordId: String(unit.discordId),
                    nickname: unit.nickname || "Без ника",
                    rank: rObj ? rObj.name : "Без звания",
                    posts: uPosts.length > 0 ? uPosts.join(", ") : "Нет должности"
                };
            });
            setUnits(formattedUnits);
        });
    }, []);
    const toggleUnitSelection = (discordId: string) => {
        const newSelected = new Set(selectedUnits);
        if (newSelected.has(discordId)) {
            newSelected.delete(discordId);
        } 
        else {
            newSelected.add(discordId);
        }
        setSelectedUnits(newSelected);
    };


    function sendAct(){
        console.log("attempting...");
        if(actType == "rewards"){
            if(multiroleList.find(x=>x.selected == true) != undefined && [...selectedUnits].length > 0){
                let chosenRewards = multiroleList.filter(x=>!x.selected)!.map(x=>x.id)
                if (chosenRewards.length > 0){

                    let act : IRewardAssignAct = {
                        DocId: selectedDocumentId,
                        UnitIds: [...selectedUnits],
                        RewardIds: chosenRewards as string[]
                    }
                    RewardService.AssignRewards(act).then((r)=>{
                        alert("Операция прошла успешно!")
                    }).catch((e)=>{
                        alert(`Возникла ошибка при обработке запроса: ${e}`)
                    })
                }
            }else{
                alert("Некоторые поля не были заполнены!")
            }
        }
        else if(actType == "posts"){
            if(multiroleList.find(x=>x.selected == true) != undefined && [...selectedUnits].length > 0){
                let chosenPosts = multiroleList.filter(x=>!x.selected)!.map(x=>x.id)
                if (chosenPosts.length > 0){

                    let act : IPostAssignAct = {
                        DocId: selectedDocumentId,
                        UnitIds: [...selectedUnits],
                        PostIds: chosenPosts as string[],
                        Overwrite: removePreviousPosts
                    }
                    PostService.AssignPosts(act).then((r)=>{
                        alert("Операция прошла успешно!")
                    }).catch((e)=>{
                        alert(`Возникла ошибка при обработке запроса: ${e}`)
                    })
                }
            }else{
                alert("Некоторые поля не были заполнены!")
            }
        }
        else if(actType == "ranks"){
            if(multiroleList.find(x=>x.selected == true) != undefined && selectedRankId && [...selectedUnits].length > 0){
                let chosenRanks = multiroleList.filter(x=>!x.selected)!.map(x=>x.id)
                if (chosenRanks.length > 0){

                    let act : IRankAssignAct = {
                        DocId: selectedDocumentId,
                        UnitIds: [...selectedUnits],
                        RankId: selectedRankId
                    }
                    RankService.AssignRanks(act).then((r)=>{
                        alert("Операция прошла успешно!")
                    }).catch((e)=>{
                        alert(`Возникла ошибка при обработке запроса: ${e}`)
                    })
                }
            }else{
                alert("Некоторые поля не были заполнены!")
            }
        }
        else if(actType == "rank-altering"){
            if(multiroleList.find(x=>x.selected == true) != undefined && [...selectedUnits].length > 0){
                let chosenRanks = multiroleList.filter(x=>!x.selected)!.map(x=>x.id)
                if (chosenRanks.length > 0){

                    let act : IRankChangeAct = {
                        DocId: selectedDocumentId,
                        UnitIds: [...selectedUnits],
                        Steps: amountOfSteps,
                        IgnorePostMaxRank: ignorePostMaxRank,
                        IsDowngrade: rankTweaking.find(x=>x.selected)?.id == "1"
                    }
                    RankService.AlterRanks(act).then((r)=>{
                        alert("Операция прошла успешно!")
                    }).catch((e)=>{
                        alert(`Возникла ошибка при обработке запроса: ${e}`)
                    })
                }
            }else{
                alert("Некоторые поля не были заполнены!")
            }
        }
        else if(actType == "sanctions"){
            
            
            if([...selectedUnits].length > 0){

                    let chosenSanction = sanctions.find(x=>x.selected)
                    if (chosenSanction == undefined){
                        alert("Вы не выбрали тип статуса")
                        return
                    }
                    let act : IStatusAssignAct = {
                        DocId: selectedDocumentId,
                        UnitIds: [...selectedUnits],
                        StatusKey: chosenSanction?.id!,
                        Overwrite: overridePrevStatus,
                        End: `${selectedDate}`,
                        Days: 777
                    }
                    UnitService.AssignStatus(act).then((r)=>{
                        alert("Операция прошла успешно!")
                    }).catch((e)=>{
                        alert(`Возникла ошибка при обработке запроса: ${e}`)
                    })
            }else{
                alert("Некоторые поля не были заполнены!")
            }
        }
        else if(actType == "resignation"){
            if([...selectedUnits].length > 0){

                    let chosenUsers = sanctions.find(x=>x.selected)
                    if (chosenUsers == undefined){
                        alert("Вы не выбрали ни одного пользователя")
                        return
                    }
                    let act : IBaseAct = {
                        DocId: selectedDocumentId,
                        UnitIds: [...selectedUnits]
                    }
                    UnitService.Resignation(act).then((r)=>{
                        alert("Операция прошла успешно!")
                    }).catch((e)=>{
                        alert(`Возникла ошибка при обработке запроса: ${e}`)
                    })
                }
        }
        else if(actType == "dismissal"){}
        else if(actType == "returnal"){}
        else{
            console.log("no matching types of act");

        }
        // "rewards" | "posts" | "ranks" | "rank-altering" | "sanctions" | "resignation" | "dismissal" | "returnal"
    }




    return (
        <div className="w-full min-h-screen bg-bg-primary transition-colors duration-300 font-text pb-20 flex flex-col overflow-x-hidden text-text-primary">
            <MainHeader />

            <main className="flex flex-col max-w-[1400px] w-full mx-auto pt-20 md:pt-28 px-4 md:px-6 flex-shrink-0 transition-all gap-5">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-4xl font-header text-text-primary uppercase tracking-wider">
                        Оформление актов
                    </h1>
                    <span className="block w-12 h-0.5 bg-accent mt-1.5"></span>
                </div>
                <div className={`col-span-3 bg-bg-secondary border border-border-secondary p-4 md:p-6 shadow-sm flex flex-col gap-5 transition-colors duration-300 h-full justify-between`}>
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary">
                                            Название акта
                                        </label>
                                        <h2 className="w-full text-xl p-2 text-text-primary focus:border-accent outline-none rounded-none h-[38px] transition-colors font-text placeholder:text-text-secondary/40">
                                            {title}
                                        </h2>
                                        <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary mt-3">
                                            Описание вида акта
                                        </label>
                                        <DescriptionInputField className="" value={description} ></DescriptionInputField>
                                    </div>

                                    {status && (
                                        <div className={`p-3 border flex items-start gap-2 animate-in fade-in duration-200 ${
                                            status.type === 'success' 
                                                ? 'bg-bg-primary border-green-600/50 text-text-primary' 
                                                : 'bg-bg-primary border-red-500/50 text-text-primary'
                                        }`}>
                                            {status.type === 'success' ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            )}
                                            <span className="text-xs font-text leading-tight">{status.message}</span>
                                        </div>
                                    )}
                                </div>

                                {/* <div className="pt-4 mt-auto">
                                    <button
                                        type="submit"
                                        disabled={isLoading || !selectedFile}
                                        className="relative group inline-block disabled:opacity-50 disabled:pointer-events-none w-full"
                                    >
                                        <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                                        <div className="relative border border-border-secondary bg-bg-secondary px-6 py-2.5 text-xs font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black cursor-pointer text-center">
                                            {isLoading ? "Сохранение..." : "Сохранить"}
                                        </div>
                                    </button>
                                </div> */}
                </div>
                <div className="flex flex-col">
                    <div className="flex">
                        <h2 className="text-2xl px-2 font-text border border-border-secondary border-b-0">Документ</h2>
                        <div className="flex flex-1 border-b border-border-secondary"></div>
                    </div>

                {typeOfDocument == "selection" &&
                                <div className="flex flex-col  min-h-[300px] lg:min-h-[400px] border border-t-0 border-border-secondary items-center w-full justify-center content-center gap-5">
                                    <div className="gap-4 flex flex-col">
                                        <button onClick={()=>{setTypeOfDocument("existing")}} className="bg-bg-secondary border border-border-secondary p-6 px-10 text-xl transition-all hover:border-accent hover:bg-bg-accent">Выбрать существующий</button>
                                        <button onClick={()=>{setTypeOfDocument("new")}} className="bg-bg-secondary border border-border-secondary p-6 px-10 text-xl transition-all hover:border-accent hover:bg-bg-accent">Добавить новый</button>
                                        <button onClick={()=>{setTypeOfDocument("empty")}} className=" px-10 text-lg text-text-secondary hover:text-text-primary-accent transition-all">Без документа</button>

                                    </div>
                                </div>
                }
                
                {typeOfDocument != "selection" 
                &&
                <div className="flex flex-col w-full border border-t-0 border-border-secondary">
                    <button onClick={()=>{setTypeOfDocument("selection")}} className="h-[50px] hover:bg-bg-accent border border-transparent hover:border-accent transition-all">Назад</button>

                    
                    {(typeOfDocument == "new" || typeOfDocument == "empty") &&
                        <form onSubmit={handleSaveDocument} className={`grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start`}>
                            
                            
                            {typeOfDocument == "new" && 
                            <div className="lg:col-span-3 max-lg:col-span-3 h-full text-text-primary">
                                <div className="flex w-full  border-border-secondary">
                                    
                                    <div className="flex flex-col w-full">
                                        
                                        <div
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`w-full min-h-[250px] lg:min-h-[350px] border-2 border-dashed bg-bg-secondary/40 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 group ${
                                                selectedFile 
                                                    ? 'border-accent bg-bg-secondary/70' 
                                                    : 'border-border-secondary/30 hover:border-accent hover:bg-bg-secondary/50'
                                            }`}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                                disabled={isLoading}
                                            />

                                            {selectedFile ? (
                                                <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
                                                    <div className="p-4 bg-bg-secondary border border-accent/40 shadow-sm relative">
                                                        <FileText className="w-10 h-10 text-accent" />
                                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 max-w-md">
                                                        <p className="text-sm font-text-bold text-text-primary break-all px-2">
                                                            {selectedFile.name}
                                                        </p>
                                                        <p className="text-xs text-text-secondary/60">
                                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                    <p className="text-[11px] text-accent font-text uppercase tracking-wider mt-2 group-hover:underline">
                                                        Нажмите, чтобы заменить файл
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 select-none">
                                                    <Upload className="w-8 h-8 text-text-secondary/40 group-hover:text-accent transition-colors duration-300" />
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-xs font-text-bold text-text-secondary uppercase tracking-widest">
                                                            Перетащите файл сюда или нажмите для выбора
                                                        </p>
                                                        <p className="text-[11px] text-text-secondary/50 font-text italic">
                                                            Поддерживаются любые официальные форматы документов
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                    </div>
                                    
                                    
                                </div>
                            </div>
                            }   
                            
                            
                        </form>
                    }
                    {typeOfDocument == "existing" &&
                        <div className="flex">
                            <BaseContainer className="flex flex-col">
                                <ListedInputField list={documentsAtDisposal} textWhenEmpty="[ Введите название документа ]" editable={true} editMode={true} value={documentPrompt} onChoice={(item)=>{setSelectedDocumentId(item.id!)}} onChange={(e)=>{setDocumentPrompt(e.target.value)}}></ListedInputField>
                                {!selectedDocumentId && <h2 className="text-lg">Выберите документ</h2> }
                            </BaseContainer>
                        </div>
                    }
                </div>
                
                }
                </div>

                {actType == "rewards" && <SelectionList className="min-h-10" title="Выберите награды из списка" onSelection={(items)=>{setMultiroleList([...items])}} searchField list={multiroleList}></SelectionList>}
                {actType == "posts" && 
                <div className="flex flex-col">
                    <BaseContainer className="flex">
                        <CheckButton className="text-xl flex-1 text-text-primary" title="Снять с других должностей" value={removePreviousPosts} onClick={()=>{setRemovePreviousPosts(!removePreviousPosts)}}></CheckButton>
                    </BaseContainer>
                    <SelectionList className="min-h-10" title="Выберите должности из списка" onSelection={(items)=>{setMultiroleList([...items])}} searchField list={multiroleList}></SelectionList>
                </div>
                }
                {actType == "ranks" && 
                <BaseContainer className="flex-col">
                    <p className="text-text-secondary">Выберите звание из списка</p>
                    <ListedInputField value={RankPrompt} list={foundRanks} onChange={(e)=>{setRankPrompt(e.target.value); findRanks(e.target.value, multiroleList)}} onChoice={(i)=>{setSelectedRankId(i.id); setRankPrompt(i.name)}} editMode editable></ListedInputField>
                </BaseContainer>
                // <SelectionList className="min-h-10" title="Выберите звание из списка" onSelection={(items)=>{setMultiroleList([...items])}} maxSelectedItems={1} searchField list={multiroleList}></SelectionList>
                }
                {actType == "rank-altering" && 
                <div className="flex flex-col">
                <SelectionList className="min-h-10" title="Количество ступеней к" onSelection={(items)=>{setRankTweaking([...items])}} maxSelectedItems={1} radiobutton list={rankTweaking}></SelectionList>
                <BaseContainer className="flex-col">
                    <p>Кол-во ступеней:</p>
                    <MultiroleInputField value={amountOfSteps} onChange={(e)=>{setAmountOfSteps(Math.max(Number(e.target.value), 1))}} type="num" editable editMode></MultiroleInputField>  
                    <CheckButton onClick={()=>{
                                setIgnorePostMaxRank(!ignorePostMaxRank)
                            } } title={"Игнорировать ограничение максимального звания по должности"} value={ignorePostMaxRank}></CheckButton>
                </BaseContainer>
                </div>
                }
                {actType == "sanctions" && 
                <>
                <BaseContainer className="flex flex-col">
                    <>
                    <label htmlFor="inputDate">Введите дату окончания статуса:</label>
                    <input id="inputDate" type="date" value={selectedDate} onChange={(e)=>{
                        setSelectedDate(e.target.value)
                        console.warn(e.target.value)
                    }} min={`
                        ${today.getFullYear()}-
                        ${(today.getMonth() + 1).toString().length > 1? ((today.getMonth() + 1).toString()) : `0${((today.getMonth() + 1).toString())}`}-
                        ${today.getDate().toString().length > 1? (today.getDate().toString()) : `0${(today.getDate().toString())}`}
                        `.replaceAll(" ", "").replaceAll("\n", "")}/> 
                    </>

                    <Tooltip className="w-full">

                    <CheckButton className="w-full" onClick={()=>{
                        setOverridePrevStatus(!overridePrevStatus)
                    } } title={"Перезаписать статус"} value={overridePrevStatus}></CheckButton>
                    </Tooltip>
                </BaseContainer> 
                <SelectionList className="min-h-10" title="Выберите тип санкции" onSelection={(items)=>{setSanctions([...items])}} maxSelectedItems={1} radiobutton list={sanctions}></SelectionList>
                </>
                }
                
                {actType == "returnal" && 
                <>
                <BaseContainer className="flex-col">
                    <p className="text-text-secondary">Выберите звание из списка</p>
                    <ListedInputField value={RankPrompt} list={foundRanks} onChange={(e)=>{setRankPrompt(e.target.value); findRanks(e.target.value, multiroleList2)}} onChoice={(i)=>{setSelectedRankId(i.id); setRankPrompt(i.name)}} editMode editable></ListedInputField>
                </BaseContainer>
                    <SelectionList className="min-h-10" searchField maxListHeight="300px"  title="Выберите должности" onSelection={(items)=>{setMultiroleList([...items])}} list={multiroleList}></SelectionList>
                </>
                }
                <div className="mt-16 flex flex-col col-span-3">
                            <div className="flex justify-between items-end mb-6">
                                <h2 className="text-2xl font-header text-black dark:text-text-primary uppercase tracking-wider">
                                    Выберите бойцов для присвоения акта
                                </h2>
                                <span className="text-sm font-text text-text-secondary">
                                    Выбрано: {selectedUnits.size}
                                </span>
                            </div>

                            <div className="border border-black/10 dark:border-white/5 overflow-hidden mb-6">
                                <UniversalTable 
                                    data={units}
                                    columns={tableColumns}
                                    defaultSort={{ key: "rank", direction: "desc" }}
                                />
                            </div>

                            {/* <AssignFooter 
                                onCancel={handleCancel}
                                onAssign={handleAssign}
                                selectedCount={selectedUnits.size}
                                isSaving={isSaving}
                                buttonText="Присвоить"
                            /> */}
                </div>
            </main>
            <button onClick={()=>{sendAct()}} className="fixed z-10 bg-bg-accent font-bold hover:bg-accent hover:text-black text-xl  border border-border-secondary right-0 bottom-0 px-10 py-7 mr-10 mb-10 transition-all">
                <div className="flex gap-5 justify-center">

                <Upload></Upload>
                Отправить акт

                </div>
            </button>

        </div>
    );
}

export default function UploadDocumentPage() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen bg-bg-primary flex items-center justify-center text-text-primary">Загрузка...</div>}>
            <UploadDocumentContent />
        </Suspense>
    );
}