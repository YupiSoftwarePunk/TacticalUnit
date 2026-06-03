import { act, useEffect, useState } from "react"
import { ActivityCalendarCell } from "./ActivityCalendarCell";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { ActivityCalendarPillar, IActivityCalendarPillar } from "./ActivityCalendarPillar";

interface activityCell {
    id : number,
    date: Date,
    isCurrentMonth: boolean,
    isChecked: boolean
}

const monthsStr = [
        "Январь", "Февраль", "Март", 
        "Апрель","Май","Июнь",
        "Июль","Август","Сентябрь",
        "Октябрь","Ноябрь","Декабрь"
    ];

    const _today = new Date();
    const _currentYear = _today.getFullYear();
    const _currentMonth = _today.getMonth();
const BlankMonths : IActivityCalendarPillar[] = [
        {
            Id : 0,
            monthName : "Апрель",
            year : 2026,
            isSelected : false,
            isBlank : false,
            filling : 50,
            Date : new Date(_currentYear, _currentMonth-1, 1 )
        },
        {
            Id : 1,
            monthName : "Май",
            year : 2026,
            isSelected : false,
            isBlank : false,
            filling : 80,
            Date : new Date(_currentYear, _currentMonth-2, 1 )
        },
        {
            Id : 2,
            monthName : "Июнь",
            year : 2026,
            isSelected : false,
            isBlank : false,
            filling : 100,
            Date : new Date(_currentYear, _currentMonth-3, 1 )
        },
        {
            Id : 3,
            monthName : "Август",
            year : 2026,
            isSelected : false,
            isBlank : false,
            filling : 90,
            Date : new Date(_currentYear, _currentMonth-4, 1 )
        },
        {
            Id : 4,
            monthName : "Огрызок",
            year : 2026,
            isSelected : false,
            isBlank : false,
            filling : 50,
            Date : new Date(_currentYear, _currentMonth-5, 1 )
        },
        {
            Id : 5,
            monthName : "Огузок",
            year : 2026,
            isSelected : false,
            isBlank : false,
            filling : 60,
            Date : new Date(_currentYear, _currentMonth-6, 1 )
        },
        {
            Id : 6,
            monthName : "Май",
            year : 2026,
            isSelected : true,
            isBlank : false,
            filling : 65,
            Date : new Date(_currentYear, _currentMonth-7, 1 )
        }
    ];
export const ActivityCalendar = () =>{
    const [activityMatrix, setActivityMatrix] = useState<activityCell[]>([])
    const [monthsMatrix, setMonthsMatrix] = useState<IActivityCalendarPillar[]>([])
    const [selectedMonthDisplay, setSelectedMonthDisplay] = useState<string>();
    const [pillarsOffset, setPillarsOffset] = useState<number>(0);
    const [pillarsTransitionStatus, setPillarsTransitionStatus] = useState<boolean> (false);
    let preparedMonths : IActivityCalendarPillar[] = [];
    


    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const startDayOfMonth = new Date(currentYear, currentMonth, 1);
    let startDayOfWeek = startDayOfMonth.getDay();
    let activityMatrixFilled : activityCell[] = [];
    const [selectedYearDisplay, setSelectedYearDisplay] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

    let previouslySelectedMonthIndexOffset = -1;

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
    }
    function refreshMonthsDisplay(){
        const monthsToSet : IActivityCalendarPillar[] = BlankMonths;
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
                        filling : 2,
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
                
    }

    
    
    useEffect(()=>{
        setSelectedMonthDisplay(monthsStr[selectedMonth]);
        setMonthsMatrix(preparedMonths);
        setActivityMatrix(activityMatrixFilled);
        refreshMonthsDisplay();

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
        let m = monthsMatrix.find(x => x.isSelected === true);
        m!.isSelected = false;
        let electedMonth = monthsMatrix.find(x => x.Id === monthId);
        previouslySelectedMonthIndexOffset = monthsMatrix.indexOf(electedMonth!);
        
        setMonthsMatrix([...monthsMatrix]);
        if (electedMonth != null){
            electedMonth.isSelected = true;
            if (electedMonth?.year) setSelectedYearDisplay(electedMonth?.year);
            if (electedMonth?.monthName) setSelectedMonthDisplay(electedMonth?.monthName);
            
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
            if (electedMonth?.year) setSelectedYearDisplay(electedMonth?.year);
            if (electedMonth?.monthName) setSelectedMonthDisplay(electedMonth?.monthName);
            
        }
        refreshMonthsDisplay();

        //console.warn("switched to " + monthId)
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
                <div className="flex flex-col flex-2 w-60">
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