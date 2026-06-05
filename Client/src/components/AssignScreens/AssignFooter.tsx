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
        <div className="flex gap-4 justify-end mt-6">
            <Link
                href={cancelUrl}
                className="px-6 py-3 border border-border-secondary hover:bg-bg-secondary transition-colors font-text text-sm text-text-primary"
            >
                Отменить
            </Link>
            <button
                onClick={onAssign}
                disabled={selectedCount === 0 || isSaving}
                className="px-6 py-3 bg-accent text-black font-text-bold text-sm hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center"
            >
                <Save className="w-4 h-4" />
                {buttonText} ({selectedCount})
            </button>
        </div>
    );
};