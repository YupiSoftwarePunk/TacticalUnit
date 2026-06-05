import { apiClient } from "../api";


export const RewardService = {
    add: (options: RequestInit) => apiClient<IReward[]>("/reward", options),
    getAll: () => apiClient<IReward[]>("/reward"),

    getById: (id: number) => apiClient<IReward>(`/reward/${id}`),
    patchById: (id: number, options : RequestInit) => apiClient<IReward>(`/reward/${id}`, options),

    getDiscordRoleOf: (id: number) => apiClient<IReward>(`/reward/${id}/discord-role`),
    patchDiscordRoleOf: (id: number, options : RequestInit) => apiClient<IReward>(`/reward/${id}/discord-role`, options),

    getUnitsOfRewardByRewardId: (id: number) => apiClient<IRank>(`/reward/${id}/assign`),
    postUnitById: (id: number, options : RequestInit) => apiClient<IRank>(`/reward/${id}/assign`, options),
    
    getUnitRewardInfoById: (id: number, UnitDiscordId : number) => apiClient<IRank>(`/reward/${id}/discord-role${UnitDiscordId}`),
};