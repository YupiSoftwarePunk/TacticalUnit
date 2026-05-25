"use client";

import React, { useState, useMemo, useRef, MouseEvent } from "react";
import Link from "next/link";
import { MainHeader } from "@/components/Header/MainHeader";

const MOCK_ROLES_DATA = {
    "Командир клана": {
        "Color": "#FFFFFF",
        "People": [ "Никнейм челика" ],
        "Subdivision": null,
        "Subordinates": {
            "Заместитель командира клана": {
                "Color": "#AAAAAA",
                "People": [],
                "Subdivision": null,
                "Subordinates": {
                    "Начальник штаба": {
                        "Color": "#EEFFEE",
                        "People": [ "Ещё один челик" ],
                        "Subdivision": 2,
                        "Subordinates": {
                            "Заместитель началька штаба": {
                                "Color": "#AAFFAA",
                                "People": [],
                                "Subdivision": 2,
                                "Subordinates": {
                                    "Начальник службы связи": {
                                        "Color": "#FFFFAA",
                                        "People": [ "Ещё какой-то челик" ],
                                        "Subdivision": 4,
                                        "Subordinates": {}
                                    },
                                    "Начальник отдела кадров": {
                                        "Color": "#FF2222",
                                        "People": [ "Нач кадров чел" ],
                                        "Subdivision": 6,
                                        "Subordinates": {
                                            "Офицер отдела кадров": {
                                                "Color": "#EE2222",
                                                "People": [ "Вот челик1", "Вот челик2", "Вот челик3" ],
                                                "Subdivision": 6,
                                                "Subordinates": {}
                                            }
                                        }
                                    },
                                    "Командир роты": {
                                        "Color": "#AAFFAA",
                                        "People": [ "Чел командир" ],
                                        "Subdivision": 5,
                                        "Subordinates": {
                                            "Заместитель командира роты": {
                                                "Color": "#AAFF99",
                                                "People": [],
                                                "Subdivision": 5,
                                                "Subordinates": {
                                                    "Командир 1 пехотного взвода": {
                                                        "Color": "#EEFF22",
                                                        "People": [ "Командир1" ],
                                                        "Subdivision": 8,
                                                        "Subordinates": {
                                                            "Стрелок 1 пехотного взвода": {
                                                                "Color": "#00FF00",
                                                                "People": [ "Челик1", "Челик2", "Челик3" ],
                                                                "Subdivision": 8,
                                                                "Subordinates": {}
                                                            }
                                                        }
                                                    },
                                                    "Командир 2 пехотного взвода": {
                                                        "Color": "#EEFF22",
                                                        "People": [ "Командир2" ],
                                                        "Subdivision": 9,
                                                        "Subordinates": {
                                                            "Стрелок 2 пехотного взвода": {
                                                                "Color": "#00FF00",
                                                                "People": [ "Челик1", "Челик2", "Челик3" ],
                                                                "Subdivision": 9,
                                                                "Subordinates": {}
                                                            }
                                                        }
                                                    },
                                                    "Командир 3 пехотного взвода": {
                                                        "Color": "#EEFF22",
                                                        "People": [ "Командир3" ],
                                                        "Subdivision": 10,
                                                        "Subordinates": {
                                                            "Стрелок 3 пехотного взвода": {
                                                                "Color": "#00FF00",
                                                                "People": [ "Челик1", "Челик2", "Челик3" ],
                                                                "Subdivision": 10,
                                                                "Subordinates": {}
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "Начальник военной полиции": {
                        "Color": "#0000FF",
                        "People": [ "Никнейм впшника" ],
                        "Subdivision": 1,
                        "Subordinates": {
                            "Военный полицейский": {
                                "Color": "#1111FF",
                                "People": [ "Впшник1", "Впшник2", "Впшник3" ],
                                "Subdivision": 1,
                                "Subordinates": {}
                            }
                        }
                    }
                }
            }
        }
    }
};

const MOCK_SUBDIVISIONS_DATA = {
    "Военная полиция": { "Id": 1, "Color": "#5555AA", "HeadSubdivisionId": null },
    "Штаб": { "Id": 2, "Color": "#AA5500", "HeadSubdivisionId": null },
    "Отдел кадров": { "Id": 6, "Color": "#FF5555", "HeadSubdivisionId": null },
    "Служба связи": { "Id": 4, "Color": "#FFFF00", "HeadSubdivisionId": null },
    "Командование 1 роты": { "Id": 5, "Color": "#FF9900", "HeadSubdivisionId": 7 },
    "1 рота": { "Id": 7, "Color": "#888888", "HeadSubdivisionId": null },
    "1 пехотный взвод": { "Id": 8, "Color": "#AAAAAA", "HeadSubdivisionId": 7 },
    "2 пехотный взвод": { "Id": 9, "Color": "#AAAAAA", "HeadSubdivisionId": 7 },
    "3 пехотный взвод": { "Id": 10, "Color": "#AAAAAA", "HeadSubdivisionId": 7 }
};

interface StructureNode {
    id: string;
    title: string;
    color: string;
    members: string[];
    subdivisionId: number | null;
    subdivisionName?: string;
    children: StructureNode[];
}

class ClanStructureTransformer {
    private subdivisions: Record<number, { name: string; color: string }> = {};

    constructor(subdivisionsData: Record<string, { Id: number; Color: string; HeadSubdivisionId: number | null }>) {
        Object.entries(subdivisionsData).forEach(([name, info]) => {
            this.subdivisions[info.Id] = { name, color: info.Color };
        });
    }

    private generateSlug(text: string): string {
        return encodeURIComponent(text.toLowerCase().replace(/ /g, "-"));
    }

    public transform(rolesData: Record<string, any>): StructureNode | null {
        const rootName = Object.keys(rolesData)[0];
        if (!rootName) return null;

        return this.parseNode(rootName, rolesData[rootName]);
    }

    private parseNode(name: string, data: any): StructureNode {
        const subdivisionId = data.Subdivision;
        const subdivisionInfo = subdivisionId ? this.subdivisions[subdivisionId] : undefined;

        const children: StructureNode[] = [];
        if (data.Subordinates) {
            Object.entries(data.Subordinates).forEach(([subName, subData]) => {
                children.push(this.parseNode(subName, subData));
            });
        }

        return {
            id: `role-${this.generateSlug(name)}`,
            title: name,
            color: data.Color || "#d1d5db",
            members: data.People || [],
            subdivisionId,
            subdivisionName: subdivisionInfo?.name,
            children
        };
    }
}

class ClanStructureFilter {
    public filter(node: StructureNode | null, showVacant: boolean): StructureNode | null {
        if (!node) return null;

        const filterNode = (n: StructureNode): StructureNode[] => {
            const filteredChildren = n.children.flatMap(child => filterNode(child));
            
            const isVacant = n.members.length === 0;
            if (!showVacant && isVacant) {
                return filteredChildren;
            }
            
            return [{
                ...n,
                children: filteredChildren
            }];
        };

        const result = filterNode(node);
        return result.length > 0 ? result[0] : null;
    }
}

const TreeNode = ({ node, showVacant }: { node: StructureNode; showVacant: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const membersCount = node.members.length;
    const isVacant = membersCount === 0;

    return (
        <li>
            <div className="flex flex-col items-center">
                <div 
                    className="relative bg-bg-primary border-2 p-4 min-w-[260px] max-w-[340px] group transition-all duration-300 hover:shadow-md select-none"
                    style={{ borderColor: node.color }}
                >
                    {node.subdivisionName && (
                        <div 
                            className="absolute -top-3 left-4 bg-black dark:bg-white text-white dark:text-black text-[9px] font-text-bold uppercase tracking-widest px-2 py-0.5 border" 
                            style={{ borderColor: node.color }}
                        >
                            {node.subdivisionName}
                        </div>
                    )}

                    <Link 
                        href={`/structure/roles/${encodeURIComponent(node.title.toLowerCase().replace(/ /g, "-"))}`}
                        className="block text-center font-header uppercase tracking-wider text-text-primary hover:text-accent transition-colors mb-2 mt-1 text-sm md:text-base"
                    >
                        {node.title}
                    </Link>

                    <div className="border-t border-black/10 dark:border-white/10 pt-2 flex flex-col items-center">
                        <button 
                            onClick={() => !isVacant && setIsExpanded(!isExpanded)}
                            className={`flex items-center gap-2 text-xs font-text uppercase tracking-widest transition-colors ${
                                isVacant 
                                    ? "text-white bg-red-600 px-2 py-0.5 font-text-bold cursor-default" 
                                    : "text-text-secondary hover:text-text-primary cursor-pointer"
                            }`}
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
                            className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                                isExpanded && !isVacant ? "max-h-[500px] mt-3 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                            <ul className="member-list flex flex-col gap-1 w-full text-xs font-text text-text-primary bg-black/5 dark:bg-white/5 p-2 border-l-2 border-accent">
                                {node.members.map((person, idx) => (
                                    <li key={idx} className="member-item py-1 border-b border-black/5 dark:border-white/5 last:border-0 text-left w-full flex items-center">
                                        <span>{person}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {node.children.length > 0 && (
                    <ul>
                        {node.children.map(child => (
                            <TreeNode key={child.id} node={child} showVacant={showVacant} />
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
    
    const viewportRef = useRef<HTMLDivElement>(null);
    const [dragState, setDragState] = useState({ isDragging: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

    const fullTree = useMemo(() => {
        const transformer = new ClanStructureTransformer(MOCK_SUBDIVISIONS_DATA);
        return transformer.transform(MOCK_ROLES_DATA);
    }, []);

    const filteredData = useMemo(() => {
        const filterer = new ClanStructureFilter();
        return filterer.filter(fullTree, showVacant);
    }, [fullTree, showVacant]);

const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!viewportRef.current) return;
        setDragState({
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            scrollLeft: viewportRef.current.scrollLeft,
            scrollTop: viewportRef.current.scrollTop
        });
    };

    const handleMouseLeave = () => {
        setDragState(prev => ({ ...prev, isDragging: false }));
    };

    const handleMouseUp = () => {
        setDragState(prev => ({ ...prev, isDragging: false }));
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!dragState.isDragging || !viewportRef.current) return;
        e.preventDefault();

        const walkX = (e.clientX - dragState.startX) * 1.5;
        const walkY = (e.clientY - dragState.startY) * 1.5;
        
        viewportRef.current.scrollLeft = dragState.scrollLeft - walkX;
        viewportRef.current.scrollTop = dragState.scrollTop - walkY;
    };

    return (
        <div className="w-full min-h-screen bg-bg-primary transition-colors duration-300 font-text pb-20 overflow-hidden flex flex-col">
            <MainHeader></MainHeader>
            <style>{`
                .org-tree {
                    --line-color: rgba(128, 128, 128, 0.4);
                }
                .org-tree ul {
                    display: flex;
                    justify-content: center;
                    padding-top: 30px;
                    position: relative;
                }
                .org-tree li {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    padding: 30px 20px 0 20px;
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
                    padding: 0 20px 0 20px;
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

                /* Изоляция и сброс стилей дерева для корректного отображения списка участников */
                .org-tree ul.member-list {
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: flex-start !important;
                    padding: 8px !important;
                    gap: 4px !important;
                }
                .org-tree ul.member-list::before {
                    display: none !important;
                }
                .org-tree li.member-item {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    padding: 4px 8px !important;
                }
                .org-tree li.member-item::before, .org-tree li.member-item::after {
                    display: none !important;
                }
            `}</style>

            <main className="max-w-[1400px] w-full mx-auto pt-32 px-6 flex-shrink-0">
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
                            <span className="text-sm font-text uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors selection:bg-transparent">
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
            </main>

            <div 
                ref={viewportRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`w-full flex-grow overflow-auto px-12 py-8 cursor-grab active:cursor-grabbing scroll-auto border-t border-black/5 dark:border-white/5 ${
                    dragState.isDragging ? "select-none" : ""
                }`}
            >
                <div className="org-tree min-w-max flex justify-center items-start min-h-full">
                    {filteredData ? (
                        <ul className="!pt-0">
                            <TreeNode node={filteredData} showVacant={showVacant} />
                        </ul>
                    ) : (
                        <div className="text-center text-text-secondary font-text uppercase tracking-widest py-20 w-full">
                            Нет данных для отображения
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}