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
import { apiClient } from "@/shared/api/api";
import { submitAct, type ActDocument } from "./submitAct";
import { DocService } from "@/shared/api/services/docsService";
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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const submittingRef = useRef(false);
    const [SignAsVrIO, setSignAsVrIO] = useState<boolean>(false);
    
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
            // Keep the existing effect timing when the selected act type changes.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle(info.title);
            setDescription(info.description);
        }
    }, [actType]);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentTitle, setDocumentTitle] = useState("");
    const [uploadedDocumentId, setUploadedDocumentId] = useState<string>();
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const [documentsError, setDocumentsError] = useState<string>();
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
    }, [actType])


    const fileInputRef = useRef<HTMLInputElement>(null);

    async function loadDocuments() {
        setDocumentsLoading(true);
        setDocumentsError(undefined);
        try {
            const docs = await DocService.getAll();
            setDocumentsAtDisposal(docs.filter(doc => doc.id != null).map(doc => ({ id: String(doc.id), name: doc.title })));
        } catch (error) {
            setDocumentsError(error instanceof Error ? error.message : "Не удалось загрузить документы");
        } finally {
            setDocumentsLoading(false);
        }
    }

    function updateFile(file: File | null) {
        setSelectedFile(file);
        setUploadedDocumentId(undefined);
    }

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


    async function sendAct() {
        if (submittingRef.current) return;
        try {
            const document: ActDocument = typeOfDocument === "new"
                ? { mode: "new", file: selectedFile, title: documentTitle, uploadedId: uploadedDocumentId }
                : typeOfDocument === "existing"
                    ? { mode: "existing", id: selectedDocumentId }
                    : { mode: typeOfDocument };
            submittingRef.current = true;
            setIsSubmitting(true);
            setStatus(null);
            await submitAct({
                type: actType ?? null,
                unitIds: [...selectedUnits],
                selectedIds: multiroleList.filter(item => item.selected).map(item => item.id || ""),
                rankId: selectedRankId,
                steps: amountOfSteps,
                isDowngrade: rankTweaking.find(item => item.selected)?.id === "1",
                ignorePostMaxRank,
                overwritePosts: removePreviousPosts,
                statusId: sanctions.find(item => item.selected)?.id,
                overwriteStatus: overridePrevStatus,
                endDate: selectedDate,
            }, document, {
                createDocument: body => DocService.createNew({ body }),
                send: apiClient,
                onDocumentCreated: setUploadedDocumentId,
            });
            setStatus({ type: "success", message: "Акт успешно отправлен" });
            setSelectedUnits(new Set());
            setUploadedDocumentId(undefined);
            setSelectedFile(null);
            setDocumentTitle("");
            setSelectedDocumentId(undefined);
            setDocumentPrompt("");
            setTypeOfDocument("selection");
        } catch (error) {
            setStatus({ type: "error", message: error instanceof Error ? error.message : "Не удалось отправить акт" });
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
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

                </div>
                <fieldset disabled={isSubmitting} className="flex flex-col min-w-0 disabled:opacity-70">
                    <div className="flex">
                        <h2 className="text-2xl px-2 font-text border border-border-secondary border-b-0">Документ</h2>
                        <div className="flex flex-1 border-b border-border-secondary"></div>
                    </div>
                    {typeOfDocument === "selection" ? (
                        <div className="flex flex-col min-h-[300px] border border-t-0 border-border-secondary items-center justify-center gap-4 p-6">
                            <button type="button" onClick={() => { setTypeOfDocument("existing"); void loadDocuments(); }} className="bg-bg-secondary border border-border-secondary p-6 px-10 text-xl transition-all hover:border-accent hover:bg-bg-accent">Выбрать существующий</button>
                            <button type="button" onClick={() => setTypeOfDocument("new")} className="bg-bg-secondary border border-border-secondary p-6 px-10 text-xl transition-all hover:border-accent hover:bg-bg-accent">Добавить новый</button>
                            <button type="button" onClick={() => setTypeOfDocument("empty")} className="px-10 text-lg text-text-secondary hover:text-text-primary-accent transition-all">Без документа</button>
                        </div>
                    ) : (
                        <div className="flex flex-col border border-t-0 border-border-secondary">
                            <button type="button" onClick={() => { setTypeOfDocument("selection"); setSelectedDocumentId(undefined); setDocumentPrompt(""); }} className="h-[50px] hover:bg-bg-accent border border-transparent hover:border-accent transition-all">Назад</button>
                            {typeOfDocument === "new" && (
                                <div className="flex flex-col gap-4 bg-bg-secondary p-6">
                                    <label htmlFor="act-document-title" className="font-text-bold text-text-secondary">Название документа</label>
                                    <input id="act-document-title" value={documentTitle} onChange={e => { setDocumentTitle(e.target.value); setUploadedDocumentId(undefined); }} className="w-full bg-bg-primary border border-border-secondary p-3 text-text-primary focus:border-accent outline-none" />
                                    <label htmlFor="act-document-file" className="font-text-bold text-text-secondary">Файл документа</label>
                                    <input id="act-document-file" type="file" ref={fileInputRef} onChange={e => updateFile(e.target.files?.[0] ?? null)} className="w-full bg-bg-primary border border-border-secondary p-3 text-text-primary" />
                                    {uploadedDocumentId && <p className="text-text-secondary">Документ загружен. При повторной отправке будет использован тот же документ.</p>}
                                </div>
                            )}
                            {typeOfDocument === "existing" && (
                                <div className="flex flex-col gap-3 bg-bg-secondary p-6">
                                    <label htmlFor="act-document-search" className="font-text-bold text-text-secondary">Поиск документа</label>
                                    <input id="act-document-search" value={documentPrompt} onChange={e => { setDocumentPrompt(e.target.value); setSelectedDocumentId(undefined); }} className="w-full bg-bg-primary border border-border-secondary p-3 text-text-primary focus:border-accent outline-none" placeholder="Введите название документа" />
                                    {documentsLoading && <p className="text-text-secondary">Загрузка документов...</p>}
                                    {documentsError && <div role="alert" className="text-text-primary"><p>{documentsError}</p><button type="button" onClick={() => void loadDocuments()} className="text-accent hover:underline">Повторить загрузку</button></div>}
                                    {!documentsLoading && !documentsError && <div className="flex flex-col max-h-60 overflow-y-auto border border-border-secondary">
                                        {documentsAtDisposal.filter(item => (item.name || "").toLowerCase().includes(documentPrompt.toLowerCase())).map(item => (
                                            <button type="button" key={item.id} onClick={() => { setSelectedDocumentId(item.id); setDocumentPrompt(item.name || ""); }} className={`text-left p-3 border-b border-border-secondary hover:bg-bg-accent ${selectedDocumentId === item.id ? "bg-bg-accent text-text-primary-accent" : "text-text-primary"}`}>{item.name} <span className="text-text-secondary">(ID: {item.id})</span></button>
                                        ))}
                                        {documentsAtDisposal.filter(item => (item.name || "").toLowerCase().includes(documentPrompt.toLowerCase())).length === 0 && <p className="p-3 text-text-secondary">Документы не найдены</p>}
                                    </div>}
                                    {selectedDocumentId && <p className="text-text-secondary">Выбран документ ID: {selectedDocumentId}</p>}
                                </div>
                            )}
                            {typeOfDocument === "empty" && <p className="p-6 text-text-secondary">Акт будет отправлен без документа.</p>}
                        </div>
                    )}
                </fieldset>

                {actType == "rewards" && <SelectionList className="min-h-10" title="Выберите награды из списка" onSelection={(items)=>{setMultiroleList([...items])}} searchField list={multiroleList}></SelectionList>}
                {actType == "posts" && 
                <div className="flex flex-col">
                    <BaseContainer className="flex flex-col">
                        <CheckButton className="text-xl flex-1 text-text-primary" title="Снять с других должностей" value={removePreviousPosts} onClick={()=>{setRemovePreviousPosts(!removePreviousPosts)}}></CheckButton>
                        <CheckButton className="text-xl flex-1 text-text-primary" title="Назначить как ВрИО" onClick={()=>{setSignAsVrIO(!SignAsVrIO)}} value={SignAsVrIO}></CheckButton>

                    </BaseContainer>
                    <SelectionList className="min-h-10" title="Выберите должности из списка" onSelection={(items)=>{setMultiroleList([...items])}} searchField list={multiroleList}></SelectionList>
                </div>
                }
                {actType == "ranks" && 
                <BaseContainer className="flex-col">
                    <p className="text-text-secondary">Выберите звание из списка</p>
                    <ListedInputField value={RankPrompt} list={foundRanks} onChange={(e)=>{setSelectedRankId(undefined); setRankPrompt(e.target.value); findRanks(e.target.value, multiroleList)}} onChoice={(i)=>{setSelectedRankId(i.id); setRankPrompt(i.name)}} editMode editable></ListedInputField>
                </BaseContainer>
                // <SelectionList className="min-h-10" title="Выберите звание из списка" onSelection={(items)=>{setMultiroleList([...items])}} maxSelectedItems={1} searchField list={multiroleList}></SelectionList>
                }
                {actType == "rank-altering" && 
                <div className="flex flex-col">
                <SelectionList className="min-h-10" title="Количество ступеней к" onSelection={(items)=>{setRankTweaking([...items])}} maxSelectedItems={1} radiobutton list={rankTweaking}></SelectionList>
                <BaseContainer className="flex-col">
                    <p>Кол-во ступеней:</p>
                    <MultiroleInputField value={amountOfSteps} onChange={(e)=>{setAmountOfSteps(Math.max(Number(e.target.value), 1))}} type="num" editable editMode></MultiroleInputField>  
                    <CheckButton onClick={()=>{setIgnorePostMaxRank(!ignorePostMaxRank)} } title={"Игнорировать ограничение максимального звания по должности"} value={ignorePostMaxRank}></CheckButton>
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
                    <ListedInputField value={RankPrompt} list={foundRanks} onChange={(e)=>{setSelectedRankId(undefined); setRankPrompt(e.target.value); findRanks(e.target.value, multiroleList2)}} onChoice={(i)=>{setSelectedRankId(i.id); setRankPrompt(i.name)}} editMode editable></ListedInputField>
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
            <button onClick={sendAct} disabled={isSubmitting} className="disabled:opacity-50 disabled:cursor-not-allowed fixed z-10 bg-bg-accent font-bold hover:bg-accent hover:text-black text-xl  border border-border-secondary right-0 bottom-0 px-10 py-7 mr-10 mb-10 transition-all">
                <div className="flex gap-5 justify-center">

                <Upload></Upload>
                {isSubmitting ? "Отправка..." : "Отправить акт"}

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
