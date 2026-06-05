import { apiClient } from "../api";


export const UnitService = {
    add: (options: RequestInit) => apiClient<IUnit[]>("/unit", options),
    getAll: () => apiClient<IUnit[]>("/unit"),
    getByDiscordId: (id: number) => apiClient<IUnit>(`/unit/${id}`),
    patchByDiscordId: (id: number, options : RequestInit) => apiClient<IUnit>(`/unit/${id}`, options),

    getStatuses: (id: number) => apiClient<IState[]>(`/unit/${id}/status`),
    putStatus: (id: number, options : RequestInit) => apiClient<IState>(`/unit/${id}/status`, options),  //add | update status
    
    StatusById: (UnitId: number, StatusId : number) => apiClient<IState[]>(`/unit/${UnitId}/status/${StatusId}`), // Delete | Get
    //terminateStatus: (id: number, options : RequestInit) => apiClient<IStatus>(`/unit/${id}/status`, options),  //add | update status

    getActivity: (id: number) => apiClient<Date[]>(`/unit/${id}/activity`),
    putActivity: (id: number, options : RequestInit) => apiClient<Date>(`/unit/${id}/activity`, options),  // fix activity

    getPermissionsIds: (UnitDiscordId: number) => apiClient<Date>(`/unit/${UnitDiscordId}/permission`), 

    getDismissedUnits: () => apiClient<Date>(`/unit-dismissed`), 
    getRetiredUnits: () => apiClient<Date>(`/unit-retirement`), 

    getDiscordRoleOf: (id: number) => apiClient<IUnit>(`/unit/${id}/discord-role`),
    patchDiscordRoleOf: (id: number, options : RequestInit) => apiClient<IUnit>(`/unit/${id}/discord-role`, options),

};