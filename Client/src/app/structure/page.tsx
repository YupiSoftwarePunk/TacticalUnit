"use client";

import React, { useState, useMemo, useRef, MouseEvent, useEffect } from "react";
import Link from "next/link";
import { MainHeader } from "@/components/Header/MainHeader";
import { StructureService } from "@/shared/api/services/structureService";


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
                subdivisionId: post.subdivisionId || null,
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
            className="relative bg-bg-primary border-2 p-2.5 w-[180px] group transition-all duration-300 hover:shadow-sm select-none flex-shrink-0"
            style={{ borderColor: roleNode.color }}
        >
            <Link 
                href={`/posts/review-post/${roleNode.id.replace("role-", "")}`}
                className="block text-center font-text uppercase tracking-wider text-text-primary hover:text-accent transition-colors mb-1 mt-0.5 text-[11px] md:text-xs break-words"
            >
                {roleNode.title}
            </Link>

            <div className="border-t border-black/10 dark:border-white/10 pt-1 flex flex-col items-center">
                <button 
                    onClick={() => !isVacant && setIsExpanded(!isExpanded)}
                    className={`flex items-center gap-1 text-[10px] font-text uppercase tracking-widest transition-colors ${
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
                    <ul className="member-list flex flex-col gap-1 w-full text-[11px] font-text text-text-primary bg-black/5 dark:bg-white/5 p-1.5 border-l-2 border-accent">
                        {roleNode.members.map((person, idx) => (
                            <li key={idx} className="member-item py-0.5 border-b border-black/5 dark:border-white/5 last:border-0 text-left w-full flex items-center">
                                <span>{person}</span>
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

        let collectedChain: StructureNode[] = [node];
        let collectedExternal: StructureNode[] = [];

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
                        className="relative border-2 p-3 pt-5 flex flex-col gap-2.5 items-center bg-bg-primary transition-all duration-300"
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
            <MainHeader />
            <style>{`
                .org-tree { --line-color: rgba(128, 128, 128, 0.4); }
                .org-tree ul { display: flex; justify-content: center; padding-top: 16px; position: relative; }
                .org-tree li { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; padding: 16px 12px 0 12px; }
                .org-tree li::before, .org-tree li::after { content: ''; position: absolute; top: 0; width: 50%; height: 16px; border-top: 2px solid var(--line-color); }
                .org-tree li::before { right: 50%; border-right: 2px solid var(--line-color); }
                .org-tree li::after { left: 50%; border-left: 2px solid var(--line-color); }
                .org-tree li:only-child::before, .org-tree li:only-child::after { display: none; }
                .org-tree li:only-child { padding: 0 12px 0 12px; }
                .org-tree li:first-child::before, .org-tree li:last-child::after { border: 0 none; }
                .org-tree li:last-child::before { border-right: 2px solid var(--line-color); }
                .org-tree li:first-child::after { border-left: 2px solid var(--line-color); }
                .org-tree ul ul::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); border-left: 2px solid var(--line-color); width: 0; height: 16px; }
                .org-tree ul.member-list { display: flex !important; flex-direction: column !important; justify-content: flex-start !important; padding: 6px !important; gap: 2px !important; }
                .org-tree ul.member-list::before { display: none !important; }
                .org-tree li.member-item { flex: none !important; display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; padding: 2px 4px !important; }
                .org-tree li.member-item::before, .org-tree li.member-item::after { display: none !important; }
            `}</style>

            <main className="max-w-[1400px] w-full mx-auto pt-28 px-6 flex-shrink-0">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-header text-text-primary uppercase tracking-wider">
                            Структура клана
                        </h1>
                        <span className="block w-16 h-1 bg-accent mt-2"></span>
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
                            <span className="text-xs font-text uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors selection:bg-transparent">
                                Показывать вакантные должности
                            </span>
                        </label>

                        {hasAdminPermission && (
                            <div className="flex gap-4">
                                <Link href="/subdivisions/create-subdivision">
                                    <button className="relative group inline-block">
                                        <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                                        <div className="relative border border-border-secondary bg-bg-primary px-3 py-1.5 text-[10px] font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black">
                                            Создать подразделение
                                        </div>
                                    </button>
                                </Link>

                                <Link href="/posts/create-post">
                                    <button className="relative group inline-block">
                                        <div className="absolute inset-0 bg-accent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                                        <div className="relative border border-border-secondary bg-bg-primary px-3 py-1.5 text-[10px] font-text-bold text-text-primary uppercase tracking-widest transition-colors group-hover:bg-accent group-hover:text-black">
                                            Создать должность
                                        </div>
                                    </button>
                                </Link>
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
                className={`w-full flex-grow overflow-auto px-12 py-6 cursor-grab active:cursor-grabbing scroll-auto border-t border-black/5 dark:border-white/5 ${
                    dragState.isDragging ? "select-none" : ""
                }`}
            >
                <div className="org-tree min-w-max flex justify-center items-start min-h-full">
                    {loading ? (
                        <div className="text-center text-text-secondary font-text uppercase tracking-widest py-20 w-full animate-pulse">
                            Загрузка данных из штаба...
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 font-text uppercase tracking-widest py-20 w-full">
                            Ошибка: {error}
                        </div>
                    ) : filteredData ? (
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