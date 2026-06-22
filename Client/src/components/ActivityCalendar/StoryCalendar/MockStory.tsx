export function getMockStates() : IUnitState[] {
    let today = new Date();
    let states : IUnitState[] = [
        {
            id: "0",
            status: {
                color: "#FF2222",
                name: "Празднование мохрового ковра"
            },
            startDate: new Date(today.getFullYear(), Math.max(today.getMonth()-1, 0), today.getDate()),
            endDate: today
        },
        {
            id: "1",
            status: {
                color: "#FFFF22",
                name: "Денечек"
            },
            startDate: new Date(today.getFullYear(), today.getMonth(), Math.max(today.getDate()-4, 0)),
            endDate: new Date(today.getFullYear(), today.getMonth(), Math.max(today.getDate()+2, 0))
        },
    ]


    return states;
}

export function getMockSingleDayEvents() : ISingleDayEvent[] {
    let today = new Date();
    let states : ISingleDayEvent[] = [
        {
            id: "0",
            name: "Кигризский метеорит упал мне в чай!",
            color: "#0011FF",
            dateTime: today,
            unitId: ""
        },
        {
            id: "0",
            name: "Первая снежинка на носу у китайца!",
            color: "#0099FF",
            dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate()+2),
            unitId: ""
        },
    ]


    return states;
}