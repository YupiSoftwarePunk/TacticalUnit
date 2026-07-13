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
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-4 mb-4 border-b border-bg-secondary pb-4">
                <div className="flex flex-col xs:flex-row justify-between sm:justify-start items-stretch xs:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="text-text-secondary hover:text-accent border-b border-dotted border-text-secondary transition-all uppercase text-sm tracking-widest text-center xs:text-left py-1">
                        Фильтры
                    </button>
                    <div className="flex gap-2 items-center justify-between xs:justify-start min-w-0 border border-bg-secondary/40 rounded px-2 py-1 xs:border-none xs:p-0">
                        <span className="text-text-secondary text-xs sm:text-sm uppercase tracking-widest shrink-0">Сортировка:</span>
                        <select 
                            value={sortConfig.key}
                            onChange={(e) => requestSort(e.target.value)}
                            className="bg-transparent border-none text-text-primary focus:bg-bg-accent focus:ring-0 cursor-pointer text-xs sm:text-sm flex-1 min-w-0 truncate w-full">
                            {columns.filter(c => c.sortable).map(col => (
                                <option key={col.key} value={col.key} className="bg-bg-secondary focus:bg-bg-accent">{col.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="w-full sm:w-auto">
                    <button 
                        onClick={() => onExport(filteredData)}
                        className="w-full sm:w-auto bg-transparent text-accent border-b-2 border-accent hover:text-white hover:border-white transition-all py-2 sm:py-1 uppercase font-black text-center text-sm md:text-lg tracking-wider">
                        Экспортировать
                    </button>
                </div>
            </div>

            {isFilterOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-bg-secondary/40 border border-bg-secondary/60 rounded animate-in fade-in slide-in-from-top-2">
                    {columns.filter(c => c.filterable).map(col => (
                        <div key={col.key} className="w-full">
                            <label className="block text-[10px] uppercase text-text-secondary tracking-wider mb-1 font-bold">{col.label}</label>
                            <input 
                                type="text"
                                placeholder="Поиск..."
                                className="w-full bg-bg-primary border border-bg-secondary p-2 text-sm focus:border-accent outline-none text-text-primary transition-colors"
                                onChange={(e) => setActiveFilters({...activeFilters, [col.key]: e.target.value})}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="w-full block md:table-container">
                <table className="w-full block md:table border-collapse text-left">
                    <thead className="hidden md:table-header-group border-b-2 border-bg-secondary">
                        <tr>
                            {visibleColumns.map(col => (
                                <th key={col.key} className="p-4 text-xs uppercase tracking-widest text-text-secondary font-bold">
                                    {col.label}
                                </th>
                            ))}
                            {renderActions && <th className="p-4 text-right text-xs uppercase tracking-widest text-text-secondary font-bold">Действия</th>}
                        </tr>
                    </thead>

                    <tbody className="w-full block md:table-row-group space-y-4 md:space-y-0">
                        {filteredData.length === 0 ? (
                            <tr className="block md:table-row">
                                <td colSpan={visibleColumns.length + (renderActions ? 1 : 0)} className="block md:table-cell p-8 text-center text-text-secondary text-sm">
                                    Бойцы не найдены
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item, index) => (
                                <tr 
                                    key={index} 
                                    className="block md:table-row border border-bg-secondary/60 md:border-b md:border-x-0 md:border-t-0 bg-bg-secondary/10 md:bg-transparent p-4 rounded-md md:rounded-none hover:bg-bg-secondary/20 transition-colors group"
                                >
                                    {visibleColumns.map(col => (
                                        <td 
                                            key={col.key} 
                                            className="flex justify-between items-center md:table-cell py-2 border-b border-bg-secondary/20 md:border-none last:border-b-0 md:p-4 text-sm min-w-0"
                                        >
                                            <span className="md:hidden text-[11px] uppercase tracking-wider font-bold text-text-secondary/80 pr-4 shrink-0">
                                                {col.label}
                                            </span>

                                            <div className={`text-right md:text-left whitespace-normal break-words max-w-[65%] md:max-w-none ${col.className || "text-text-primary"}`}>
                                                {col.render 
                                                    ? col.render(item[col.key], item) 
                                                    : String(item[col.key] ?? "")
                                                }
                                            </div>
                                        </td>
                                    ))}

                                    {renderActions && (
                                        <td className="flex flex-col sm:flex-row md:table-cell justify-between md:justify-end items-start sm:items-center py-2 pt-3 md:p-4 border-t border-bg-secondary/30 md:border-none text-right">
                                            <span className="md:hidden text-[11px] uppercase tracking-wider font-bold text-text-secondary/80 mb-2 sm:mb-0">
                                                Действия
                                            </span>
                                            <div className="flex items-center justify-end gap-2 w-full sm:w-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                                {renderActions(item)}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UniversalTable;