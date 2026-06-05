import { apiClient } from "../api";


export const UnitService = {
    add: (options: RequestInit) => apiClient<IUnit[]>("/unit", options),
    getAll: () => apiClient<IUnit[]>("/unit"),

    getByDiscordId: (id: number) => apiClient<IUnit>(`/unit/${id}`),
    patchByDiscordId: (id: number, options : RequestInit) => apiClient<IUnit>(`/unit/${id}`, options),
    deleteByDiscordId: (id: number, options : RequestInit) => apiClient<void>(`/unit/${id}`, options),

    getStatuses: (id: number) => apiClient<IStatus[]>(`/unit/${id}/status`),
    putStatus: (id: number, options : RequestInit) => apiClient<IStatus>(`/unit/${id}/status`, options),  //add | update status
    
    getStatusById: (UnitId: number, StatusId : number) => apiClient<IStatus>(`/unit/${UnitId}/status/${StatusId}`), // Delete | Get
    terminateStatus: (id: number, StatusId : number, options : RequestInit) => apiClient<void>(`/unit/${id}/status/${StatusId}`, options),  //add | update status

    getActivity: (id: number) => apiClient<Date[]>(`/unit/${id}/activity`),
    putActivity: (id: number, options : RequestInit) => apiClient<Date>(`/unit/${id}/activity`, options),  // fix activity

    getPermissionsIds: (UnitDiscordId: number) => apiClient<number[]>(`/unit/${UnitDiscordId}/permission`), 

    getDismissedUnits: () => apiClient<IUnit[]>(`/unit/dismissed`), 
    getRetiredUnits: () => apiClient<IUnit[]>(`/unit/retirement`), 

    // их в документации нет
    // getDiscordRoleOf: (id: number) => apiClient<IUnit>(`/unit/${id}/discord-role`),
    // patchDiscordRoleOf: (id: number, options : RequestInit) => apiClient<IUnit>(`/unit/${id}/discord-role`, options),

    getUnitStateHistory: (id: number) => apiClient<IUnitState[]>(`/unit/${id}/states`),
    getUnitEventHistory: (id: number) => apiClient<ISingleDayEvent[]>(`/unit/${id}/events`),
};