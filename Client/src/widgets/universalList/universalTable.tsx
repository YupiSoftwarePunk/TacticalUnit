"use client";

import React, { useState, useMemo } from "react";

export interface ColumnConfig {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    className?: string;
    render?: (value: any, item: any) => React.ReactNode;
}

interface SortConfig {
    key: string;
    direction: "asc" | "desc";
}

interface UniversalTableProps<T> {
    data: T[];
    columns: ColumnConfig[];
    onExport: (data: T[]) => void;
    defaultSort?: SortConfig;
    renderActions?: (item: T) => React.ReactNode;
}

const UniversalTable = <T extends Record<string, any>>({ 
    data, 
    columns, 
    onExport, 
    defaultSort = { key: "rank", direction: "desc" },
    renderActions
} : UniversalTableProps<T>) => {
    const visibleColumns = useMemo(() => {
        return columns.filter(col => !col.key.startsWith("activity"));
    }, [columns]);
    const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSort);
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const sortedData = useMemo(() => {
        const sortableItems = [...data];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
                if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const filteredData = useMemo(() => {
        return sortedData.filter(item => {
            return Object.keys(activeFilters).every(key => {
                if (!activeFilters[key]) return true;
                const itemValue = String(item[key] || "").toLowerCase();
                return itemValue.includes(activeFilters[key].toLowerCase());
            });
        });
    }, [sortedData, activeFilters]);

    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "desc";
        if (sortConfig.key === key && sortConfig.direction === "desc") {
            direction = "asc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="w-full bg-bg-primary text-text-primary font-text">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4 border-b border-bg-secondary pb-4">
                <div className="flex justify-between sm:justify-start items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="text-text-secondary hover:text-accent border-b border-dotted border-text-secondary transition-all uppercase text-sm tracking-widest"
                    >
                        Фильтры
                    </button>
                    <div className="flex gap-1 sm:gap-2 items-center flex-1 min-w-0">
                        <span className="text-text-secondary text-xs sm:text-sm uppercase tracking-widest shrink-0">Сортировка:</span>
                        <select 
                            value={sortConfig.key}
                            onChange={(e) => requestSort(e.target.value)}
                            className="bg-transparent border-none text-text-primary focus:bg-bg-accent focus:ring-0 cursor-pointer text-xs sm:text-sm flex-1 min-w-0 truncate w-full"
                        >
                            {columns.filter(c => c.sortable).map(col => (
                                <option key={col.key} value={col.key} className="bg-bg-secondary focus:bg-bg-accent">{col.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="flex gap-4 items-center w-full sm:w-auto justify-between sm:justify-start">
                    <button 
                        onClick={() => onExport(filteredData)}
                        className="bg-transparent text-accent border-b-2 border-accent hover:text-white hover:border-white transition-all px-2 py-1 uppercase font-black text-sm md:text-lg"
                    >
                        Экспортировать
                    </button>
                </div>
            </div>

            {isFilterOpen && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-bg-secondary animate-in fade-in slide-in-from-top-2">
                    {columns.filter(c => c.filterable).map(col => (
                        <div key={col.key}>
                            <label className="block text-[10px] uppercase text-text-secondary mb-1">{col.label}</label>
                            <input 
                                type="text"
                                placeholder="Поиск..."
                                className="w-full bg-bg-primary border border-bg-secondary p-2 text-sm focus:border-accent outline-none"
                                onChange={(e) => setActiveFilters({...activeFilters, [col.key]: e.target.value})}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="border border-bg-secondary hover:bg-bg-secondary/30 transition-colors group">
                                {visibleColumns.map(col => (
                                    <td 
                                        key={col.key} 
                                        className={`p-4 ${col.className || "text-text-secondary text-sm"}`}
                                    >
                                        {col.render 
                                            ? col.render(item[col.key], item) 
                                            : String(item[col.key] ?? "")
                                        }
                                    </td>
                                ))}

                                {renderActions && (
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            {renderActions(item)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UniversalTable;