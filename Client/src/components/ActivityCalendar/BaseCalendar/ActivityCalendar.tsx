import { act, useEffect, useState } from "react"
import { ActivityCalendarCell } from "../ActivityCalendarCell";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { ActivityCalendarPillar, IActivityCalendarPillar } from "./ActivityCalendarPillar";
import { UnitService } from "@/shared/api/services/unitService";
import StoryCalendarPanel from "../StoryCalendar/StoryCalendarPanel";


const monthsStr = [
        "Январь", "Февраль", "Март", 
        "Апрель","Май","Июнь",
        "Июль","Август","Сентябрь",
        "Октябрь","Ноябрь","Декабрь"
    ];

interface IActivityCalendar{
    UnitDiscordId : string
}
export const ActivityCalendar = ({UnitDiscordId} : IActivityCalendar) =>{
    const [activityMatrix, setActivityMatrix] = useState<activityCell[]>([])
    let [monthsMatrix, setMonthsMatrix] = useState<IActivityCalendarPillar[]>([])
    const [selectedMonthDisplay, setSelectedMonthDisplay] = useState<string>();
    const [pillarsOffset, setPillarsOffset] = useState<number>(0);
    const [pillarsTransitionStatus, setPillarsTransitionStatus] = useState<boolean> (false);
    let [activityDates, setActivityDates] = useState<Date[]> ([]);

    let preparedMonths : IActivityCalendarPillar[] = [];
    


    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const startDayOfMonth = new Date(currentYear, currentMonth, 1);
    let startDayOfWeek = startDayOfMonth.getDay();
    const [selectedYearDisplay, setSelectedYearDisplay] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

    let previouslySelectedMonthIndexOffset = -1;

    

    function createPillars(){
        let activityMonths : Date[] = [];
        activityDates.forEach(d => {
            
            if (activityMonths.find(x=>x.getMonth() == d.getMonth() && x.getFullYear() == d.getFullYear()) == undefined){
                activityMonths.push(d);

            }
        });
        let pillars : IActivityCalendarPillar[] = [];
        activityMonths.forEach(d => {



            let monthDays = new Date(d.getFullYear(), d.getMonth(), 0).getDate();
            let monthActivity = activityDates.filter(x=>(x.getMonth() == d.getMonth() && x.getFullYear() == d.getFullYear()))
            let totalActivity : number = (monthActivity.length / monthDays) * 100;

            pillars.push({
                Id: pillars.length,
            year : 2026,
            isSelected : false,
            isBlank : false,
            filling : totalActivity,
            Date : new Date(d.getFullYear(), d.getMonth(), 1 )
            })
        });
        pillars = pillars.sort((a,b)=>a.Date!.getTime() - b.Date!.getTime())
        pillars[pillars.length-1].isSelected = true;
        return pillars;
    }


    function refreshMonthsDisplay(){
        const monthsToSet : IActivityCalendarPillar[] = monthsMatrix;
        let selectedMonthIndex = monthsToSet.findIndex(x=>x.isSelected == true);

            const monthsMargin = 4; //both directions
            const amountOfMonthsToDisplay = 5;
            const amountOfMonthsToTheRight = 2;
            const calculatedPillarOffset = previouslySelectedMonthIndexOffset - amountOfMonthsToDisplay + 1;
            //console.warn(calculatedPillarOffset);
            const refresh = () => {if(selectedMonthIndex != undefined){
            preparedMonths = [];

            let monthsToTheRight = 0;
            let testIndex = selectedMonthIndex + 1;
            while (monthsToTheRight != amountOfMonthsToTheRight && monthsToSet.length != testIndex){
                monthsToTheRight = monthsToTheRight + 1 ;
                testIndex = testIndex + 1;
            }
            //console.warn(monthsToTheRight);
            
            for(let i = 0; i < amountOfMonthsToDisplay + monthsMargin ; i++){
                let currentIndex = ( i+(-amountOfMonthsToDisplay + monthsToTheRight - 1))
                if (selectedMonthIndex + currentIndex >= 0 && selectedMonthIndex + currentIndex < monthsToSet.length){
                    //console.warn(monthsToSet[selectedMonthIndex + currentIndex].Id);
                    preparedMonths.push(monthsToSet[selectedMonthIndex + currentIndex]);
                }
                else if (selectedMonthIndex + currentIndex < 0 || selectedMonthIndex + currentIndex >= monthsToSet.length){
                    //console.warn(`${selectedMonthIndex + currentIndex} : BLANK`);

                    let blank : IActivityCalendarPillar = {
                        isBlank : true,
                        filling : 0,
                        isSelected : false,
                    }
                    preparedMonths.push(blank);

                }
                
                setMonthsMatrix(preparedMonths);
            }}
        }

        if (calculatedPillarOffset <= 2 && calculatedPillarOffset >= -2 && selectedMonthIndex + calculatedPillarOffset != monthsToSet.length+1){
            if (calculatedPillarOffset == 2 && selectedMonthIndex == monthsToSet.length-2){
                setPillarsTransitionStatus(false);
                setPillarsOffset(20 * (currentMonth - previouslySelectedMonthIndexOffset+1));
            }else if(selectedMonthIndex >= monthsToSet.length-2){

            }
            else{
                //console.warn('THIS ROUTE. ANIM: ' + `${20 * ( currentMonth -previouslySelectedMonthIndexOffset  -1)}`)
                
                setPillarsTransitionStatus(false);
                
                setPillarsOffset(20 * (currentMonth - previouslySelectedMonthIndexOffset-1));

                refresh();
            }
            
            let interval = setTimeout(()=>{ setPillarsOffset(0); refresh(); }, 50);
        }else{
            refresh();
        }
        setTimeout(()=>{setPillarsTransitionStatus(true);}, 1);


        //if (preparedMonths != monthsMatrix){setMonthsMatrix(preparedMonths);}
        // console.warn(selectedYearDisplay + "  " + selectedMonth)
    }

    function fillMonthMatrix(year : number, month : number, dates : Date[] = activityDates){
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
        UnitService.getActivity(UnitDiscordId).then(a => {
            let list : Date[] = []

            a.forEach(act => {
                const [day, month, year] = act.split(".").map(Number);
                list.push(new Date(year, month-1, day))
            });
            activityDates = list;
            setActivityDates(list);
            setMonthsMatrix(createPillars());
            monthsMatrix = createPillars();
            

            setActivityMatrix(fillMonthMatrix(currentYear, currentMonth, list));
            refreshMonthsDisplay();

            //console.warn(list[0].toDateString());
        })


        
    }, [])
    useEffect(()=>{

        


        setSelectedMonthDisplay(monthsStr[selectedMonth]);
        setMonthsMatrix(preparedMonths);

        
        
    }, [])

    function lowerSelectedMonth(){
        let currentMonth = monthsMatrix.find(x => x.isSelected === true);
        if(currentMonth){
            //console.warn("Found month");
            let currentMonthId = monthsMatrix.indexOf(currentMonth);
            if(currentMonthId != null){
                //console.warn("Found month Id, index: "+ currentMonthId+ " month: "+ currentMonth.monthName);
                //console.warn(monthsMatrix[currentMonthId-1].isBlank);
                if(currentMonthId -1 >= 0){
                    if(monthsMatrix[currentMonthId-1].isBlank != true){
                        setActiveMonthByListIndex(currentMonthId-1);

                    }
                }
            }
        }
    }
    
    function enlargeSelectedMonth(){

        let currentMonth = monthsMatrix.find(x => x.isSelected === true);
        if(currentMonth){
            //console.warn("Found month");
            let currentMonthId = monthsMatrix.indexOf(currentMonth);
            if(currentMonthId != null){
                //console.warn("Found month Id, index: "+ currentMonthId+ " month: "+ currentMonth.monthName);
                //console.warn(monthsMatrix[currentMonthId-1].isBlank);
                if(currentMonthId +1 < monthsMatrix.length ){
                    if(monthsMatrix[currentMonthId+1].isBlank != true){
                        setActiveMonthByListIndex(currentMonthId+1);

                    }
                }
            }
        }
    }





    const setActiveMonthById = (monthId : number) => {
        // console.warn("click")
        let m = monthsMatrix.find(x => x.isSelected === true);
        m!.isSelected = false;
        let electedMonth = monthsMatrix.find(x => x.Id === monthId);
        previouslySelectedMonthIndexOffset = monthsMatrix.indexOf(electedMonth!);
        
        setMonthsMatrix([...monthsMatrix]);
        if (electedMonth != null){
            electedMonth.isSelected = true;
            if (electedMonth.Date) {
                setSelectedYearDisplay(electedMonth.Date.getFullYear());
                setSelectedMonthDisplay(monthsStr[electedMonth.Date.getMonth()])
                setSelectedMonth(electedMonth.Date.getMonth())

                setActivityMatrix(fillMonthMatrix(electedMonth.Date.getFullYear(), electedMonth.Date.getMonth(), activityDates));

            }
            
        }
        refreshMonthsDisplay();

        //console.warn("switched to " + monthId)
    }
    const setActiveMonthByListIndex = (monthId : number) => {
        let m = monthsMatrix.find(x => x.isSelected === true);
        m!.isSelected = false;
        previouslySelectedMonthIndexOffset = monthsMatrix.indexOf(m!);
        let electedMonth = monthsMatrix[monthId];
        previouslySelectedMonthIndexOffset = monthsMatrix.indexOf(electedMonth!);
        setMonthsMatrix([...monthsMatrix]);
        if (electedMonth != null){
            electedMonth.isSelected = true;
            if (electedMonth.Date) {
                setSelectedYearDisplay(electedMonth.Date.getFullYear());
                setSelectedMonthDisplay(monthsStr[electedMonth.Date.getMonth()])
                setSelectedMonth(electedMonth.Date.getMonth())

                setActivityMatrix(fillMonthMatrix(electedMonth.Date.getFullYear(), electedMonth.Date.getMonth(), activityDates));

            }
            
        }
        refreshMonthsDisplay();

        //console.warn("switched to " + monthId)
    }


    

    return(
        <div className="flex size-full flex-col gap-5">
            <div className="flex gap-2 max-md:flex-col max-md:items-center">

                <div className="flex">

                    {/* <StoryCalendarPanel year={selectedYearDisplay} month={selectedMonth} ActivityDaysList={activityDates}></StoryCalendarPanel> */}
                    
                    <div className="grid grid-cols-7 grid-rows-7 w-full h-full text-center">
                        <p className="self-end">Пн</p>
                        <p className="self-end">Вт</p>
                        <p className="self-end">Ср</p>
                        <p className="self-end">Чт</p>
                        <p className="self-end">Пт</p>
                        <p className="self-end">Сб</p>
                        <p className="self-end">Вс</p>
                        
                        
                        {activityMatrix.map((item)=>(
                            <div key={activityMatrix.indexOf(item)} className="flex size-10 p-1">
                                <ActivityCalendarCell isActive={item.isChecked} dateDisplay={`${item.date.getDate()}.${item.date.getMonth()+1}.${item.date.getFullYear()}`} isCurrentMonth={item.isCurrentMonth}></ActivityCalendarCell>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col flex-2 w-60 min-h-60">
                    <div className="flex flex-1 overflow-clip ">
                        <div className={`grid flex-1 gap-1 grid-cols-9 transition-all`} style={{marginLeft:`${-40 - pillarsOffset}%`, marginRight:`${-40 + pillarsOffset}%`, transitionProperty: `${pillarsTransitionStatus? "all" : "none"}`}}>
                            {monthsMatrix.map((item)=>(
                                <ActivityCalendarPillar isBlank={item.isBlank} key={monthsMatrix.indexOf(item)}  switchMonthMethod={setActiveMonthById} Id={item.Id} monthName={item.monthName} year={item.year} isSelected={item.isSelected} filling={item.filling}></ActivityCalendarPillar>
                            ))}
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