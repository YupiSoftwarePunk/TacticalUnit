"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainHeader } from "@/components/Header/MainHeader";
import { ColumnConfig } from "@/widgets/universalList/universalTable";

type ExportFormat = "csv" | "json" | "tsv" | "txt";

export default function ExportPage() {
    const router = useRouter();
    const [data, setData] = useState<Record<string, any>[]>([]);
    const [columns, setColumns] = useState<ColumnConfig[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
    const [fileName, setFileName] = useState("members_export");

    useEffect(() => {
        const rawData = sessionStorage.getItem("export_table_data");
        const rawColumns = sessionStorage.getItem("export_table_columns");

        if (!rawData || !rawColumns) {
            router.push("/");
            return;
        }

        try {
            setData(JSON.parse(rawData));
            setColumns(JSON.parse(rawColumns));
        } catch (e) {
            console.error("Ошибка при чтении данных экспорта:", e);
            router.push("/");
        }
    }, [router]);

    // Генераторы файлов для разного формата
    const generateFileContent = (): { content: string; mimeType: string; extension: string } => {
        // Формируем словарь видимых заголовков
        const visibleColumns = columns.filter(col => col.key);

        if (selectedFormat === "json") {
            const exportableData = data.map(row => {
                const cleanRow: Record<string, any> = {};
                visibleColumns.forEach(col => {
                    cleanRow[col.label] = row[col.key];
                });
                return cleanRow;
            });
            return {
                content: JSON.stringify(exportableData, null, 2),
                mimeType: "application/json;charset=utf-8;",
                extension: "json"
            };
        }

        if (selectedFormat === "csv" || selectedFormat === "tsv") {
            const delimiter = selectedFormat === "csv" ? "," : "\t";
            const headers = visibleColumns.map(col => `"${col.label}"`).join(delimiter);
            
            const rows = data.map(row => 
                visibleColumns.map(col => {
                    const val = row[col.key] ?? "";
                    return `"${String(val).replace(/"/g, '""')}"`;
                }).join(delimiter)
            );

            // \uFEFF добавляет UTF-8 BOM для корректного открытия кириллицы в Excel
            const content = "\uFEFF" + [headers, ...rows].join("\n");
            return {
                content,
                mimeType: selectedFormat === "csv" ? "text/csv;charset=utf-8;" : "text/tab-separated-values;charset=utf-8;",
                extension: selectedFormat
            };
        }

        // Формат TXT (текстовая таблица)
        const headers = visibleColumns.map(col => col.label).join(" | ");
        const divider = "-".repeat(headers.length);
        const rows = data.map(row => 
            visibleColumns.map(col => String(row[col.key] ?? "—")).join(" | ")
        );
        
        return {
            content: [headers, divider, ...rows].join("\n"),
            mimeType: "text/plain;charset=utf-8;",
            extension: "txt"
        };
    };

    const handleDownload = () => {
        const { content, mimeType, extension } = generateFileContent();
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName || "export"}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-full w-full overflow-x-hidden min-h-screen bg-bg-primary text-text-primary">
            <MainHeader />
            
            <main className="pt-20 md:pt-24 pb-12 px-4 sm:px-8 w-full max-w-[1200px] mx-auto flex-1">
                <header className="mb-8">
                    <button 
                        onClick={() => router.back()}
                        className="mb-4 text-xs font-text-regular uppercase text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
                    >
                        ← Назад к таблице
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-header text-text-primary uppercase tracking-normal mb-2">
                        Экспорт данных
                    </h1>
                    <p className="text-text-secondary font-text-regular text-sm sm:text-base">
                        Сформирован срез из {data.length} записей на основе выбранных фильтров и сортировки
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Панель настроек экспорта */}
                    <section className="bg-bg-secondary border border-border-primary p-6 shadow-xl h-fit flex flex-col gap-6">
                        <div>
                            <label className="block text-xs uppercase font-text-bold text-text-secondary mb-2">
                                Имя файла
                            </label>
                            <input 
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                className="w-full bg-bg-primary border border-border-secondary p-2 text-sm text-text-primary focus:border-accent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-text-bold text-text-secondary mb-2">
                                Формат файла
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(["csv", "json", "tsv", "txt"] as ExportFormat[]).map((fmt) => (
                                    <button
                                        key={fmt}
                                        onClick={() => setSelectedFormat(fmt)}
                                        className={`p-3 border text-center font-text-bold text-xs uppercase transition-colors ${
                                            selectedFormat === fmt
                                                ? "border-accent bg-bg-accent text-text-primary"
                                                : "border-border-secondary bg-bg-primary text-text-secondary hover:border-accent"
                                        }`}
                                    >
                                        .{fmt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full py-3 bg-accent text-text-inverted font-text-bold text-sm uppercase hover:bg-accent-hover active:bg-accent-click transition-colors"
                        >
                            Скачать файл
                        </button>
                    </section>

                    {/* Предпросмотр данных */}
                    <section className="lg:col-span-2 bg-bg-secondary border border-border-primary p-6 shadow-xl overflow-hidden flex flex-col">
                        <h2 className="text-lg font-header uppercase text-text-primary mb-4">
                            Предпросмотр данных
                        </h2>
                        
                        <div className="overflow-x-auto w-full border border-border-secondary bg-bg-primary p-4 max-h-[450px]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border-primary">
                                        {columns.map((col) => (
                                            <th key={col.key} className="p-2 text-xs uppercase font-text-bold text-text-secondary whitespace-nowrap">
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.slice(0, 5).map((row, idx) => (
                                        <tr key={idx} className="border-b border-border-secondary/30 last:border-0">
                                            {columns.map((col) => (
                                                <td key={col.key} className="p-2 text-xs font-text-regular text-text-primary whitespace-nowrap">
                                                    {String(row[col.key] ?? "—")}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {data.length > 5 && (
                            <p className="mt-3 text-xs text-text-secondary font-text-regular italic">
                                Показаны первые 5 из {data.length} строк предпросмотра
                            </p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}