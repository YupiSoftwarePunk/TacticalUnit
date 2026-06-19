"use client";
import React from "react";

interface AssignInfoHeaderProps {
    title: string;
    description: string;
    mediaNode?: React.ReactNode;
}

export const AssignInfoHeader = ({ title, description, mediaNode }: AssignInfoHeaderProps) => {
    return (
        <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8">
                {mediaNode && (
                    <div className="w-full md:w-[200px] shrink-0">
                        {mediaNode}
                    </div>
                )}
                <div className="flex-1">
                    <div className="border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 mb-4">
                        <h1 className="text-accent font-text-bold uppercase tracking-wider text-lg">
                            {title}
                        </h1>
                    </div>
                    <div className="border border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4">
                        <p className="text-black dark:text-text-primary font-text text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};