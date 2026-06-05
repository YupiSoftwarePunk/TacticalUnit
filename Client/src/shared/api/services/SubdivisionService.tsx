import { apiClient } from "../api";


export const SubdivisionService = {
    add: (options: RequestInit) => apiClient<ISubdivision[]>("/subdivision", options),
    getAll: () => apiClient<ISubdivision[]>("/subdivision"),

    getById: (id: number) => apiClient<ISubdivision>(`/subdivision/${id}`),
    patchById: (id: number, options : RequestInit) => apiClient<ISubdivision>(`/subdivision/${id}`, options),
    deleteById: (id: number) => apiClient<ISubdivision>(`/subdivision/${id}`),

    getPermissions: (id: number) => apiClient<IPermission[]>(`/subdivision/${id}/permission`),

    getDiscordRoleOf: (id: number) => apiClient<ISubdivision>(`/subdivision/${id}/discord-role`),
    patchDiscordRoleOf: (id: number, options : RequestInit) => apiClient<ISubdivision>(`/subdivision/${id}/discord-role`, options),

};