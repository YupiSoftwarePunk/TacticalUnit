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

    getById: (id: string) => apiClient<IReward>(`/reward/${id}`),
    patchById: (id: string, options : RequestInit) => apiClient<IReward>(`/reward/${id}`, options),

    getDiscordRoleOf: (id: string) => apiClient<IReward>(`/reward/${id}/discord-role`),
    postDiscordRoleOf: (id: string, options : RequestInit) => apiClient<IReward>(`/reward/${id}/discord-role`, options),

    getAssigned: (id: string) => apiClient<IAssignedReward[]>(`/reward/${id}/assign`),
    assignToUnit: (id: string, data: { discordId: string }) => apiClient<IAssignedReward>(`/reward/${id}/assign`, {
        method: "POST",
        body: JSON.stringify({ discordId: String(data.discordId) })
    }),
    getUnitAssignment: (id: string, unitId: string) => apiClient<IAssignedReward>(`/reward/${id}/assign/${unitId}`),

    // get /api/v1/reward/actual  именно это отображать на витрине, и есть чекбокс чтобы отображались все

    // /api/v1/reward/{id-награды}/assign?doc={id-документа} 
};