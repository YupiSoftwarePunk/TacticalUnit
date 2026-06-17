import { useEffect, useState } from "react";
import { ActivityCalendarCell, IActivityCalendarCell } from "../ActivityCalendarCell";

export interface IStoryCalendarPanel{
    year : number,
    month : number
    ActivityDaysList? : Date[]
    orientation? : "horizontal" | "vertical"
}

const monthsStr = [
        "Январь", "Февраль", "Март", 
        "Апрель","Май","Июнь",
        "Июль","Август","Сентябрь",
        "Октябрь","Ноябрь","Декабрь"
    ];
const StoryCalendarPanel = ({year, month, ActivityDaysList = []} : IStoryCalendarPanel) =>{
    const [activityMatrix, setActivityMatrix] = useState<activityCell[]>([])
    
    function fillMonthMatrix(dates : Date[] = ActivityDaysList){
        // console.warn("cal refreshed")
        // console.warn(year + "  " + month)
        // console.warn("-----------------")



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
                    content: `Появление на сборах ${cellDate.getDate()}.${cellDate.getMonth()+1}.${cellDate.getFullYear()}`,
                    color: ""
                }] : []
            };
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

                    <div className="grid grid-flow-col grid-cols-7  grid-rows-7 w-full h-full justify-center gap-1 place-items-center">
                            <p className="self-end">Пн</p>
                            <p className="self-end">Вт</p>
                            <p className="self-end">Ср</p>
                            <p className="self-end">Чт</p>
                            <p className="self-end">Пт</p>
                            <p className="self-end">Сб</p>
                            <p className="self-end">Вс</p>
                            
                            { activityMatrix != undefined && activityMatrix.map((item)=>(
                                // ActivityDaysList.indexOf(item)
                                <div key={activityMatrix.indexOf(item)} className="flex size-10"> 
                                    <ActivityCalendarCell dateDisplay={`${item.date.getDate()}.${item.date.getMonth()+1}.${item.date.getFullYear()}`} isActive={item.isChecked} isCurrentMonth={item.isCurrentMonth} givenInfo={item.givenInfo}></ActivityCalendarCell>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>)
}
export default StoryCalendarPanel