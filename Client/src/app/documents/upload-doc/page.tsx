'use client';

import React, { useState, useRef } from "react";
import { MainHeader } from "@/components/Header/MainHeader";
import { Upload, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export default function UploadDocumentPage() {
    const [documentName, setDocumentName] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    
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

    return (
        <div className="w-full min-h-screen bg-bg-primary transition-colors duration-300 font-text pb-20 flex flex-col overflow-x-hidden">
            <MainHeader />

            <main className="max-w-[1400px] w-full mx-auto pt-20 md:pt-28 px-4 md:px-6 flex-shrink-0">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-4xl font-header text-text-primary uppercase tracking-wider">
                        Загрузка документов
                    </h1>
                    <span className="block w-12 h-0.5 bg-accent mt-1.5"></span>
                </div>

                <form onSubmit={handleSaveDocument} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                    <div className="lg:col-span-1 bg-bg-secondary border border-border-secondary/40 p-4 md:p-6 shadow-sm flex flex-col gap-5 transition-colors duration-300 h-full justify-between">
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-text-bold uppercase tracking-widest text-text-secondary">
                                    Название документа
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

                    <div className="lg:col-span-2 h-full">
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
                </form>
            </main>
        </div>
    );
}