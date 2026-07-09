"use client";

import React, { useState, useMemo, useRef, MouseEvent, TouchEvent, useEffect } from "react";
import Link from "next/link";
import { MainHeader } from "@/components/Header/MainHeader";
import { StructureService } from "@/shared/api/services/structureService";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

class ApiStructureTransformer {
    public static buildTree(posts: IPost[]): StructureNode | null {
        if (!posts || posts.length === 0) return null;
        const nodeMap: Record<string, StructureNode> = {};

        posts.forEach((post) => {
            if (!post.id) return;

            const members = post.units?.map(u => u.nickname) || [];
            
            nodeMap[post.id] = {
                id: `role-${post.id}`,
                title: post.name,
                color: post.color || "#d1d5db",
                members: members,
                subdivisionId: (Number)(post.subdivisionId) || null,
                subdivisionName: post.subdivision?.name,
                subdivisionColor: post.subdivision?.color,
                children: []
            };
        });

        let root: StructureNode | null = null;

        posts.forEach((post) => {
            if (!post.id) return;
            const currentNode = nodeMap[post.id];
            if (post.headId && nodeMap[post.headId.toString()]) {
                nodeMap[post.headId.toString()].children.push(currentNode);
            } 
            else {
                if (!root) {
                    root = currentNode;
                }
            }
        });
        return root;
    }
}

class ClanStructureFilter {
    public filter(node: StructureNode | null, showVacant: boolean): StructureNode | null {
        if (!node) return null;

        const filterNode = (n: StructureNode): StructureNode[] => {
            const filteredChildren = n.children.flatMap(child => this.filter(child, showVacant) || []);
            
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

const SingleCard = ({ roleNode }: { roleNode: StructureNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const membersCount = roleNode.members.length;
    const isVacant = membersCount === 0;

    return (
        <div 
            className="relative bg-bg-primary border-2 p-2.5 w-[160px] md:w-[180px] group transition-all duration-300 hover:shadow-sm select-none flex-shrink-0"
            style={{ borderColor: roleNode.color }}
        >
            <Link 
                href={`/posts/review-post/${roleNode.id.replace("role-", "")}`}
                className="block text-center font-text uppercase tracking-wider text-text-primary hover:text-accent transition-colors mb-1 mt-0.5 text-[10px] md:text-xs break-words"
            >
                {roleNode.title}
            </Link>

            <div className="border-t border-black/10 dark:border-white/10 pt-1 flex flex-col items-center">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isVacant) setIsExpanded(!isExpanded);
                    }}
                    className={`flex items-center gap-1 text-[9px] md:text-[10px] font-text uppercase tracking-widest transition-colors ${
                        isVacant 
                            ? "text-white bg-red-600 px-1 py-0.2 font-text-bold cursor-default" 
                            : "text-text-secondary hover:text-text-primary cursor-pointer"
                    }`}
                >
                    <span>{isVacant ? "Вакантно" : `${membersCount} чел.`}</span>
                    {!isVacant && (
                        <svg 
                            className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </button>
                <div 
                    className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded && !isVacant ? "max-h-[500px] mt-1.5 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <ul className="member-list flex flex-col gap-1 w-full text-[10px] md:text-[11px] font-text text-text-primary bg-black/5 dark:bg-white/5 p-1.5 border-l-2 border-accent">
                        {roleNode.members.map((person, idx) => (
                            <li key={idx} className="member-item py-0.5 border-b border-black/5 dark:border-white/5 last:border-0 text-left w-full flex items-center">
                                <span className="truncate">{person}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const TreeNode = ({ node, showVacant }: { node: StructureNode; showVacant: boolean }) => {
    const { chain, externalChildren } = useMemo(() => {
        const subId = node.subdivisionId;
        if (subId === null || subId === undefined) {
            return { chain: [node], externalChildren: node.children };
        }

        const collectedChain: StructureNode[] = [node];
        const collectedExternal: StructureNode[] = [];

        const traverse = (currentNode: StructureNode) => {
            currentNode.children.forEach(child => {
                if (child.subdivisionId === subId) {
                    collectedChain.push(child);
                    traverse(child);
                } else {
                    collectedExternal.push(child);
                }
            });
        };

        traverse(node);
        return { chain: collectedChain, externalChildren: collectedExternal };
    }, [node]);

    const hasSubdivision = node.subdivisionId !== null && node.subdivisionId !== undefined;
    const frameColor = node.subdivisionColor || "#4b5563";

    return (
        <li>
            <div className="flex flex-col items-center">
                {hasSubdivision ? (
                    <div 
                        className="relative border-2 p-2 md:p-3 pt-5 flex flex-col gap-2.5 items-center bg-bg-primary transition-all duration-300"
                        style={{ borderColor: frameColor }}
                    >
                        <Link 
                            href={`/subdivisions/review-subdivision/${node.subdivisionId}`}
                            className="absolute -top-2 left-2 bg-black dark:bg-white text-white dark:text-black hover:text-accent dark:hover:text-accent text-[8px] font-text-bold uppercase tracking-widest px-1 py-0.5 border transition-colors duration-300" 
                            style={{ borderColor: frameColor }}
                        >
                            {node.subdivisionName}
                        </Link>
                        {chain.map(roleNode => (
                            <SingleCard key={roleNode.id} roleNode={roleNode} />
                        ))}
                    </div>
                ) : (
                    <SingleCard roleNode={node} />
                )}

                {externalChildren.length > 0 && (
                    <ul>
                        {externalChildren.map(child => (
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
    const [zoom, setZoom] = useState<number>(1);

    const [rawPosts, setRawPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        StructureService.get()
            .then((res: any) => {
                const postsData = Array.isArray(res) ? res : res?.value || [];
                setRawPosts(postsData);
                setError(null);
            })
            .catch((err) => {
                console.error("Ошибка загрузки структуры:", err);
                setError(err.message || "Не удалось загрузить структуру клана");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const viewportRef = useRef<HTMLDivElement>(null);
    const [dragState, setDragState] = useState({ isDragging: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

    const fullTree = useMemo(() => {
        return ApiStructureTransformer.buildTree(rawPosts);
    }, [rawPosts]);

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

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!dragState.isDragging || !viewportRef.current) return;
        e.preventDefault();

        const walkX = (e.clientX - dragState.startX) * 1.2;
        const walkY = (e.clientY - dragState.startY) * 1.2;
        
        viewportRef.current.scrollLeft = dragState.scrollLeft - walkX;
        viewportRef.current.scrollTop = dragState.scrollTop - walkY;
    };

    const handleMouseUpOrLeave = () => {
        setDragState(prev => ({ ...prev, isDragging: false }));
    };

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (!viewportRef.current || e.touches.length > 1) return;
        const touch = e.touches[0];
        setDragState({
            isDragging: true,
            startX: touch.clientX,
            startY: touch.clientY,
            scrollLeft: viewportRef.current.scrollLeft,
            scrollTop: viewportRef.current.scrollTop
        });
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (!dragState.isDragging || !viewportRef.current) return;
        
        const touch = e.touches[0];
        const walkX = (touch.clientX - dragState.startX) * 1.5;
        const walkY = (touch.clientY - dragState.startY) * 1.5;
        
        viewportRef.current.scrollLeft = dragState.scrollLeft - walkX;
        viewportRef.current.scrollTop = dragState.scrollTop - walkY;
    };

    const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));
    const resetZoom = () => setZoom(1);

    return (
        <div className="w-full h-screen bg-bg-primary transition-colors duration-300 font-text flex flex-col overflow-hidden">
            <MainHeader />
            <style>{`
                .org-tree { --line-color: rgba(128, 128, 128, 0.4); }
                .org-tree ul { display: flex; justify-content: center; padding-top: 16px; position: relative; }
                .org-tree li { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; padding: 16px 10px 0 10px; }
                .org-tree li::before, .org-tree li::after { content: ''; position: absolute; top: 0; width: 50%; height: 16px; border-top: 2px solid var(--line-color); }
                .org-tree li::before { right: 50%; border-right: 2px solid var(--line-color); }
                .org-tree li::after { left: 50%; border-left: 2px solid var(--line-color); }
                .org-tree li:only-child::before, .org-tree li:only-child::after { display: none; }
                .org-tree li:only-child { padding: 0 10px 0 10px; }
                .org-tree li:first-child::before, .org-tree li:last-child::after { border: 0 none; }
                .org-tree li:last-child::before { border-right: 2px solid var(--line-color); }
                .org-tree li:first-child::after { border-left: 2px solid var(--line-color); }
                .org-tree ul ul::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); border-left: 2px solid var(--line-color); width: 0; height: 16px; }
                .org-tree ul.member-list { display: flex !important; flex-direction: column !important; justify-content: flex-start !important; padding: 6px !important; gap: 2px !important; }
                .org-tree ul.member-list::before { display: none !important; }
                .org-tree li.member-item { flex: none !important; display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; padding: 2px 4px !important; }
                .org-tree li.member-item::before, .org-tree li.member-item::after { display: none !important; }
            `}</style>

            <main className="w-full mx-auto pt-20 md:pt-28 px-4 md:px-6 flex-shrink-0 max-w-[1400px]">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 md:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-header text-text-primary uppercase tracking-wider">
                            Структура полка
                        </h1>
                        <span className="block w-16 h-1 bg-accent mt-2"></span>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 w-full lg:w-auto justify-between">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex-shrink-0">
                                <input 
                                    type="checkbox" 
                                    className="sr-only"
                                    checked={showVacant}
                                    onChange={(e) => setShowVacant(e.target.checked)}
                                />
                                <div className={`w-10 h-6 border-2 border-text-primary transition-colors ${showVacant ? 'bg-accent border-accent' : 'bg-transparent'}`}></div>
                                <div className={`absolute top-1 w-3 h-3 bg-text-primary transition-transform duration-300 ${showVacant ? 'translate-x-5 bg-black' : 'translate-x-1'}`}></div>
                            </div>
                            <span className="text-[10px] md:text-xs font-text uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors selection:bg-transparent">
                                Показать вакантные места
                            </span>
                        </label>

                        {hasAdminPermission && (
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                                <Link href="/subdivisions/create-subdivision" className="w-full sm:w-auto">
                                    <button className="relative group inline-block w-full">
                                        <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                                        <div className="relative border border-border-secondary bg-bg-primary px-3 py-2 sm:py-1.5 text-[10px] font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black text-center whitespace-nowrap">
                                            Создать Подразделение
                                        </div>
                                    </button>
                                </Link>

                                <Link href="/posts/create-post" className="w-full sm:w-auto">
                                    <button className="relative group inline-block w-full">
                                        <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                                        <div className="relative border border-border-secondary bg-bg-primary px-3 py-2 sm:py-1.5 text-[10px] font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black text-center whitespace-nowrap">
                                            Создать Должность
                                        </div>
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <div className="relative flex-grow w-full border-t border-black/5 dark:border-white/5 bg-bg-secondary/10 overflow-hidden">
                <div className="absolute bottom-4 right-4 z-40 flex flex-col gap-2">
                    <button 
                        onClick={zoomIn}
                        className="p-2.5 bg-bg-primary border-2 border-text-primary text-text-primary hover:bg-accent hover:text-black transition-colors active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        title="Приблизить">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={zoomOut}
                        className="p-2.5 bg-bg-primary border-2 border-text-primary text-text-primary hover:bg-accent hover:text-black transition-colors active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        title="Отдалить">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={resetZoom}
                        className="p-2.5 bg-bg-primary border-2 border-text-primary text-text-primary hover:bg-accent hover:text-black transition-colors active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        title="Исходный размер"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>

                <div 
                    ref={viewportRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUpOrLeave}
                    className={`w-full h-full overflow-auto px-6 md:px-12 py-8 cursor-grab active:cursor-grabbing custom-scrollbar ${
                        dragState.isDragging ? "select-none" : ""
                    }`}
                >

                    <div 
                        className="org-tree min-w-max flex justify-center items-start min-h-full origin-top transition-transform duration-150 ease-out"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        {loading ? (
                            <div className="text-center text-text-secondary font-text uppercase tracking-widest py-20 w-full animate-pulse text-xs">
                                Загрузка данных из штаба...
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 font-text uppercase tracking-widest py-20 w-full text-xs">
                                Ошибка: {error}
                            </div>
                        ) : filteredData ? (
                            <ul className="!pt-0">
                                <TreeNode node={filteredData} showVacant={showVacant} />
                            </ul>
                        ) : (
                            <div className="text-center text-text-secondary font-text uppercase tracking-widest py-20 w-full text-xs">
                                Нет данных для отображения
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}