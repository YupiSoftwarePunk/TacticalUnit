import { useState } from "react";
import { ActivityCalendarCell, IActivityCalendarCell } from "../ActivityCalendarCell";

interface IStoryCalendarPanel{
    year? : number,
    month? : number
    ActivityDaysList? : activityCell[]
}

const monthsStr = [
        "Январь", "Февраль", "Март", 
        "Апрель","Май","Июнь",
        "Июль","Август","Сентябрь",
        "Октябрь","Ноябрь","Декабрь"
    ];
const StoryCalendarPanel = ({year, month, ActivityDaysList} : IStoryCalendarPanel) =>{

    return (
        <div className="flex flex-col content-center justify-center gap-6">
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
                            
                            { ActivityDaysList != undefined && ActivityDaysList.map((item)=>(
                                // ActivityDaysList.indexOf(item)
                                <div key={ActivityDaysList.indexOf(item)} className="flex size-10"> 
                                    <ActivityCalendarCell isActive={item.isChecked} isCurrentMonth={item.isCurrentMonth}></ActivityCalendarCell>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>)
}
export default StoryCalendarPanel