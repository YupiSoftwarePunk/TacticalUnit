'use client';

import React, { useState, useRef, useEffect } from "react";
import { MainHeader } from "@/components/Header/MainHeader";
import { Upload, FileText, CheckCircle2, AlertTriangle, Check } from "lucide-react";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { UnitService } from "@/shared/api/services/unitService";
import { BaseContainer, IListedInputItem, ListedInputField, MultiroleInputField, SelectionList } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { useSearchParams } from "next/navigation";
import { RewardService } from "@/shared/api/services/RewardService";
import { PostService } from "@/shared/api/services/postService";
import { RankService } from "@/shared/api/services/RankService";

export default function UploadDocumentPage() {
    const searchParameters = useSearchParams()
    const actType = searchParameters?.get('type') // Types possible: "rewards" | "posts" | "ranks" | "rank-altering" | "sanctions"

    const [documentName, setDocumentName] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [units, setUnits] = useState<IUnit[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
    const [typeOfDocument, setTypeOfDocument] = useState<"selection" | "new" | "existing">("selection");
    const [documentsAtDisposal, setDocumentsAtDisposal] = useState<IListedInputItem[]>([]);
    const [documentPrompt, setDocumentPrompt] = useState<string>("")
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>()

    const [multiroleList, setMultiroleList] = useState<IListedInputItem[]>([]);
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
    const [sanctions, setSanctions] = useState<IListedInputItem[]>([
        {
            name: "Благодарность",
            id: "0",
            selected: false
        },
        {
            name: "Выговор",
            id: "1",
            selected: false
        },
        {
            name: "Строгий выговор",
            id: "2",
            selected: false
        },
    ]);
    
    
    useEffect(()=>{
        // Recieving data about currently available acts from the server [endpoints are not ready yet. Wait until better times.]
    }, [])

    useEffect(()=>{
        if(actType == "rewards"){
            RewardService.getAll().then((rds)=>{
                let preparedList : IListedInputItem[] = [];
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
        }else if(actType == "posts"){
            PostService.getAll().then((pst)=>{
                let preparedList : IListedInputItem[] = [];
                pst.forEach(el => {
                    preparedList.push(
                        {
                            name : el.name,
                            description : el.description,
                            id : el.id,
                            selected : false
                        }
                    )
                });
                setMultiroleList(preparedList);
            })
        }else if(actType == "ranks"){
            RankService.getAll().then((rnk)=>{
                let preparedList : IListedInputItem[] = [];
                rnk.forEach(el => {
                    preparedList.push(
                        {
                            name : el.name,
                            id : el.id,
                            selected : false
                        }
                    )
                });
                setMultiroleList(preparedList);
            })
        }
    }, [])


    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            if (!documentName) {
                const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                setDocumentName(nameWithoutExt);
            }
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
            if (!documentName) {
                const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                setDocumentName(nameWithoutExt);
            }
        }
    };

    const handleSaveDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !documentName.trim()) {
            setStatus({ type: 'error', message: 'Заполните название документа и выберите файл' });
            return;
        }

        setIsLoading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("name", documentName.trim());

        try {
            // обращение к ендпоинту
            setStatus({ type: 'success', message: 'Документ успешно загружен в базу данных' });
            setDocumentName("");
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
            render: (_, item: IUnit) => (
                <button
                    onClick={() => toggleUnitSelection(item.discordId)}
                    className="flex items-center justify-center w-6 h-6 border border-border-secondary bg-bg-dark hover:bg-bg-accent hover:text-black transition-colors"
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
            filterable: true,
            render: (rank: IRank) => rank?.name || "Без звания"
        },
        { 
            key: "posts", 
            label: "Должность", 
            sortable: false, 
            filterable: true,
            render: (posts: IPost[]) => posts?.map(p => p.name).join(", ") || "Нет должности"
        },
    ];

    const handleExport = (data: IUnit[]) => {
        console.log("Экспорт данных:", data);
    };

    useEffect(()=>{
        UnitService.getAll().then((list)=>{
            setUnits(list);
        })
    },[])
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
                {typeOfDocument == "selection" &&
                                <div className="flex flex-col min-h-[300px] lg:min-h-[400px] border border-border-primary items-center w-full justify-center content-center gap-5">
                                    <h2 className="text-2xl">Документ</h2>
                                    <div className="gap-4 flex flex-col">
                                        <button onClick={()=>{setTypeOfDocument("existing")}} className="bg-bg-secondary border border-border-secondary p-6 px-10 text-xl transition-all hover:border-accent hover:bg-bg-accent">Выбрать существующий</button>
                                        <button onClick={()=>{setTypeOfDocument("new")}} className=" px-10 text-lg text-text-secondary hover:text-text-primary-accent transition-all">Добавить новый</button>

                                    </div>
                                </div>
                }
                
                {typeOfDocument != "selection" 
                &&
                <div className="flex flex-col w-full">
                    <button onClick={()=>{setTypeOfDocument("selection")}} className="h-[50px] hover:bg-bg-accent border border-transparent hover:border-accent transition-all">Назад</button>

                    {typeOfDocument == "new" &&
                        <form onSubmit={handleSaveDocument} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                            <div className="lg:col-span-1 max-lg:col-span-3 bg-bg-secondary border border-border-secondary/40 p-4 md:p-6 shadow-sm flex flex-col gap-5 transition-colors duration-300 h-full justify-between">
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary">
                                            Название акта
                                        </label>
                                        <input
                                            type="text"
                                            value={documentName}
                                            onChange={(e) => setDocumentName(e.target.value)}
                                            placeholder="Введите название..."
                                            disabled={isLoading}
                                            className="w-full bg-bg-primary border border-border-secondary/30 p-2 text-sm text-text-primary focus:border-accent outline-none rounded-none h-[38px] transition-colors font-text placeholder:text-text-secondary/40"
                                        />
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

                                <div className="pt-4 mt-auto">
                                    <button
                                        type="submit"
                                        disabled={isLoading || !selectedFile || !documentName.trim()}
                                        className="relative group inline-block disabled:opacity-50 disabled:pointer-events-none w-full"
                                    >
                                        <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                                        <div className="relative border border-border-secondary bg-bg-secondary px-6 py-2.5 text-xs font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black cursor-pointer text-center">
                                            {isLoading ? "Сохранение..." : "Сохранить"}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-2 max-lg:col-span-3 h-full text-text-primary">
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
                {actType == "rewards" && <SelectionList className="min-h-10" title="Выберите награды из списка" onSelection={(items)=>{setMultiroleList([...items])}} searchField list={multiroleList}></SelectionList>}
                {actType == "posts" && <SelectionList className="min-h-10" title="Выберите должности из списка" onSelection={(items)=>{setMultiroleList([...items])}} searchField list={multiroleList}></SelectionList>}
                {actType == "ranks" && <SelectionList className="min-h-10" title="Выберите звание из списка" onSelection={(items)=>{setMultiroleList([...items])}} maxSelectedItems={1} searchField list={multiroleList}></SelectionList>}
                {actType == "rank-altering" && 
                <div className="flex flex-col">
                <SelectionList className="min-h-10" title="Количество ступеней к" onSelection={(items)=>{setRankTweaking([...items])}} maxSelectedItems={1} radiobutton list={rankTweaking}></SelectionList>
                <BaseContainer className="flex-col">
                    <p>Кол-во ступеней:</p>
                    <MultiroleInputField value={amountOfSteps} onChange={(e)=>{setAmountOfSteps(Math.max(Number(e.target.value), 1))}} type="num" editable editMode></MultiroleInputField>  
                </BaseContainer>
                </div>
                }
                {actType == "sanctions" && <SelectionList className="min-h-10" title="Выберите тип санкции" onSelection={(items)=>{setSanctions([...items])}} maxSelectedItems={1} radiobutton list={sanctions}></SelectionList>}
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
                                    onExport={handleExport}
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
        </div>
    );
}

