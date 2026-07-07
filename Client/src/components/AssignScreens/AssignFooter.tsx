"use client";

import Link from "next/link";
import { Save } from "lucide-react";

interface AssignFooterProps {
    cancelUrl: string;
    onAssign: () => void;
    selectedCount: number;
    isSaving: boolean;
    buttonText: string;
}

export const AssignFooter = ({ cancelUrl, onAssign, selectedCount, isSaving, buttonText }: AssignFooterProps) => {
    return (
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end mt-8 w-full">
            <Link
                href={cancelUrl}
                className="px-6 py-3 border border-border-secondary hover:bg-bg-secondary transition-colors font-text text-sm text-text-primary text-center w-full sm:w-auto"
            >
                Отменить
            </Link>
            <button
                onClick={onAssign}
                disabled={selectedCount === 0 || isSaving}
                className="px-6 py-3 bg-accent text-black font-text-bold text-sm hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center justify-center w-full sm:w-auto">
                <Save className="w-4 h-4" />
                <span>
                    {buttonText} {selectedCount > 0 && `(${selectedCount})`}
                </span>
            </button>
        </div>
    );
};