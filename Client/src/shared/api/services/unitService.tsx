import { apiClient } from "../api";


export const UnitService = {
    add: (options: RequestInit) => apiClient<IUnit[]>("/unit", options),
    getAll: () => apiClient<IUnit[]>("/unit"),

    getByDiscordId: (id: number) => apiClient<IUnit>(`/unit/${id}`),
    patchByDiscordId: (id: number, options : RequestInit) => apiClient<IUnit>(`/unit/${id}`, options),
    deleteByDiscordId: (id: number) => apiClient<void>(`/unit/${id}`),

    getStatuses: (id: number) => apiClient<IState[]>(`/unit/${id}/status`),
    putStatus: (id: number, options : RequestInit) => apiClient<IState>(`/unit/${id}/status`, options),  //add | update status
    
    StatusById: (UnitId: number, StatusId : number) => apiClient<IState[]>(`/unit/${UnitId}/status/${StatusId}`), // Delete | Get
    terminateStatus: (id: number, options : RequestInit) => apiClient<void>(`/unit/${id}/status`, options),  //add | update status

    getActivity: (id: number) => apiClient<Date[]>(`/unit/${id}/activity`),
    putActivity: (id: number, options : RequestInit) => apiClient<Date>(`/unit/${id}/activity`, options),  // fix activity

    getPermissionsIds: (UnitDiscordId: number) => apiClient<number[]>(`/unit/${UnitDiscordId}/permission`), 

    getDismissedUnits: () => apiClient<IUnit[]>(`/unit-dismissed`), 
    getRetiredUnits: () => apiClient<IUnit[]>(`/unit-retirement`), 
    
    getStateStory: (id : number) => apiClient<IUnitStatus[]>(`/api/unit/${id}/states`), 
    getEventStory: (id : number) => apiClient<ISingleDayEvent[]>(`/api/unit/${id}/events`), 
};