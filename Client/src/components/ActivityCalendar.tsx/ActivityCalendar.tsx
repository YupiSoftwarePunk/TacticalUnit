import { useEffect, useState } from "react";
import { ActivityCalendarCell } from "./ActivityCalendarCell";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { ActivityCalendarPillar, IActivityCalendarPillar } from "./ActivityCalendarPillar";

interface activityCell {
    id: number;
    date: Date;
    isCurrentMonth: boolean;
    isChecked: boolean;
}

const monthsStr = [
    "Январь", "Февраль", "Март", 
    "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь",
    "Октябрь", "Ноябрь", "Декабрь"
];

const BlankMonths: IActivityCalendarPillar[] = [
    { Id: 0, monthName: "Апрель", year: 2026, isSelected: false, isBlank: false, filling: 50 },
    { Id: 1, monthName: "Май", year: 2026, isSelected: true, isBlank: false, filling: 80 }
];

export const ActivityCalendar = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const [activityMatrix] = useState<activityCell[]>(() => {
        const matrix: activityCell[] = [];
        const startDayOfMonth = new Date(currentYear, currentMonth, 1);
        const startDayOfWeek = startDayOfMonth.getDay();

        const adjustedDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek;

        for (let i = 0; i < adjustedDayOfWeek - 1; i++) {
            matrix.push({
                id: i,
                date: new Date(),
                isCurrentMonth: false,
                isChecked: false
            });
        }
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let i = 0; i < totalDays; i++) {
            matrix.push({
                id: i + matrix.length,
                date: new Date(),
                isCurrentMonth: true,
                isChecked: false
            });
        }
        return matrix;
    });

    const [monthsMatrix, setMonthsMatrix] = useState<IActivityCalendarPillar[]>(() => {
        const monthsToSet = [...BlankMonths];
        if (monthsToSet.length < 5) {
            while (monthsToSet.length < 5) {
                const blank: IActivityCalendarPillar = {
                    isBlank: true,
                    filling: 0,
                    Id: monthsToSet.length + 100,
                    isSelected: false,
                };
                monthsToSet.unshift(blank);
            }
        }
        return monthsToSet;
    });

    const [selectedMonth] = useState<number>(currentMonth);
    const [selectedMonthDisplay, setSelectedMonthDisplay] = useState<string>(monthsStr[currentMonth]);
    const [selectedYearDisplay, setSelectedYearDisplay] = useState<number>(currentYear);

    function lowerSelectedMonth() {
        const currentActive = monthsMatrix.find(x => x.isSelected === true);
        if (currentActive) {
            const currentMonthId = monthsMatrix.indexOf(currentActive);
            if (currentMonthId !== -1 && currentMonthId - 1 >= 0) {
                if (!monthsMatrix[currentMonthId - 1].isBlank) {
                    setActiveMonthByListIndex(currentMonthId - 1);
                }
            }
        }
    }
    
    function enlargeSelectedMonth() {
        const currentActive = monthsMatrix.find(x => x.isSelected === true);
        if (currentActive) {
            const currentMonthId = monthsMatrix.indexOf(currentActive);
            if (currentMonthId !== -1 && currentMonthId + 1 < monthsMatrix.length) {
                if (!monthsMatrix[currentMonthId + 1].isBlank) {
                    setActiveMonthByListIndex(currentMonthId + 1);
                }
            }
        }
    }

    const setActiveMonthById = (monthId: number) => {
        const updatedMatrix = monthsMatrix.map(month => {
            const isTarget = month.Id === monthId;
            if (isTarget) {
                if (month.year) setSelectedYearDisplay(month.year);
                if (month.monthName) setSelectedMonthDisplay(month.monthName);
            }
            return { ...month, isSelected: isTarget };
        });
        setMonthsMatrix(updatedMatrix);
    };

    const setActiveMonthByListIndex = (index: number) => {
        const updatedMatrix = monthsMatrix.map((month, idx) => {
            const isTarget = idx === index;
            if (isTarget) {
                if (month.year) setSelectedYearDisplay(month.year);
                if (month.monthName) setSelectedMonthDisplay(month.monthName);
            }
            return { ...month, isSelected: isTarget };
        });
        setMonthsMatrix(updatedMatrix);
    };

    return (
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
                        
                        {activityMatrix.map((item) => (
                            <div key={item.id} className="flex size-10">
                                <ActivityCalendarCell isActive={item.isChecked} isCurrentMonth={item.isCurrentMonth} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col flex-2 w-60">
                    <div className="flex flex-1">
                        <div className="grid flex-1 gap-1 grid-cols-5">
                            {monthsMatrix.map((item) => (
                                <ActivityCalendarPillar 
                                    isBlank={item.isBlank} 
                                    switchMonthMethod={setActiveMonthById} 
                                    key={item.Id} 
                                    Id={item.Id} 
                                    monthName={item.monthName} 
                                    year={item.year} 
                                    isSelected={item.isSelected} 
                                    filling={item.filling} 
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex h-1 w-full border-b" />
                    <div className="flex justify-between">
                        <button onClick={lowerSelectedMonth}>
                            <ArrowBigLeft className="flex size-8 text-text-primary hover:text-accent-hover transition-all" />
                        </button>
                        <p className="flex self-center justify-center text-center text-text-primary">
                            {selectedMonthDisplay} {selectedYearDisplay}
                        </p>
                        <button onClick={enlargeSelectedMonth}>
                            <ArrowBigRight className="flex size-8 text-text-primary hover:text-accent-hover transition-all" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};