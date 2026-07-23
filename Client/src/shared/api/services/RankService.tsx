import { apiClient } from "../api";


export const RankService = {
    add: (options: RequestInit) => apiClient<IRank[]>("/rank", options),
    getAll: () => apiClient<IRank[]>("/rank"),

    getById: (id: number | string) => apiClient<IRank>(`/rank/${id}`),
    deleteById: (id: number | string) => apiClient<void>(`/rank/${id}`),
    patchById: (id: number | string, options : RequestInit) => apiClient<IRank>(`/rank/${id}`, options),

    getPermissions: (id: number | string) => apiClient<IPermission[]>(`/rank/${id}/permission`),

    getDiscordRoleOf: (id: number | string) => apiClient<IRank>(`/rank/${id}/discord-role`),
    postDiscordRoleOf: (id: number | string, options : RequestInit) => apiClient<IRank>(`/rank/${id}/discord-role`, options),

    getAssigned: (id: number | string) => apiClient<IRank[]>(`/rank/${id}/assign`),
    assignToUnit: (id: number | string, unitDiscordId: string, options : RequestInit) => apiClient<IRank>(`/rank/${id}/assign/${unitDiscordId}`, options),
    getUnitAssignment: (id: number | string, unitId: number | string) => apiClient<IRank>(`/rank/${id}/assign/${unitId}`),

    // /api/v1/rank/{id-звания}/assign/{discord-id-бойца}?doc={id-документа}

};