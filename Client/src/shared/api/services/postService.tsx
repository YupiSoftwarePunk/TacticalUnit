import { apiClient } from "../api";


export const PostService = {
    add: (options: RequestInit) => apiClient<IPost[]>("/post", options),
    getAll: () => apiClient<IPost[]>("/post"),
    getById: (id: number) => apiClient<IPost>(`/post/${id}`),
    patchById: (id: number, options : RequestInit) => apiClient<IPost>(`/post/${id}`, options),
    deleteById: (id: number) => apiClient<IPost>(`/post/${id}`),
    getPermissions: (id: number) => apiClient<IPermission>(`/post/${id}/permission`),
    getDiscordRoleOf: (id: number) => apiClient<IPost>(`/post/${id}/discord-role`),
    patchDiscordRoleOf: (id: number, options : RequestInit) => apiClient<IPost>(`/post/${id}/discord-role`, options),
    
    getUnitsFromPostById: (id: number) => apiClient<IPost>(`/post/${id}/assign`),
    postUnitFromPostById: (id: number, options : RequestInit) => apiClient<IPost>(`/post/${id}/assign`, options),

    getUnitIforFromPostById: (id: number, UnitDiscordId : number) => apiClient<IPost>(`/post/${id}/assign/${UnitDiscordId}`),
    deletePostFromUnitById: (id: number, UnitDiscordId : number) => apiClient<IPost>(`/post/${id}/assign/${UnitDiscordId}`),
};