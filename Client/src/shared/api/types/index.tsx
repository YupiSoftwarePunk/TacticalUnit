enum PermissionType {
    Administrator = 1,
    ConstantBeggOf = 2,
    RegisterNewUnits = 3,
    DismissUnits = 4,
    AssignRetirement = 5,
    FixActivity = 6,
    VacationAccess = 7,
    AccessRetirement = 8,
    AssignStatuses = 9,
    ForceVacation = 10,
    AssignRanks = 11,
    AssignPosts = 12,
    AssignRewards = 13,
    ManageRanks = 14,
    ManageStructure = 15,
    ManageRewards = 16,
    ModerateNicknames = 17,
    SeeHiddenDocs = 18,
    UploadDocs = 19
}

interface IPermissionDetails {
    name: string;
    description: string;
}

const PermissionTypeDetails: Record<PermissionType, IPermissionDetails> = {
    [PermissionType.Administrator]: {
        name: "Администратор",
        description: "Все разрешения в одном и обход ограничений по работе с вышестоящими должностями"
    },
    [PermissionType.ConstantBeggOf]: {
        name: "Освобождение от сборов",
        description: "Боец не получает автоматические выговора и благодарности за обязательные сборы"
    },
    [PermissionType.RegisterNewUnits]: {
        name: "Регистрация новых бойцов",
        description: "Разрешение принимать новичков в клан"
    },
    [PermissionType.DismissUnits]: {
        name: "Увольнение бойцов",
        description: "Разрешение увольнять бойцов клана"
    },
    [PermissionType.AssignRetirement]: {
        name: "Отправление отставку",
        description: "Разрешение отправлять бойцов клана в отставку"
    },
    [PermissionType.FixActivity]: {
        name: "Подтверждение активности",
        description: "Разрешение подтверждать фиксации своей и чужой активности"
    },
    [PermissionType.VacationAccess]: {
        name: "Выход в отпуск",
        description: "Разрешение на выход в отпуск"
    },
    [PermissionType.AccessRetirement]: {
        name: "Выход в отставку",
        description: "Разрешение на выход в отставку"
    },
    [PermissionType.AssignStatuses]: {
        name: "Выдача статусов",
        description: "Разрешение выдавать бойцам выговора, благодарности и строгие выговоры"
    },
    [PermissionType.ForceVacation]: {
        name: "Отправка в отпуск",
        description: "Разрешение отправлять бойцов в отпуск"
    },
    [PermissionType.AssignRanks]: {
        name: "Присваивание званий",
        description: "Разрешение изменять звания у бойцов"
    },
    [PermissionType.AssignPosts]: {
        name: "Назначение на должности",
        description: "Разрешение назначать нижестоящих бойцов на должности"
    },
    [PermissionType.AssignRewards]: {
        name: "Награждение бойцов",
        description: "Разрешение награждать бойцов"
    },
    [PermissionType.ManageRanks]: {
        name: "Редактирование званий",
        description: "Разрешение создавать, удалять и редактировать звания"
    },
    [PermissionType.ManageStructure]: {
        name: "Редактирование структуры",
        description: "Разрешение создавать, удалять и редактировать нижестоящие должности и подразделения"
    },
    [PermissionType.ManageRewards]: {
        name: "Редактирование наград",
        description: "Разрешение создавать, удалять и редактировать награды"
    },
    [PermissionType.ModerateNicknames]: {
        name: "Изменять никнеймы",
        description: "Разрешение изменять чужие никнеймы"
    },
    [PermissionType.SeeHiddenDocs]: {
        name: "Видеть скрытые документы",
        description: "Разрешение видеть скрытые документы"
    },
    [PermissionType.UploadDocs]: {
        name: "Загружать документы",
        description: "Разрешение загружать новые документы"
    }
};

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
    id: string,
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
    discordRoleId?: string,
    index?: number
}

interface IPost{
    id? : string | number,
    description : string,
    subdivisionId? : string | number,
    appendSubdivisionName : boolean,
    headId? : string | number,
    maxRankId : string | number,
    color : string,
    name : string,
    fullName: string;
    index: number;
    permissions : IPermission[];      // для изменения разрешений
    allPermissions : IPermission[];   // для просмотра разрешений 
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
    title : string,
    isHidden : boolean,
    authorId : string, 
    events : any[],
    state : any[],
    uploadedTime : string
}

interface IUploadDoc {
    name : string,
    unitIds: Set<number>,
    file: File
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
    // unit? : IUnit
}

interface IUnitState{
    id? : string,
    // unit : IUnit,
    status : IState,
    startDate : Date | undefined,
    endDate : Date | undefined,
    unitId? : string
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

interface IUnitCompressed {
    discordId: string;
    nickname: string;
    steamId?: string;
    favoriteKit: IfavoriteKit;
    backgroundPicture: IBackgroundPicture;
    rankUpCounter?: string | number;
    joined?: string;
    rankId?: number;
    postsIds?: number[];
    assignedRewardsIds?: number[];
    gender?: number;
    rankIndex?: number;
    postIndex?: number;
    weekActivityCount?: number;
    monthActivityCount?: number;
    yearActivityCount?: number;
    totalActivityCount?: number;
}

interface IBackgroundPicture {
    id: number;
    name: string;
}

interface IfavoriteKit {
    id: number,
    name: string
}


interface IGivedPermission{
    id? : string,
    permissionType : PermissionType,
    permission : IPermission,
    entity : Record<string, unknown>,
    inherit : boolean
}

interface IPermission{
    id : number,
    name : string,
    description : string,
    givedPermissions? : IGivedPermission[]
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
interface IActionMenuOption{
    id : number,
    name : string,
    accessOnRoles : string[],
    url : string
}
interface IProfileSidePanelLink{
    Name : string,
    Url : string
}

interface IContainedInfo{
    type?: "NONE" | "EVENT" | "STATE";
    content: string;
    color: string;
    id?: string;
    dates?: string;
}

interface activityCell {
    id : number,
    date: Date,
    isCurrentMonth: boolean,
    isChecked: boolean,
    givenInfo?: IContainedInfo[],
    color? : string,
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

interface IProfileAttribute{ // For background and kit choosing
    name: string,
    id: string
}

interface IDOc {
    id: number,
    title: string,
    uploadedTime: Date,
    isHidden: boolean,
    authorId: string,
    file: File
}