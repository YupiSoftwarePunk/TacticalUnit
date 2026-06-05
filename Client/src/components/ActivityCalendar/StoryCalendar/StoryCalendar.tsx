"use client";
import { MainHeader } from "@/components/Header/MainHeader"
import StoryCalendarPanel from "./StoryCalendarPanel";




const StoryCalendar = () => {

    





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

                    <div className={`grid grid-cols-5 max-[1800px]:grid-cols-4 max-[1600px]:grid-cols-3 max-[1300px]:grid-cols-2 max-[1000px]:grid-cols-1 self-center justify-start gap-2 overflow-auto flex-wrap `}>
                        <StoryCalendarPanel ActivityDaysList={getCalendar(2026, 1)} year={2026} month={1}></StoryCalendarPanel>
                        <StoryCalendarPanel ActivityDaysList={getCalendar(2026, 2)} year={2026} month={2}></StoryCalendarPanel>
                        <StoryCalendarPanel ActivityDaysList={getCalendar(2026, 3)} year={2026} month={3}></StoryCalendarPanel>
                        <StoryCalendarPanel ActivityDaysList={getCalendar(2026, 4)} year={2026} month={4}></StoryCalendarPanel>
                        <StoryCalendarPanel ActivityDaysList={getCalendar(2026, 5)} year={2026} month={5}></StoryCalendarPanel>
                        <StoryCalendarPanel ActivityDaysList={getCalendar(2026, 6)} year={2026} month={6}></StoryCalendarPanel>
                        <StoryCalendarPanel ActivityDaysList={getCalendar(2026, 7)} year={2026} month={7}></StoryCalendarPanel>
                    </div>
                    </div>
                </div>
                <button className="flex text-text-primary-accent text-2xl cursor-pointer hover:underline transition-all self-stretch justify-center hover:bg-bg-secondary">Загрузить больше</button>
        </div>
    )
}
export default StoryCalendar;