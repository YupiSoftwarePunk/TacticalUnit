export function getMockStates() : IUnitState[] {
    const today = new Date();
    const states : IUnitState[] = [
        {
            id: "0",
            status: {
                color: "#FF2222",
                name: "Празднование мохрового ковра"
            },
            startDate: today,
            endDate: undefined
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
    const today = new Date();
    const states : ISingleDayEvent[] = [
        {
            id: "0",
            name: "Кигризский метеорит упал мне в чай!",
            color: "#0011FF",
            dateTime: today,
            unitId: ""
        },
        {
            id: "1",
            name: "Первая снежинка на носу у китайца!",
            color: "#0099FF",
            dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate()+2),
            unitId: ""
        },
        {
            id: "2",
            color: "#FF0022",
            name: "Чаехлюпательное состязание",
            dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate()+2),
            unitId: ""
        },
        {
            id: "3",
            color: "#11FF22",
            name: "Переломный момент",
            dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate()+2),
            unitId: ""
        },
    ]


    return states;
}