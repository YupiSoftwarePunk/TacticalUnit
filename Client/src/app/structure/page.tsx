"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface ClanMember {
    id: string;
    rank: string;
    name: string;
}

interface StructureNode {
    id: string;
    title: string;
    type: "department" | "role";
    slug: string;
    color?: string;
    members?: ClanMember[];
    children?: StructureNode[];
}

const MOCK_STRUCTURE_DATA: StructureNode = {
    id: "hq",
    title: "Командир РХБЗ",
    type: "role",
    slug: "commander-rhbz",
    color: "#eab308",
    members: [{ id: "m1", rank: "Генерал-Майор", name: "Дениска" }],
    children: [
        {
            id: "hq-deputy",
            title: "Заместитель командира РХБЗ",
            type: "role",
            slug: "deputy-commander",
            color: "#eab308",
            members: [{ id: "m2", rank: "Полковник", name: "Ярек" }],
            children: [
                {
                    id: "staff-dept",
                    title: "Штаб",
                    type: "department",
                    slug: "staff",
                    color: "#991b1b",
                    children: [
                        {
                            id: "staff-head",
                            title: "Начальник штаба",
                            type: "role",
                            slug: "staff-head",
                            members: [{ id: "m3", rank: "Майор", name: "Иванов" }]
                        },
                        {
                            id: "staff-deputy",
                            title: "Заместитель начальника штаба",
                            type: "role",
                            slug: "staff-deputy",
                            members: []
                        }
                    ]
                },
                {
                    id: "comms-dept",
                    title: "Служба связи",
                    type: "department",
                    slug: "communications",
                    color: "#65a30d",
                    children: [
                        {
                            id: "comms-head",
                            title: "Начальник службы связи",
                            type: "role",
                            slug: "comms-head",
                            members: [{ id: "m4", rank: "Ст. Лейтенант", name: "NikitaNet" }]
                        },
                        {
                            id: "comms-officer",
                            title: "Офицер службы связи",
                            type: "role",
                            slug: "comms-officer",
                            members: []
                        }
                    ]
                }
            ]
        }
    ]
};

const TreeNode = ({ node }: { node: StructureNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const isDepartment = node.type === "department";
    const membersCount = node.members?.length || 0;
    const isVacant = membersCount === 0;

    const defaultRoleColor = "#d1d5db";
    const defaultDeptColor = "#4b5563";
    const borderColor = node.color || (isDepartment ? defaultDeptColor : defaultRoleColor);

    return (
        <li>
            <div className="flex flex-col items-center">
                <div 
                    className="relative bg-bg-primary border-2 p-4 min-w-[240px] max-w-[320px] group transition-all duration-300 hover:shadow-lg"
                    style={{ borderColor }}
                >
                    <Link 
                        href={`/structure/${node.type}s/${node.slug}`}
                        className="block text-center font-header uppercase tracking-wider text-text-primary hover:text-accent transition-colors mb-3"
                    >
                        {node.title}
                    </Link>

                    {!isDepartment && (
                        <div className="border-t border-black/10 dark:border-white/10 pt-3 flex flex-col items-center">
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 text-xs font-text uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                            >
                                <span>{isVacant ? "Вакантно" : `${membersCount} человек`}</span>
                                {!isVacant && (
                                    <svg 
                                        className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </button>

                            <div 
                                className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${isExpanded && !isVacant ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}
                            >
                                <ul className="flex flex-col gap-2 w-full text-sm font-text text-text-primary bg-black/5 dark:bg-white/5 p-3">
                                    {node.members?.map(member => (
                                        <li key={member.id} className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-1 last:border-0 last:pb-0">
                                            <span className="opacity-70">{member.rank}</span>
                                            <span className="font-text-bold">{member.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {node.children && node.children.length > 0 && (
                    <ul>
                        {node.children.map(child => (
                            <TreeNode key={child.id} node={child} />
                        ))}
                    </ul>
                )}
            </div>
        </li>
    );
};

export default function ClanStructurePage() {
    const [hasAdminPermission] = useState(true);
    const [showVacant, setShowVacant] = useState(false);

    const filterTree = (node: StructureNode): StructureNode | null => {
        if (showVacant) return node;

        const filteredChildren = (node.children || [])
            .map(child => filterTree(child))
            .filter(Boolean) as StructureNode[];

        const isRole = node.type === "role";
        const isDept = node.type === "department";
        const hasMembers = isRole && (node.members?.length || 0) > 0;
        const hasValidChildren = filteredChildren.length > 0;

        if (isRole && !hasMembers && !hasValidChildren) return null;
        if (isDept && !hasValidChildren) return null;

        return { ...node, children: filteredChildren };
    };

    const filteredData = useMemo(() => filterTree(MOCK_STRUCTURE_DATA), [showVacant]);

    return (
        <div className="w-full min-h-screen bg-bg-primary transition-colors duration-300 font-text pb-20 overflow-x-auto">
            <style>{`
                .org-tree {
                    --line-color: rgba(128, 128, 128, 0.3);
                }
                .org-tree ul {
                    display: flex;
                    justify-content: center;
                    padding-top: 30px;
                    position: relative;
                    gap: 20px;
                }
                .org-tree li {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    padding-top: 30px;
                }
                .org-tree li::before, .org-tree li::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    width: 50%;
                    height: 30px;
                    border-top: 2px solid var(--line-color);
                }
                .org-tree li::before {
                    right: 50%;
                    border-right: 2px solid var(--line-color);
                }
                .org-tree li::after {
                    left: 50%;
                    border-left: 2px solid var(--line-color);
                }
                .org-tree li:only-child::before, .org-tree li:only-child::after {
                    display: none;
                }
                .org-tree li:only-child {
                    padding-top: 0;
                }
                .org-tree li:first-child::before, .org-tree li:last-child::after {
                    border: 0 none;
                }
                .org-tree li:last-child::before {
                    border-right: 2px solid var(--line-color);
                }
                .org-tree li:first-child::after {
                    border-left: 2px solid var(--line-color);
                }
                .org-tree ul ul::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 2px solid var(--line-color);
                    width: 0;
                    height: 30px;
                }
            `}</style>

            <main className="max-w-[1400px] mx-auto pt-32 px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h1 className="text-5xl font-header text-text-primary uppercase tracking-wider">
                            Структура клана
                        </h1>
                        <span className="block w-20 h-1 bg-accent mt-2"></span>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    className="sr-only"
                                    checked={showVacant}
                                    onChange={(e) => setShowVacant(e.target.checked)}
                                />
                                <div className={`w-10 h-6 border-2 border-text-primary transition-colors ${showVacant ? 'bg-accent border-accent' : 'bg-transparent'}`}></div>
                                <div className={`absolute top-1 w-3 h-3 bg-text-primary transition-transform duration-300 ${showVacant ? 'translate-x-5 bg-black' : 'translate-x-1'}`}></div>
                            </div>
                            <span className="text-sm font-text uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">
                                Показывать вакантные должности
                            </span>
                        </label>

                        {hasAdminPermission && (
                            <div className="flex gap-4">
                                <button className="relative group inline-block">
                                    <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                                    <div className="relative border border-border-secondary bg-bg-primary px-4 py-2 text-xs font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black">
                                        Создать подразделение
                                    </div>
                                </button>
                                <button className="relative group inline-block">
                                    <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                                    <div className="relative border border-border-secondary bg-bg-primary px-4 py-2 text-xs font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black">
                                        Создать должность
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="org-tree w-full flex justify-center pb-20">
                    {filteredData ? (
                        <ul className="!pt-0">
                            <TreeNode node={filteredData} />
                        </ul>
                    ) : (
                        <div className="text-center text-text-secondary font-text uppercase tracking-widest py-20">
                            Нет данных для отображения
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}