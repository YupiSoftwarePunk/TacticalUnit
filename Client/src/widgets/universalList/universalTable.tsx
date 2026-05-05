"use client";

import React, { useState, useMemo } from "react";

export interface ColumnConfig {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
}

interface SortConfig {
    key: string;
    direction: "asc" | "desc";
}

interface UniversalTableProps {
    data: any[];
    columns: ColumnConfig[];
    onExport: (data: any[]) => void;
    defaultSort?: SortConfig;
}

const UniversalTable: React.FC<UniversalTableProps> = ({ 
    data, 
    columns, 
    onExport, 
    defaultSort = { key: "rank", direction: "desc" } 
}) => {
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

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        alert("Скопировано: " + text);
    };

    return (
        <div className="w-full bg-bg-primary text-text-primary font-text">
        <div className="flex justify-between items-end mb-4 border-b border-bg-secondary pb-4">
            <div className="flex gap-6">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="text-text-secondary hover:text-accent border-b border-dotted border-text-secondary transition-all uppercase text-sm tracking-widest"
            >
                Фильтры
            </button>
            <div className="flex gap-2 items-center">
                <span className="text-text-secondary text-sm uppercase tracking-widest">Сортировка:</span>
                <select 
                value={sortConfig.key}
                onChange={(e) => requestSort(e.target.value)}
                className="bg-transparent border-none text-text-primary focus:ring-0 cursor-pointer text-sm"
                >
                {columns.filter(c => c.sortable).map(col => (
                    <option key={col.key} value={col.key} className="bg-bg-secondary">{col.label}</option>
                ))}
                </select>
            </div>
            </div>
            
            <div className="flex gap-4 items-center">
            <button className="bg-transparent text-accent border-b-2 border-accent hover:text-white hover:border-white transition-all px-2 py-1 uppercase font-black text-lg">
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
                    <td className="p-4 text-text-secondary font-light w-1/5">{item.rank}</td>
                    <td className="p-4 text-accent font-bold w-1/5">{item.nickname}</td>
                    <td className="p-4 text-text-secondary text-sm w-1/3 italic">
                    {Array.isArray(item.roles) ? item.roles.join(", ") : item.roles}
                    </td>
                    <td className="p-4 text-text-secondary text-sm">{item.kit}</td>
                    <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                        onClick={() => copyToClipboard(item.steamId)}
                        className="p-1 border border-bg-secondary hover:border-accent text-[10px] uppercase"
                        >
                        Steam_ID
                        </button>
                        <button 
                        onClick={() => copyToClipboard(item.discordId)}
                        className="p-1 border border-bg-secondary hover:border-accent text-[10px] uppercase"
                        >
                        Discord_ID
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default UniversalTable;