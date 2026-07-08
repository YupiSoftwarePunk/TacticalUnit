"use client";

import Link from "next/link";
import { Save } from "lucide-react";

interface AssignFooterProps {
    onCancel: () => void;
    onAssign: () => void;
    selectedCount: number;
    isSaving: boolean;
    buttonText: string;
}

export const AssignFooter = ({ onCancel, onAssign, selectedCount, isSaving, buttonText }: AssignFooterProps) => {
    return (
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end mt-8 w-full">
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-border-secondary hover:bg-bg-secondary transition-colors font-text text-sm text-text-primary text-center w-full sm:w-auto cursor-pointer">
                Отменить
            </button>
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