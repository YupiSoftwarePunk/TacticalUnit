// тут будут содержаться типы для всех ендпоинтов, которые есть в бэке, чтобы не плодить их по всему проекту и не держать в голове, какие там есть поля и т.д.
// эти типы будут использоваться в сервисах, которые будут обращаться к бэку, а также в компонентах, которые будут отображать эти данные


enum PermissionType{
    ConfirmActivity = 1,
    VacationAccess = 2,
    GiveReprimandGratitude = 3,
    ForceVacation = 4,
    ChangeRanks = 5,
    ChangePosts = 6,
    AssignRewards = 7,
    ManageStructure = 8,
    ManageRewards = 9,
    ManageDocTypes = 10,
    Administrator = 11,
    ModerateNicknames = 12,
    SteamIdView = 13,
    AutoReprimandImmune = 14
}

interface ISubdivision{
    Id? : number,
    Description : string,
    AppendHeadName : boolean,
    Posts : IPost[],
    HeadId? : number,
    Head? : ISubdivision,
    Subordinates : ISubdivision[],
    GivedPermissions : IGivedPermission[],
    Color : string,
    Name : string,
    DiscordRoleId? : string
}

interface IRank{
    Id? : number,
    CounterToReach : number,
    PreviousId? : number,
    Previous? : IRank,
    NextId? : number,
    Next? : IRank,
    Units? : IUnit[],
    Color : string,
    Name : string,
    RankChevronURL? : string,
    GivedPermissions : IGivedPermission[],
    DiscordRoleId? : number
}

interface IPost{
    Id? : number,
    Description : string,
    SubdivisionId? : number,
    Subdivision? : ISubdivision,
    AppendSubdivisionName : boolean,
    HeadId? : number,
    Head? : IPost,
    MaxRank : IRank,
    Units? : IUnit[],
    Color : string,
    Name : string,
    GivedPermissions : IGivedPermission[],
    DiscordRoleId? : string
}
interface IDocType{
    Id? : number,
    Name : string,
    Description : string,
    TemplatePath? : string,
    Docs : IDoc[]
}
interface IDoc{
    Id? : number,
    Name : string,
    FilePath : string,
    DocType? : IDocType,
    Author : IUnit,
    Units : IUnit[]
}
interface IReward{
    Id? : number,
    Conditions : string,
    Privileges : string,
    ImagePath? : string,
    Assigned? : IAssignedReward[],
    Color : string,
    Name : string,
    DiscordRoleId? : number
}
interface IAssignedReward{
    RewardId : number,
    Reward : IReward,
    UnitId : number,
    Unit : IUnit,
    AssignedDate : Date,
    Display : number
}
interface IActivity{
    UnitId : number,
    Unit : IUnit,
    Date : Date
}
enum StatusType{
    Vacation = 1,
    TemporaryPost = 2,
    Gratitude = 3,
    Reprimand = 4,
    SevereReprimand = 5,
    Retirement = 6
}
interface IStatus{
    Type : StatusType,
    UnitStatus : IUnitStatus,
    Color : string,
    Name : string,
    DiscordRoleId? : number
}
interface IUnitStatus{
    Id? : number,
    Unit : IUnit,
    Status : IStatus,
    StartDate : Date,
    EndDate : Date
}

interface IUnit {
    DiscordId : number,
    Nickname : string,
    SteamId? : number,
    RankUpCounter : number,
    Joined : Date,
    Colour : string,
    Rank : IRank,
    OwnDocs : IDoc[],
    AssignedDocs : IDoc[],
    Posts : IPost[],
    AssignedRewards : IAssignedReward[],
    Activities : IActivity[],
    UnitStatuses : IUnitStatus[]
}

interface IGivedPermission{
    Id? : number,
    PermissionType : PermissionType,
    Permission : IPermission,
    Entity : any,
    Inherit : boolean

}
interface IPermission{
    PermissionType : PermissionType,
    Name : string,
    Description : string,
    GivedPermissions : IGivedPermission[]
}