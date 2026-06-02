import { apiClient } from "../api";


export const RewardService = {
    add: (options: RequestInit) => apiClient<IReward[]>("/reward", options),
    getAll: () => apiClient<IReward[]>("/reward"),

    getById: (id: number) => apiClient<IReward>(`/reward/${id}`),
    patchById: (id: number, options : RequestInit) => apiClient<IReward>(`/reward/${id}`, options),

    getDiscordRoleOf: (id: number) => apiClient<IReward>(`/reward/${id}/discord-role`),
    patchDiscordRoleOf: (id: number, options : RequestInit) => apiClient<IReward>(`/reward/${id}/discord-role`, options),

};