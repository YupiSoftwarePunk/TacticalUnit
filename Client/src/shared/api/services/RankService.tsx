import { apiClient } from "../api";


export const RankService = {
    add: (options: RequestInit) => apiClient<IRank[]>("/rank", { method: "POST", ...options }),
    getAll: () => apiClient<IRank[]>("/rank"),

    getById: (id: number | string) => apiClient<IRank>(`/rank/${id}`),
    deleteById: (id: number | string) => apiClient<void>(`/rank/${id}`, { method: "DELETE" }),
    patchById: (id: number | string, options: RequestInit) => apiClient<IRank>(`/rank/${id}`, { method: "PATCH", ...options }),

    getPermissions: (id: number | string) => apiClient<IPermission[]>(`/rank/${id}/permission`),

    getDiscordRoleOf: (id: number | string) => apiClient<IRank>(`/rank/${id}/discord-role`),
    postDiscordRoleOf: (id: number | string, options: RequestInit) => apiClient<IRank>(`/rank/${id}/discord-role`, { method: "POST", ...options }),

    getAssigned: (id: number | string) => apiClient<IRank[]>(`/rank/${id}/assign`),
    assignToUnit: (id: number | string, unitId: string, docId?: number) => {
        const query = docId ? `?doc=${docId}` : "";
        return apiClient<IAssignedReward>(`/reward/${id}/assign/${unitId}${query}`, {
            method: "POST",
        });
    },
    getUnitAssignment: (id: number | string, unitId: number | string) => apiClient<IRank>(`/rank/${id}/assign/${unitId}`),
};