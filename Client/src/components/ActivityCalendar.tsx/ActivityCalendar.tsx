import { act, useEffect, useState } from "react"
import { ActivityCalendarCell } from "./ActivityCalendarCell";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { ActivityCalendarPillar } from "./ActivityCalendarPillar";

interface activityCell {
    id : number,
    date: Date,
    isCurrentMonth: boolean,
    isChecked: boolean
}
interface monthsMatrix {
    id : number,
    filling : number,
    isSelected : boolean,
    monthName : string,
    year : number,
    monthId : number
}
const monthsStr = [
        "Январь", "Февраль", "Март", 
        "Апрель","Май","Июнь",
        "Июль","Август","Сентябрь",
        "Октябрь","Ноябрь","Декабрь"
    ];

export const ActivityCalendar = () =>{
    const [activityMatrix, setActivityMatrix] = useState<activityCell[]>([])
    const [monthsMatrix, setMonthsMatrix] = useState<monthsMatrix[]>([])
    const [selectedMonthDisplay, setSelectedMonthDisplay] = useState<string>();

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const startDayOfMonth = new Date(currentYear, currentMonth, 1);
    let startDayOfWeek = startDayOfMonth.getDay();
    let activityMatrixFilled : activityCell[] = [];
    const [selectedYearDisplay, setSelectedYearDisplay] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

    for(let i = 0; i < startDayOfWeek-1; i++){
        let newCell: activityCell = {
            id : i,
            date : new Date(),
            isCurrentMonth : false,
            isChecked : false
        };
        activityMatrixFilled.push(newCell);
    }
    for(let i = 0; i < new Date(currentYear, currentMonth+1, 0).getDate(); i++){

        let newCell: activityCell = {
            id : i + activityMatrixFilled.length,
            date : new Date(),
            isCurrentMonth : true,
            isChecked : false
        };
        activityMatrixFilled.push(newCell);
        console.log("Element added!");
    }

    useEffect(()=>{
        setSelectedMonthDisplay(monthsStr[selectedMonth]);

    }, [])

    function lowerSelectedMonth(){
        if (selectedMonth-1 <= -1){
            setSelectedMonth(11);
            setSelectedYearDisplay(selectedYearDisplay-1);
            setSelectedMonthDisplay(monthsStr[11]);
        }else{
            setSelectedMonth(selectedMonth-1);
            setSelectedMonthDisplay(monthsStr[selectedMonth-1]);
        }
    }
    
    function enlargeSelectedMonth(){
        if (selectedMonth+1 >= 12){            
            setSelectedMonth(0);
            setSelectedYearDisplay(selectedYearDisplay+1);
            setSelectedMonthDisplay(monthsStr[0]);

        }else{
            setSelectedMonth(selectedMonth+1);
            setSelectedMonthDisplay(monthsStr[selectedMonth+1]);
        }
    }



    if (activityMatrix.length == 0 || activityMatrix.length!= activityMatrixFilled.length){
        setActivityMatrix(activityMatrixFilled);
    }

    return(
        <div className="flex size-full flex-col gap-5">
            <div className="flex gap-2">

                <div className="flex">
                    <div className="grid grid-cols-7 grid-rows-6 w-full h-full text-center gap-1">
                        <p className="self-end">Пн</p>
                        <p className="self-end">Вт</p>
                        <p className="self-end">Ср</p>
                        <p className="self-end">Чт</p>
                        <p className="self-end">Пт</p>
                        <p className="self-end">Сб</p>
                        <p className="self-end">Вс</p>
                        
                        {activityMatrix.map((item)=>(
                            <div key={item.id} className="flex size-10">
                                <ActivityCalendarCell isActive={item.isChecked} isCurrentMonth={item.isCurrentMonth}></ActivityCalendarCell>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col flex-2">
                    <div className="flex flex-1">
                        <div className="grid flex-1 gap-1 grid-cols-5">
                            {monthsMatrix.map((item)=>(
                                <div key={item.id} className="flex size-10">

                                </div>
                            ))}
                            <ActivityCalendarPillar isSelected={false} filling={10}></ActivityCalendarPillar>
                            <ActivityCalendarPillar isSelected={false} filling={23}></ActivityCalendarPillar>
                            <ActivityCalendarPillar isSelected={false} filling={40}></ActivityCalendarPillar>
                            <ActivityCalendarPillar isSelected={true} filling={10}></ActivityCalendarPillar>
                            <ActivityCalendarPillar isSelected={false} filling={80}></ActivityCalendarPillar>
                        </div>
                    </div>
                    <div className="flex h-1 w-full border-b"/>
                    <div className="flex justify-between">
                        <button onClick={lowerSelectedMonth}><ArrowBigLeft className="flex size-8 text-text-primary hover:text-accent-hover transition-all"></ArrowBigLeft></button>
                        <p className="flex self-center justify-center text-center text-text-primary">{selectedMonthDisplay} {selectedYearDisplay}</p>
                        <button onClick={enlargeSelectedMonth}><ArrowBigRight  className="flex size-8 text-text-primary hover:text-accent-hover transition-all"></ArrowBigRight></button>
                    </div>
                </div>
            </div>
        </div>
    )
}