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
    Id? : string,
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
    Id? : string,
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
    DiscordRoleId? : string
}

interface IPost{
    Id? : string,
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
    Id? : string,
    Name : string,
    Description : string,
    TemplatePath? : string,
    Docs : IDoc[]
}
interface IDoc{
    Id? : string,
    Name : string,
    FilePath : string,
    DocType? : IDocType,
    Author : IUnit,
    Units : IUnit[]
}
interface IReward{
    Id? : string,
    Conditions : string,
    Privileges : string,
    ImagePath? : string,
    Assigned? : IAssignedReward[],
    Color : string,
    Name : string,
    DiscordRoleId? : string
}
interface IAssignedReward{
    RewardId : string,
    Reward : IReward,
    UnitId : string,
    Unit : IUnit,
    AssignedDate : Date,
    Display : number
}
interface IActivity{
    UnitId : string,
    Unit : IUnit,
    Date : Date
}

interface IState{
    Color : string,
    Name : string,
    DiscordRoleId? : string
}

interface ISingleDayEvent{
    Id : string,
    Name : string,
    Color : string,
    DateTime : Date,
    UnitId : string
    Unit? : IUnit
}

interface IUnitState{
    Id? : string,
    Unit : IUnit,
    Status : IState,
    StartDate : Date,
    EndDate : Date
}

interface IUnit {
    DiscordId : string,
    Nickname : string,
    SteamId? : string,
    RankUpCounter : number,
    Joined : Date,
    Colour : string,
    Rank : IRank,
    OwnDocs : IDoc[],
    AssignedDocs : IDoc[],
    Posts : IPost[],
    AssignedRewards : IAssignedReward[],
    Activities : IActivity[],
    UnitStatuses : IUnitState[]
}

interface IGivedPermission{
    Id? : string,
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

interface IDiscordLoginUrlResponse {
    login_url: string;
    state: string;
}

interface IDiscordCallbackResponse {
    success: boolean;
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
        discord_id: number;
        username: string;
    };
}

interface ICurrentUserResponse {
    discord_id: string;
    username: string;
    joined: string;
    rank: string;
    steam_id: string | null;
}


interface activityCell {
    id : number,
    date: Date,
    isCurrentMonth: boolean,
    isChecked: boolean
}