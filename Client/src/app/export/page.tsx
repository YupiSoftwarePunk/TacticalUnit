"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MainHeader } from "@/components/Header/MainHeader";
import { ColumnConfig } from "@/widgets/universalList/universalTable";

type ExportFormat = "xlsx" | "xls" | "ods" | "pdf" | "csv" | "tsv";

export default function ExportPage() {
    const router = useRouter();
    const [data, setData] = useState<Record<string, any>[]>([]);
    const [columns, setColumns] = useState<ColumnConfig[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("xlsx");
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
        } 
        catch (e) {
            console.error("Ошибка при чтении данных экспорта:", e);
            router.push("/");
        }
    }, [router]);

    const fetchFontAsBase64 = async (url: string): Promise<string> => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;
                resolve(base64data.split(",")[1]);
            };
            reader.onerror = reject;
        });
    };

    const handleSpreadsheetExport = () => {
        const visibleColumns = columns.filter((col) => col.key);

        const exportableData = data.map((row) => {
            const cleanRow: Record<string, any> = {};
            visibleColumns.forEach((col) => {
                cleanRow[col.label] = row[col.key] ?? "";
            });
            return cleanRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Данные");

        const fullFileName = `${fileName || "export"}.${selectedFormat}`;

        if (selectedFormat == "csv")
        {
            XLSX.writeFile(workbook, fullFileName, { bookType: "csv" });
        }
        else if (selectedFormat == "tsv")
        {
            XLSX.writeFile(workbook, fullFileName, { bookType: "csv", FS: "\t" } as any);
        }
        else if (selectedFormat == "xls")
        {
            XLSX.writeFile(workbook, fullFileName, { bookType: "biff8" });
        }
        else if (selectedFormat == "ods") 
        {
            XLSX.writeFile(workbook, fullFileName, { bookType: "ods" });
        }
        else if (selectedFormat == "xlsx")
        {
            XLSX.writeFile(workbook, fullFileName, { bookType: "xlsx" });
        }
        else 
        {
            XLSX.writeFile(workbook, fullFileName, { bookType: "xlsx" });
        }
    };

    const handlePdfExport = async () => {
        const doc = new jsPDF({ orientation: "landscape" });
        const visibleColumns = columns.filter((col) => col.key);

        try {
            const fontBase64 = await fetchFontAsBase64(
                "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf"
            );
            doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");
        } catch (e) {
            console.warn("Не удалось загрузить кастомный шрифт для PDF:", e);
        }

        const headers = visibleColumns.map((col) => col.label);
        const rows = data.map((row) =>
            visibleColumns.map((col) => String(row[col.key] ?? ""))
        );

        autoTable(doc, {
            head: [headers],
            body: rows,
            styles: { font: "Roboto", fontSize: 8 },
            headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
            margin: { top: 15 },
        });

        doc.save(`${fileName || "export"}.pdf`);
    };

    const handleDownload = () => {
        if (!data.length) return;

        if (selectedFormat === "pdf") {
            handlePdfExport();
        } 
        else {
            handleSpreadsheetExport();
        }
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
                            <div className="grid grid-cols-3 gap-2">
                                {(["xlsx", "xls", "ods", "pdf", "csv", "tsv"] as ExportFormat[]).map((fmt) => (
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