import { useState } from "react";

interface IActivityCalendarPillar{
    filling : number,
    isSelected : boolean,
    isInactive : boolean,
    monthName : string,
    year : number,
    monthId : number
}
export const ActivityCalendarPillar: React.FC<IActivityCalendarPillar> = ({filling, isSelected,isInactive,monthName,year,monthId}) =>{
    const [highlight, setHighlight] = useState<boolean>(false);
    return(
        <div className="flex flex-col" onMouseEnter={()=>{setHighlight(true)}} onMouseLeave={()=>{setHighlight(false)}}>
            <div className={"flex"} style={{height: `${100 - filling}%`}}></div>
            <div className={`flex rounded-md justify-center ${isSelected?  highlight? "bg-green-300" : "bg-green-500" : highlight? "bg-green-700" : "bg-green-800"} transition-all`} style={{height: `${filling}%`}}></div>  
        </div>
    );
}