import { apiClient } from "../api";


export const PostService = {
    add: (options: RequestInit) => apiClient<IPost[]>("/post", options),
    getAll: () => apiClient<IPost[]>("/post"),
    getById: (id: number | string) => apiClient<IPost>(`/post/${id}`),
    patchById: (id: number | string, options : RequestInit) => apiClient<IPost>(`/post/${id}`, options),
    deleteById: (id: number | string) => apiClient<void>(`/post/${id}`),

    getPermissions: (id: number | string) => apiClient<IPermission>(`/post/${id}/permission`),

    getDiscordRoleOf: (id: number | string) => apiClient<IPost>(`/post/${id}/discord-role`),
    postDiscordRoleOf: (id: number | string, options : RequestInit) => apiClient<IPost>(`/post/${id}/discord-role`, options),

    getAssigned: (id: number | string) => apiClient<IAssignedReward[]>(`/post/${id}/assign`),
    assignToUnit: (id: number | string, options: RequestInit) => apiClient<IAssignedReward>(`/post/${id}/assign`, options),
    getUnitAssignment: (id: number | string, unitId: number | string) => apiClient<IAssignedReward>(`/post/${id}/assign/${unitId}`),
    deleteUnitAssignment: (id: number | string, unitId: number | string) => apiClient<IAssignedReward>(`/post/${id}/assign/${unitId}`),
};