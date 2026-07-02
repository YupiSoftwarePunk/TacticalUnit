import { UnitService } from "@/shared/api/services/unitService";


export function getProfileMenuOptions(disId : string){
    const menuOptions : IActionMenuOption[] = ([
        {
            id : 0,
            name : "Подробная активность",
            url : `/profile/${disId}/story`,
            accessOnRoles : ["1", "any"]
        },
        {
            id : 1,
            name : "Избранные документы",
            url : `#`,
            accessOnRoles : ["1", "any"]
        },
        {
            id : 2,
            name : "Изменить шапку профиля",
            url : `/profile/${disId}/background`,
            accessOnRoles : ["1", "self"]
        },
        {
            id : 3,
            name : "Изменить избранный кит",
            url : `/profile/${disId}/kit`,
            accessOnRoles : ["1", "self"]
        },
        {
            id : 4,
            name : "Изменить отображаемые награды",
            url : `#`,
            accessOnRoles : ["1", "self"]
        },
        {
            id : 5,
            name : "Изменить никнейм",
            url : `#`,
            accessOnRoles : ["1", "self", "17"]
        },
        {
            id : 6,
            name : "Присвоить звание",
            url : `#`,
            accessOnRoles : ["1", "11"]
        },
        {
            id : 7,
            name : "Назначить на должность",
            url : `#`,
            accessOnRoles : ["1", "12"]
        },
        {
            id : 8,
            name : "Наградить",
            url : `#`,
            accessOnRoles : ["1", "13"]
        },
        {
            id : 9,
            name : "Отправить в отставку",
            url : `#`,
            accessOnRoles : ["1", "5"]
        },
        {
            id : 10,
            name : "Уволить",
            url : `#`,
            accessOnRoles : ["1", "4"]
        }
        ]);
    return menuOptions;
}

export function getStoryMenuOptions(disId : string){
    const menuOptions : IActionMenuOption[] = ([
        {
            id : 0,
            name : "Посмотреть профиль",
            url : `/profile/${disId}`,
            accessOnRoles : ["1", "any"]
        },
        {
            id : 1,
            name : "Избранные документы",
            url : `#`,
            accessOnRoles : ["1", "any"]
        },
        {
            id : 2,
            name : "Изменить шапку профиля",
            url : `/profile/${disId}/background`,
            accessOnRoles : ["1", "self"]
        },
        {
            id : 3,
            name : "Изменить избранный кит",
            url : `/profile/${disId}/kit`,
            accessOnRoles : ["1", "self"]
        },
        {
            id : 4,
            name : "Изменить отображаемые награды",
            url : `#`,
            accessOnRoles : ["1", "self"]
        },
        {
            id : 5,
            name : "Изменить никнейм",
            url : `#`,
            accessOnRoles : ["1", "self", "17"]
        },
        {
            id : 6,
            name : "Присвоить звание",
            url : `#`,
            accessOnRoles : ["1", "11"]
        },
        {
            id : 7,
            name : "Назначить на должность",
            url : `#`,
            accessOnRoles : ["1", "12"]
        },
        {
            id : 8,
            name : "Наградить",
            url : `#`,
            accessOnRoles : ["1", "13"]
        },
        {
            id : 9,
            name : "Отправить в отставку",
            url : `#`,
            accessOnRoles : ["1", "5"]
        },
        {
            id : 10,
            name : "Уволить",
            url : `#`,
            accessOnRoles : ["1", "4"]
        }
        ]);
    return menuOptions;
}


export async function applyPermissions(menuOptions : IActionMenuOption[], disId : string = "-1") : Promise<IActionMenuOption[]>{







    
        let preparedOptions : IActionMenuOption[] = [];
        await UnitService.getPermissionsIds(disId).then((r)=>{
            let permissions : string[] = r
            let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
            permissions.push("any");
            if (user.discord_id == disId){
                permissions.push("self");
            }
            //console.warn(permissions);
            menuOptions.forEach(option => {

                permissions.forEach(perm=>{

                    if(option.accessOnRoles.find(x=>x == perm)){
                        if(!preparedOptions.find(x=>x.id == option.id)){

                            preparedOptions.push(option);
                        }
                    }
                })
            });


            
        })
        return (preparedOptions);
    }
