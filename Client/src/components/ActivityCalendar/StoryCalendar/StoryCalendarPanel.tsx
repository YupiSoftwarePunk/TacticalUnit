import { useEffect, useState } from "react";
import { ActivityCalendarCell, IActivityCalendarCell } from "../ActivityCalendarCell";
import { isDateBetween, isDateBetweenDates } from "../dateWorks";
import { mixColors } from "../colorConverter";

export interface IStoryCalendarPanel{
    year : number,
    month : number
    ActivityDaysList? : Date[]
    orientation? : "horizontal" | "vertical"
    unitStates? : IUnitState[]
    singleDayEvents? : ISingleDayEvent[]
}

const monthsStr = [
        "Январь", "Февраль", "Март", 
        "Апрель","Май","Июнь",
        "Июль","Август","Сентябрь",
        "Октябрь","Ноябрь","Декабрь"
    ];
const StoryCalendarPanel = ({year, month, ActivityDaysList = [], unitStates = [], singleDayEvents = []} : IStoryCalendarPanel) =>{
    const [activityMatrix, setActivityMatrix] = useState<activityCell[]>([])
    

    
    function fillMonthMatrix(dates : Date[] = ActivityDaysList){
        // console.warn("cal refreshed")
        // console.warn(year + "  " + month)
        // console.warn("-----------------")
        // console.warn(unitStates);
        // console.warn(singleDayEvents);
        



        let activityMatrixFilled : activityCell[] = [];

        const sdm = new Date(year, month, 1);
        let sdw = sdm.getDay();
        if (sdw == 0) sdw = 7
        
        sdw = sdw - 1;

        for(let i = 0; i < sdw; i++){
        let newCell: activityCell = {
            id : i,
            date : new Date(),
            isCurrentMonth : false,
            isChecked : false
        };
        activityMatrixFilled.push(newCell);
        }
        for(let i = 0; i < new Date(year, month+1, 0).getDate(); i++){
            let cellDate : Date = new Date(year, month, i+1);
            let cellColors : string[] = []
            let wasActive  = dates.some(date => 
                    date.getFullYear() === cellDate.getFullYear() &&
                    date.getMonth() === cellDate.getMonth() &&
                    date.getDate() === cellDate.getDate()
                );
            let newCell: activityCell = {
                id : i + activityMatrixFilled.length,
                date : cellDate,
                isCurrentMonth : true,
                isChecked : wasActive,
                givenInfo: wasActive? [{
                    type: "NONE",
                    content: `Появление на сборах ${cellDate.getDate()}.${cellDate.getMonth()+1}.${cellDate.getFullYear()}`,
                    color: ""
                }] : []
            };
            if(unitStates.length > 0){
                unitStates.forEach(state => {
                    if(isDateBetween(cellDate, state.startDate, state.endDate)){
                        let prepInfo : IContainedInfo = {
                            type: "STATE",
                            content: `${state.status.name}`,
                            color: state.status.color,
                            id: state.id
                        }
                        if(state.startDate != undefined){
                            prepInfo.dates = `${state.startDate.getDate()}.${state.startDate.getMonth()+1}.${state.startDate.getFullYear()} - `
                        }
                        if(state.endDate != undefined){
                            prepInfo.dates += `${state.endDate.getDate()}.${state.endDate.getMonth()+1}.${state.endDate.getFullYear()}`
                        }
                        newCell.givenInfo?.push(prepInfo)
                        cellColors.push(state.status.color)
                    }
                });

            }
            if(singleDayEvents.length > 0){
                singleDayEvents.forEach(event => {
                    if(cellDate.getDate() == event.dateTime.getDate()){
                        newCell.givenInfo?.push({
                            type: "EVENT",
                            content: `${event.name}`,
                            color: event.color,
                            id: event.id,
                            dates: `${cellDate.getDate()}.${cellDate.getMonth()+1}.${cellDate.getFullYear()}`
                        })
                        cellColors.push(event.color)
                    }
                });

            }
            newCell.color = mixColors(cellColors);
            activityMatrixFilled.push(newCell);
        }
        return activityMatrixFilled;
    }
    useEffect(()=>{
        setActivityMatrix(fillMonthMatrix())
    },[])





    return (
        <div className="flex flex-col content-center justify-center gap-6 text-text-primary">
            <div className="flex justify-center">

            <div className="flex flex-col">

                    <h2 className="flex text-text-primary-accent text-xl self-center">{`${monthsStr[month!]} ${year!} года`}</h2>

                    <div className="grid grid-flow-col grid-cols-7  grid-rows-7 w-full h-full justify-center gap-0 place-items-center">
                            <p className="self-end">Пн</p>
                            <p className="self-end">Вт</p>
                            <p className="self-end">Ср</p>
                            <p className="self-end">Чт</p>
                            <p className="self-end">Пт</p>
                            <p className="self-end">Сб</p>
                            <p className="self-end">Вс</p>
                            
                            { activityMatrix != undefined && activityMatrix.map((item)=>(
                                // ActivityDaysList.indexOf(item)
                                <div key={activityMatrix.indexOf(item)} className="flex size-10 p-1"> 
                                    <ActivityCalendarCell borderColor={item.color} dateDisplay={`${item.date.getDate()}.${item.date.getMonth()+1}.${item.date.getFullYear()}`} isActive={item.isChecked} isCurrentMonth={item.isCurrentMonth} givenInfo={item.givenInfo}></ActivityCalendarCell>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>)
}
export default StoryCalendarPanel