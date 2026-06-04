import { apiClient } from "../api";


export const RankService = {
    add: (options: RequestInit) => apiClient<IRank[]>("/rank", options),
    getAll: () => apiClient<IRank[]>("/rank"),

    getById: (id: number) => apiClient<IRank>(`/rank/${id}`),
    deleteById: (id: number) => apiClient<IRank>(`/rank/${id}`),
    patchById: (id: number, options : RequestInit) => apiClient<IRank>(`/rank/${id}`, options),

    getPermissions: (id: number) => apiClient<IPermission[]>(`/rank/${id}/permission`),

    getDiscordRoleOf: (id: number) => apiClient<IRank>(`/rank/${id}/discord-role`),
    patchDiscordRoleOf: (id: number, options : RequestInit) => apiClient<IRank>(`/rank/${id}/discord-role`, options),

    getAssigned: (id: number) => apiClient<IAssignedReward[]>(`/rank/${id}/assign`),
    assignToUnit: (id: number, options: RequestInit) => apiClient<IAssignedReward>(`/rank/${id}/assign`, options),
    getUnitAssignment: (id: number, unitId: number) => apiClient<IAssignedReward>(`/rank/${id}/assign/${unitId}`),
};