import { apiClient } from "../api";


export const RewardService = {
    add: (data: IReward) => apiClient<IReward>("/reward", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }),
    getAll: () => apiClient<IReward[]>("/reward"),

    getById: (id: number) => apiClient<IReward>(`/reward/${id}`),
    patchById: (id: number, options : RequestInit) => apiClient<IReward>(`/reward/${id}`, options),

    getDiscordRoleOf: (id: number) => apiClient<IReward>(`/reward/${id}/discord-role`),
    postDiscordRoleOf: (id: number, options : RequestInit) => apiClient<IReward>(`/reward/${id}/discord-role`, options),

    getAssigned: (id: number) => apiClient<IAssignedReward[]>(`/reward/${id}/assign`),
    assignToUnit: (id: number, data: { discordId: string }) => apiClient<IAssignedReward>(`/reward/${id}/assign`, {
        method: "POST",
        body: JSON.stringify({ discordId: String(data.discordId) })
    }),
    getUnitAssignment: (id: number, unitId: string) => apiClient<IAssignedReward>(`/reward/${id}/assign/${unitId}`),
};