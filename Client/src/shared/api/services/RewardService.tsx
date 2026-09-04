import { apiClient, getBaseURL } from "../api";
import axios from "axios";


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
    patchById: (id: string, options?: RequestInit) => apiClient<{ message: string }>(`/reward/${id}`, {
        method: "PATCH",
        ...options
    }),

    getActual: () => apiClient<IReward[]>("/reward/actual"),

    getDiscordRoleOf: (id: string) => apiClient<string>(`/reward/${id}/discord-role`),
    postDiscordRoleOf: (id: string, options?: RequestInit) => apiClient<{ message: string }>(`/reward/${id}/discord-role`, {
        method: "POST",
        ...options
    }),

    getAssigned: (id: string) => apiClient<IAssignedReward[]>(`/reward/${id}/assign`),
    assignToUnit: (id: string, unitId: string, docId?: number) => {
        const query = docId ? `?doc=${docId}` : "";
        return apiClient<IAssignedReward>(`/reward/${id}/assign/${unitId}${query}`, {
            method: "POST",
        });
    },

    AssignRewards: (act : IRewardAssignAct) => {
        return axios.post(`${getBaseURL()}/reward/assign`, act)
    },

    getUnitAssignment: (id: string, unitId: string) => apiClient<IAssignedReward>(`/reward/${id}/assign/${unitId}`),
};