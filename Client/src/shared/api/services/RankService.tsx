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

};