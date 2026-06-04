import { apiClient } from "../api";


export const PostService = {
    add: (options: RequestInit) => apiClient<IPost[]>("/post", options),
    getAll: () => apiClient<IPost[]>("/post"),
    getById: (id: number) => apiClient<IPost>(`/post/${id}`),
    patchById: (id: number, options : RequestInit) => apiClient<IPost>(`/post/${id}`, options),
    getPermissions: (id: number) => apiClient<IPermission>(`/post/${id}/permission`),
    getDiscordRoleOf: (id: number) => apiClient<IPost>(`/post/${id}/discord-role`),
    patchDiscordRoleOf: (id: number, options : RequestInit) => apiClient<IPost>(`/post/${id}/discord-role`, options),

    getAssigned: (id: number) => apiClient<IAssignedReward[]>(`/post/${id}/assign`),
    assignToUnit: (id: number, options: RequestInit) => apiClient<IAssignedReward>(`/post/${id}/assign`, options),
    getUnitAssignment: (id: number, unitId: number) => apiClient<IAssignedReward>(`/post/${id}/assign/${unitId}`),
    deleteUnitAssignment: (id: number, unitId: number) => apiClient<IAssignedReward>(`/post/${id}/assign/${unitId}`),
};