'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainHeader } from "@/components/Header/MainHeader";
import { FileText, Download, ArrowLeft, Calendar } from "lucide-react";
import InfoContainer from "@/components/ToolTip/InfoContainer";
import { LoadingScreen, ErrorScreen } from "@/components/StatusScreens/Screens";

interface IDocumentEvent {
    title: string;
    color?: string;
    history: IContainedInfo[];
}

interface DocumentDetail {
    id: string;
    name: string;
    fileName: string;
    fileSize?: string;
    fileUrl: string;
    events: IDocumentEvent[];
}

export default function DocumentPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [document, setDocument] = useState<DocumentDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchDocumentData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const mockData: DocumentDetail = {
                    id: id,
                    name: "Устав личного состава и правила несения внутренней службы",
                    fileName: "document.pdf",
                    fileSize: "2.4 MB",
                    fileUrl: `/api/documents/download/${id}`,
                    events: [
                        {
                            title: "Жизненный цикл документа",
                            color: "#F5B902",
                            history: [
                                {
                                    id: "EVT-90812",
                                    content: "Документ утвержден Генеральным Штабом",
                                    color: "#10B981",
                                    dates: "15.07.2026"
                                },
                                {
                                    id: "EVT-89401",
                                    content: "Прохождение ревью юридическим отделом",
                                    color: "#F5B902",
                                    dates: "12.07.2026"
                                },
                                {
                                    id: "EVT-88120",
                                    content: "Черновик создан в системе",
                                    color: "#9F7801", 
                                    dates: "10.07.2026"
                                }
                            ]
                        },
                        {
                            title: "Скачивания и доступы",
                            color: "#9F7801",
                            history: [
                                {
                                    id: "USR-041",
                                    content: "Пользователь Denis скачал последнюю версию",
                                    color: "#3B82F6",
                                    dates: "17.07.2026"
                                },
                                {
                                    id: "SYS-001",
                                    content: "Автоматическая архивация старой версии v1",
                                    color: "#6B7280",
                                    dates: "10.07.2026"
                                }
                            ]
                        }
                    ]
                };
                setDocument(mockData);
            } 
            catch (err) {
                console.error("Ошибка при получении документа:", err);
                setError("Не удалось загрузить данные о документе. Возможно, он был перемещен в архив или ссылка недействительна.");
            } 
            finally {
                setIsLoading(false);
            }
        };

        fetchDocumentData();
    }, [id]);

    const handleDownload = () => {
        if (!document) return;
        const link = window.document.createElement("a");
        link.href = document.fileUrl;
        link.setAttribute("download", document.fileName);
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error || !document) {
        return <ErrorScreen error={error || "Документ не найден"} />;
    }

    return (
        <div className="w-full min-h-screen bg-bg-primary transition-colors duration-300 font-text pb-20 flex flex-col overflow-x-hidden text-text-primary">
            <MainHeader />
            <main className="max-w-[1400px] w-full mx-auto pt-10 md:pt-18 px-4 md:px-6 flex-shrink-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start animate-in fade-in duration-500">
                    <div className="lg:col-span-1 bg-bg-secondary border border-border-secondary/40 p-4 md:p-6 shadow-sm flex flex-col gap-6 transition-colors duration-300">
                        
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-text-bold uppercase tracking-widest text-text-secondary/60">
                                Название документа
                            </span>
                            <h1 className="text-lg md:text-xl font-text-bold text-text-primary leading-tight break-words">
                                {document.name}
                            </h1>
                            <span className="w-12 h-0.5 bg-accent mt-2"></span>
                        </div>

                        <div className="w-full border-2 border-dashed border-border-secondary/30 bg-bg-primary/30 flex flex-col items-center justify-center p-6 text-center select-none">
                            <div className="p-4 bg-bg-secondary border border-border-secondary/20 shadow-sm mb-3">
                                <FileText className="w-10 h-10 text-accent" />
                            </div>
                            <p className="text-xs font-text-bold text-text-primary break-all px-2">
                                {document.fileName}
                            </p>
                            {document.fileSize && (
                                <p className="text-[11px] text-text-secondary/60 mt-1 font-text italic">
                                    Размер: {document.fileSize}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleDownload}
                            className="relative group inline-block w-full"
                        >
                            <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                            <div className="relative border border-border-secondary bg-bg-secondary px-6 py-3 text-xs font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black cursor-pointer flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                Скачать файл
                            </div>
                        </button>
                    </div>

                    <div className="lg:col-span-2 bg-bg-secondary border border-border-secondary/40 p-4 md:p-6 shadow-sm flex flex-col gap-5 transition-colors duration-300">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-base md:text-lg font-text-bold text-text-primary uppercase tracking-wider">
                                События
                            </h2>
                            <span className="w-8 h-0.5 bg-accent mt-1"></span>
                        </div>

                        <div className="flex flex-col gap-6">
                            {document.events && document.events.length > 0 ? (
                                document.events.map((group, groupIndex) => (
                                    <div 
                                        key={groupIndex} 
                                        className="border border-border-secondary/30 bg-bg-primary/10 p-5 md:p-6 flex flex-col gap-4 animate-in fade-in duration-300">
                                        <div className="flex items-center gap-2.5 border-b border-border-secondary/20 pb-3">
                                            {group.color && (
                                                <div 
                                                    className="w-3.5 h-3.5 rounded-full shrink-0" 
                                                    style={{ backgroundColor: group.color }}
                                                />
                                            )}
                                            <h3 className="font-text-bold text-sm md:text-base text-text-primary uppercase tracking-wider">
                                                {group.title}
                                            </h3>
                                            <span className="text-[11px] text-text-secondary/50 font-text italic ml-auto">
                                                Всего: {group.history.length}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-3.5 pl-2">
                                            {group.history.map((item) => (
                                                <div 
                                                    key={item.id} 
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-bg-secondary/40 border border-border-secondary/20 hover:border-border-secondary/50 transition-colors"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {item.color && (
                                                            <span 
                                                                className="w-2 h-2 rounded-full shrink-0 mt-1.5" 
                                                                style={{ backgroundColor: item.color }}
                                                            />
                                                        )}
                                                        <div className="flex flex-col gap-0.5">
                                                            <p className="text-xs md:text-sm text-text-primary font-text leading-relaxed">
                                                                {item.content}
                                                            </p>
                                                            <span className="text-[10px] text-text-secondary/40 font-mono">
                                                                ID: {item.id}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {item.dates && (
                                                        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center text-[11px] text-text-secondary/60 bg-bg-primary/30 px-2 py-1 border border-border-secondary/10">
                                                            <Calendar className="w-3 h-3 text-accent" />
                                                            <span className="font-text-bold">{item.dates}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-xs text-text-secondary/40 font-text uppercase tracking-widest italic border border-dashed border-border-secondary/20">
                                    События отсутствуют
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}