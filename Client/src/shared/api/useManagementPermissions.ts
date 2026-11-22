"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UnitService } from "@/shared/api/services/unitService";

export function useManagementPermissions() {
    const { user } = useAuth();
    const [result, setResult] = useState<{ userId: string; permissions: number[] }>();

    useEffect(() => {
        let current = true;
        if (!user?.discord_id) return () => { current = false; };
        UnitService.getPermissions(user.discord_id).then((items) => {
            if (!current) return;
            const ids = (items as unknown[]).map(item => {
                if (item && typeof item === "object" && "id" in item) return Number(item.id);
                return Number(item);
            }).filter(Number.isInteger);
            setResult({ userId: user.discord_id, permissions: ids });
        }).catch(() => { if (current) setResult({ userId: user.discord_id, permissions: [] }); });
        return () => { current = false; };
    }, [user?.discord_id]);

    return (permission: number) => Boolean(user && result && result.userId === user.discord_id && (result.permissions.includes(1) || result.permissions.includes(permission)));
}
