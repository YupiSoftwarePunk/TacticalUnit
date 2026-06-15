import { apiClient } from "../api";


export const UnitService = {
    add: (options: RequestInit) => apiClient<IUnit[]>("/unit", options),
    getAll: () => apiClient<IUnit[]>("/unit"),

    getByDiscordId: (id: number | string) => apiClient<IUnit>(`/unit/${id}`),
    patchByDiscordId: (id: number | string, options : RequestInit) => apiClient<IUnit>(`/unit/${id}`, options),
    deleteByDiscordId: (id: number | string) => apiClient<void>(`/unit/${id}`),

    getStates: (id: number | string) => apiClient<IState[]>(`/unit/${id}/status`),
    putStatus: (id: number | string, options : RequestInit) => apiClient<IState>(`/unit/${id}/status`, options),  //add | update status
    
    StatusById: (UnitId: number | string, StatusId : number | string) => apiClient<IState[]>(`/unit/${UnitId}/status/${StatusId}`), // Delete | Get
    terminateStatus: (id: number | string, options : RequestInit) => apiClient<void>(`/unit/${id}/status`, options),  //add | update status

    getActivity: (id: number | string) => apiClient<string[]>(`/unit/${id}/activity`),
    putActivity: (id: number | string, options : RequestInit) => apiClient<Date>(`/unit/${id}/activity`, options),  // fix activity

    getPermissionsIds: (UnitDiscordId: number | string) => apiClient<number[]>(`/unit/${UnitDiscordId}/permission`), 

    getDismissedUnits: () => apiClient<IUnit[]>(`/unit-dismissed`), 
    getRetiredUnits: () => apiClient<IUnit[]>(`/unit-retirement`), 
    
    getStateStory: (id : number | string) => apiClient<IUnitState[]>(`/api/unit/${id}/states`), 
    getEventStory: (id : number | string) => apiClient<ISingleDayEvent[]>(`/api/unit/${id}/events`), 
};