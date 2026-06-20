"use client";
import { MainHeader } from "@/components/Header/MainHeader"
import StoryCalendarPanel, { IStoryCalendarPanel } from "./StoryCalendarPanel";
import { useEffect, useState } from "react";
import { UnitService } from "@/shared/api/services/unitService";
import { isInThisMonth } from "../dateWorks";


interface IStoryCalendar{
    DiscordId : string,
}

const StoryCalendar = ({DiscordId} : IStoryCalendar) => {

    const [calendars, setCalendars] = useState<IStoryCalendarPanel>()

    let [activityDates, setActivityDates] = useState<Date[]>([]);
    let [unitStates, setUnitStates] = useState<IUnitState[]>([]);
    let [singleDayEvents, setSingleDayEvents] = useState<ISingleDayEvent[]>([]);
    
    function getTotalMonths(){

        let activityMonths : Date[] = [];
        
        activityDates.forEach(d => {
            
            if (activityMonths.find(x=>x.getMonth() == d.getMonth() && x.getFullYear() == d.getFullYear()) == undefined){
                activityMonths.push(d);
                
            }
        });
        return activityMonths;
    }


    useEffect(()=>{
        async function receive() {
            await UnitService.getActivity(DiscordId).then(a => {
                let list : Date[] = []

                a.forEach(act => {
                    const [day, month, year] = act.split(".").map(Number);
                    list.push(new Date(year, month-1, day))
                });
                activityDates = list;
                setActivityDates(list);
                
            })
            await UnitService.getStateStory(DiscordId).then(s=>{
                setUnitStates(s);
            })
            await UnitService.getEventStory(DiscordId).then(e=>{
                setSingleDayEvents(e)
            })
        }
        
        receive();
    },[])



    function getStartOfTheMonthOffset(year : number, month : number) : number{
        const startDayOfMonth = new Date(year, month, 0);
        let startDayOfWeek = startDayOfMonth.getDay();

        return startDayOfWeek;
    }


    function getCalendar(year : number, month : number){
        let preparedMonth : activityCell[] = [];
        //console.warn(getStartOfTheMonthOffset(year, month)-1);
        for(let i = 0; i < getStartOfTheMonthOffset(year, month); i++){
        let newCell: activityCell = {
            id : i,
            date : new Date(),
            isCurrentMonth : false,
            isChecked : false
        };
        preparedMonth.push(newCell);
        }
        for(let i = 0; i < new Date(year, month+1, 0).getDate(); i++){

            let newCell: activityCell = {
                id : i + preparedMonth.length,
                date : new Date(),
                isCurrentMonth : true,
                isChecked : false
            };
            preparedMonth.push(newCell);
        }
        return(preparedMonth);
    }



    return(
        <div className="flex flex-1 flex-col gap-10 font-text-bold justify-center ">
                <h1 className={`flex w-full text-accent font-text-bold uppercase tracking-wider text-2xl justify-center transition-all`}>
                    История бойца
                </h1>
                <div className="flex self-center w-full justify-center">
                    <div className="flex self-center">

                    <div className={`grid overflow-visible grid-cols-5 max-[1800px]:grid-cols-4 max-[1600px]:grid-cols-3 max-[1300px]:grid-cols-2 max-[1000px]:grid-cols-1 self-center justify-start gap-2 mb-12 flex-wrap `}>
                        {getTotalMonths().map(d=>(
                            <StoryCalendarPanel key={d.toDateString()} year={d.getFullYear()} month={d.getMonth()} 
                            ActivityDaysList={activityDates} 
                            unitStates={unitStates.filter(x=> !(isInThisMonth(x.startDate, d.getFullYear(), d.getMonth()) || isInThisMonth(x.endDate, d.getFullYear(), d.getMonth())) )} 
                            singleDayEvents={singleDayEvents.filter(x=>!(isInThisMonth(x.dateTime, d.getFullYear(), d.getMonth())))}></StoryCalendarPanel>
                        ))
                        }
                        
                    </div>
                    </div>
                </div>
                <button className="flex text-text-primary-accent text-2xl cursor-pointer hover:underline transition-all self-stretch justify-center hover:bg-bg-secondary">Загрузить больше</button>
        </div>
    )
}
export default StoryCalendar;