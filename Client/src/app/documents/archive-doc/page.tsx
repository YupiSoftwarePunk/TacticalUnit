'use client';

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { MainHeader } from "@/components/Header/MainHeader";
import UniversalTable, { ColumnConfig } from "@/widgets/universalList/universalTable";
import { Search, Calendar, User } from "lucide-react";
import { DocService } from "@/shared/api/services/docsService"; 

interface IDocumentData {
    id: string;
    title?: string;
    name?: string;         
    authorNickname?: string;
    authorDiscordId?: string;
    createdAt?: string;
    uploadDate?: string;
}

export default function DocumentArchivePage() {
    const [documents, setDocuments] = useState<IDocumentData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [authorFilter, setAuthorFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        setIsLoading(true);
        DocService.getAll()
            .then((data) => {
                setDocuments(data as unknown as IDocumentData[]);
            })
            .catch((err) => {
                console.error("Ошибка при загрузке документов:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const columnsLayout: ColumnConfig[] = useMemo(() => [
        {
            key: "name",
            label: "Название документа",
            header: "Название документа",
            accessor: "name",
            render: (value: string, row: IDocumentData) => {
                const docTitle = value || row.title || "Без названия";
                return (
                    /* ССЫЛКА НА ДОКУМЕНТ */
                    <Link 
                        href={`/documents/docs/${row.id}`}
                        className="text-text-primary font-text-bold hover:text-accent border-b border-transparent hover:border-accent transition-colors block text-wrap py-1"
                    >
                        {docTitle}
                    </Link>
                );
            }
        },
        {
            key: "authorNickname",
            label: "Никнейм автора",
            header: "Никнейм автора",
            accessor: "authorNickname",
            render: (value: string, row: IDocumentData) => {
                const authorName = value || row.authorNickname || "Неизвестен";
                const authorId = row.authorDiscordId || row.id; 

                return (
                    /* ССЫЛКА НА ПРОФИЛЬ БОЙЦА*/
                    <Link 
                        href={`/profile/${authorId}`}
                        className="text-accent font-text-bold hover:text-text-primary-accent transition-colors"
                    >
                        {authorName}
                    </Link>
                );
            }
        },
        {
            key: "uploadDate",
            label: "Дата загрузки",
            header: "Дата загрузки",
            accessor: "uploadDate",
            render: (value: string, row: IDocumentData) => {
                const dateRaw = value || row.createdAt || row.uploadDate;
                if (!dateRaw) return <span className="font-text text-text-secondary/40">[ Не указана ]</span>;
                
                const date = new Date(dateRaw);
                return (
                    <span className="font-text text-text-secondary">
                        {date.toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        })}
                    </span>
                );
            }
        }
    ], []);

    const filteredDocuments = useMemo(() => {
        return documents.filter((doc) => {
            const docName = (doc.name || doc.title || "").toLowerCase();
            const author = (doc.authorNickname || "").toLowerCase();
            const rawDate = doc.uploadDate || doc.createdAt;

            const matchesSearch = docName.includes(searchQuery.toLowerCase());
            const matchesAuthor = author.includes(authorFilter.toLowerCase());
            
            if (!rawDate) return matchesSearch && matchesAuthor;

            const docDate = new Date(rawDate).getTime();
            const matchesStartDate = startDate ? docDate >= new Date(startDate).getTime() : true;
            const matchesEndDate = endDate ? docDate <= new Date(endDate).getTime() : true;

            return matchesSearch && matchesAuthor && matchesStartDate && matchesEndDate;
        });
    }, [documents, searchQuery, authorFilter, startDate, endDate]);

    return (
        <div className="w-full min-h-screen bg-bg-primary transition-colors duration-300 font-text pb-20 flex flex-col overflow-x-hidden">
            <MainHeader />
            <main className="max-w-350 w-full mx-auto pt-20 md:pt-28 px-4 md:px-6 shrink-0 flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-header text-text-primary uppercase tracking-wider">
                        Архив документов РХБЗ
                    </h1>
                    <span className="block w-12 h-0.5 bg-accent mt-1.5"></span>
                </div>

                <div className="bg-bg-secondary border border-border-secondary/40 p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end transition-colors duration-300">

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary flex items-center gap-1.5">
                            <Search className="w-3 h-3 text-accent" /> Поиск по названию
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Введите название документа..."
                            className="w-full bg-bg-primary border border-border-secondary/30 p-2 text-sm text-text-primary focus:border-accent outline-none rounded-none h-9.5 transition-colors font-text placeholder:text-text-secondary/40"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary flex items-center gap-1.5">
                            <User className="w-3 h-3 text-accent" /> Автор документа
                        </label>
                        <input
                            type="text"
                            value={authorFilter}
                            onChange={(e) => setAuthorFilter(e.target.value)}
                            placeholder="Никнейм бойца..."
                            className="w-full bg-bg-primary border border-border-secondary/30 p-2 text-sm text-text-primary focus:border-accent outline-none rounded-none h-9.5 transition-colors font-text placeholder:text-text-secondary/40"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-accent" /> Период загрузки
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-bg-primary border border-border-secondary/30 p-2 text-xs text-text-primary focus:border-accent outline-none rounded-none h-9.5 transition-colors font-text"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-bg-primary border border-border-secondary/30 p-2 text-xs text-text-primary focus:border-accent outline-none rounded-none h-9.5 transition-colors font-text"
                            />
                        </div>
                    </div>
                </div>

                <div className="border border-black/10 dark:border-white/5 overflow-hidden bg-bg-secondary p-1">
                    {isLoading ? (
                        <div className="text-center text-text-secondary font-text uppercase tracking-widest py-20 w-full animate-pulse text-xs">
                            Запрос к архиву РХБЗ...
                        </div>
                    ) : filteredDocuments.length > 0 ? (
                        <UniversalTable 
                            data={filteredDocuments} 
                            columns={columnsLayout} 
                            onExport={(data) => console.log("Exporting archive data:", data)}
                        />
                    ) : (
                        <div className="text-center text-text-secondary/50 font-text uppercase tracking-widest py-16 w-full text-xs">
                            Документы, соответствующие фильтрам, не найдены
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}