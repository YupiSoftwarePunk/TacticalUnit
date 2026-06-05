import { apiClient } from "../api";


export const RankService = {
    add: (options: RequestInit) => apiClient<IRank[]>("/rank", options),
    getAll: () => apiClient<IRank[]>("/rank"),

    getById: (id: number) => apiClient<IRank>(`/rank/${id}`),
    deleteById: (id: number) => apiClient<IRank>(`/rank/${id}`),
    patchById: (id: number, options : RequestInit) => apiClient<IRank>(`/rank/${id}`, options),

    getPermissions: (id: number) => apiClient<IPermission[]>(`/rank/${id}/permission`),

    getDiscordRoleOf: (id: number) => apiClient<IRank>(`/rank/${id}/discord-role`),
    postDiscordRoleOf: (id: number, options : RequestInit) => apiClient<IRank>(`/rank/${id}/discord-role`, options),

    getUnitsOfRankByRankId: (id: number) => apiClient<IRank>(`/rank/${id}/assign`),
    postUnitById: (id: number, options : RequestInit) => apiClient<IRank>(`/rank/${id}/assign`, options),
    
    getUnitRankInfoById: (id: number, UnitDiscordId : number) => apiClient<IRank>(`/rank/${id}/discord-role/${UnitDiscordId}`),
};