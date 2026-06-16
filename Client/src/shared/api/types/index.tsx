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
    id? : string,
    description : string,
    appendHeadName : boolean,
    posts? : IPost[],
    headId? : string,
    head? : ISubdivision,
    subordinates? : ISubdivision[],
    givedPermissions : IGivedPermission[],
    color : string,
    name : string,
    discordRoleId? : string
}

interface IRank{
    id?: number,
    counterToReach : number,
    higherId?: number,
    previous?: IRank,
    lowerId?: number,
    next?: IRank,
    units?: IUnit[],
    color : string,
    name : string,
    rankChevronURL?: string,
    givedPermissions : IGivedPermission[],
    discordRoleId?: string
}

interface IPost{
    id? : string,
    description : string,
    subdivisionId? : string,
    appendSubdivisionName : boolean,
    headId? : string,
    head? : IPost,
    maxRankId : string,
    units? : IUnit[],
    color : string,
    name : string,
    givedPermissions : IGivedPermission[],
    discordRoleId? : string
}
interface IDocType{
    id? : string,
    name : string,
    description : string,
    templatePath? : string,
    docs : IDoc[]
}
interface IDoc{
    id? : string,
    name : string,
    filePath : string,
    docType? : IDocType,
    author : IUnit,
    units : IUnit[]
}
interface IReward{
    id? : string,
    conditions : string,
    privileges : string,
    imagePath? : string,
    assigned? : IAssignedReward[],
    color : string,
    name : string,
    discordRoleId? : string
}
interface IAssignedReward{
    rewardId : string,
    reward : IReward,
    unitId : string,
    unit : IUnit,
    assignedDate : Date,
    display : number
}
interface IActivity{
    unitId : string,
    unit : IUnit,
    date : Date
}

interface IState{
    color : string,
    name : string,
    discordRoleId? : string
}

interface ISingleDayEvent{
    id : string,
    name : string,
    color : string,
    dateTime : Date,
    unitId : string
    unit? : IUnit
}

interface IUnitState{
    id? : string,
    unit : IUnit,
    status : IState,
    startDate : Date,
    endDate : Date
}

interface IUnit {
    discordId : string,
    nickname : string,
    steamId? : string,
    favoriteKitId : string;
    backgroundPictureId : string;
    rankUpCounter : number,
    joined : Date,
    color : string,
    rank : IRank,
    rankId : string,
    ownDocs : IDoc[],
    assignedDocs : IDoc[],
    posts : IPost[],
    postsIds : string[],
    assignedRewardsIds : string[],
    activities : IActivity[],
    unitStatuses : IUnitState[]
}

interface IGivedPermission{
    id? : string,
    permissionType : PermissionType,
    permission : IPermission,
    entity : any,
    inherit : boolean

}
interface IPermission{
    permissionType : PermissionType,
    name : string,
    description : string,
    givedPermissions : IGivedPermission[]
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
        discord_id: string;
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

interface ISubdivision {
    id?: string;
    description: string;
    appendHeadName: boolean;
    posts?: IPost[];
    headId?: string;
    color: string;
    name: string;
}

interface IPost {
    id?: string;
    description: string;
    subdivisionId?: string;
    subdivision?: ISubdivision;
    appendSubdivisionName: boolean;
    headId?: string;
    units?: IUnit[];
    color: string;
    name: string;
}

interface IRank {
    name: string;
    color: string;
}



interface StructureNode {
    id: string;
    title: string;
    color: string;
    members: string[];
    subdivisionId: number | null;
    subdivisionName?: string;
    subdivisionColor?: string;
    children: StructureNode[];
}

interface IImageUploadResponse {
    message: string;
    fileName: string;
}