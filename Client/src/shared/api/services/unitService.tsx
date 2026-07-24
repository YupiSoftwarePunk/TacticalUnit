import { apiClient } from "../api";


export const UnitService = {
    add: (options: RequestInit) => apiClient<IUnit[]>("/unit", options),
    getAll: () => apiClient<IUnit[]>("/unit"),
    getActualUnits: () => apiClient<IUnit[]>("/unit/actual"),

    getByDiscordId: (id: number | string) => apiClient<IUnit>(`/unit/${id}`),
    deleteByDiscordId: (id: number | string, docId: number | string) => 
        apiClient<void>(`/unit/${id}?doc=${docId}`),

    getStates: (id: number | string) => apiClient<IState[]>(`/unit/${id}/status`),
    appendStatus: (id: number | string, options : RequestInit, statusKey: number | string, docId?: number) => 
        apiClient<IState>(`/unit/${id}/status/${statusKey}${docId ? `?doc=${docId}` : ""}`, options),  //add | update status еще не закончен

    getActivity: (id: number | string) => apiClient<string[]>(`/unit/${id}/activity`),
    putActivity: (id: number | string, options : RequestInit) => 
        apiClient<Date>(`/unit/${id}/activity`, options),  // fix activity

    getPermissions: (UnitDiscordId: number | string) => 
        apiClient<IPermission[]>(`/unit/${UnitDiscordId}/permissions`), // получить все разрешения бойца.

    getDismissedUnits: () => apiClient<IUnit[]>(`/unit/dismissed`), 
    getRetiredUnits: () => apiClient<IUnit[]>(`/unit/retirement`), 
    
    getStateStory: (id : number | string) => apiClient<IUnitState[]>(`/unit/${id}/states`), 
    getEventStory: (id : number | string) => apiClient<ISingleDayEvent[]>(`/unit/${id}/events`), 

    getAvailableBg: (id : string) => apiClient<Map<string, string>>(`/unit/backgrounds`), 
    setUnitBg: (id : string, options : RequestInit) => 
        apiClient<Map<string, string>>(`/unit/backgrounds`, options), 
    getAvailableKit: (id : string) => apiClient<Map<string, string>>(`/unit/kits`), 
    setUnitKit: (id : string, options : RequestInit) => 
        apiClient<Map<string, string>>(`/unit/kits`, options), 

    getCanRank: () => apiClient<IUnit[]>("/unit/can/rank"),
    checkCanRankUnit: (targetDiscordId: number | string) => 
        apiClient<boolean>(`/unit/can/rank/${targetDiscordId}`),
    getCanPosts: () => apiClient<IPost[]>("/unit/can/posts"),
};