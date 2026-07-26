import { apiClient } from "../api";


export const SubdivisionService = {
    add: (options: RequestInit) => apiClient<ISubdivision[]>("/subdivision", { method: "POST", ...options }),
    getAll: () => apiClient<ISubdivision[]>("/subdivision"),

    getById: (id: number) => apiClient<ISubdivision>(`/subdivision/${id}`),
    patchById: (id: number, options: RequestInit) => apiClient<ISubdivision>(`/subdivision/${id}`, { method: "PATCH", ...options }),
    deleteById: (id: number) => apiClient<void>(`/subdivision/${id}`, { method: "DELETE" }),

    getPermissions: (id: number) => apiClient<IPermission[]>(`/subdivision/${id}/permission`),

    getDiscordRoleOf: (id: number) => apiClient<ISubdivision>(`/subdivision/${id}/discord-role`),
    postDiscordRoleOf: (id: number, options: RequestInit) => apiClient<ISubdivision>(`/subdivision/${id}/discord-role`, { method: "POST", ...options }),
};