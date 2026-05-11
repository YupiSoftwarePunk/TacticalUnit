import { useState } from "react";

export interface IActivityCalendarPillar{
    filling? : number,
    isSelected : boolean,
    monthName? : string,
    year? : number,
    Id : number,
    switchMonthMethod?: (Id : number) => void
}
export const ActivityCalendarPillar: React.FC<IActivityCalendarPillar> = ({filling = 50, isSelected = false, monthName = "[BLANK MONTH]", year = new Date().getFullYear(),Id, switchMonthMethod = null}) =>{
    const [highlight, setHighlight] = useState<boolean>(false);

    function onClickDo(){
        if (switchMonthMethod) switchMonthMethod(Id);
    }


    return(
        <div className="flex flex-col" onClick={()=>{onClickDo(); }} onMouseEnter={()=>{setHighlight(true)}} onMouseLeave={()=>{setHighlight(false)}}>
            <div className={"flex"} style={{height: `${100 - filling}%`}}></div>
            <div className={`flex rounded-md justify-center ${isSelected?  highlight? "bg-green-300" : "bg-green-500" : highlight? "bg-green-700" : "bg-green-800"} transition-all`} style={{height: `${filling}%`}}></div>  
        </div>
    );
}