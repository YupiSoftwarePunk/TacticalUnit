export function isDateBetweenDates(dateInQuestion : Date, lowerDate? : Date, biggerDate? : Date){
        let isHigherThanLowest : boolean = false;
        let isLowerThanHighest : boolean = false;
        let isBetween : boolean = false;
        if(!dateInQuestion){return false}
        if(dateInQuestion == undefined){return false}
        if(dateInQuestion == null){return false}
        try{
            if (lowerDate){

                if ((dateInQuestion.getFullYear() > lowerDate.getFullYear() || dateInQuestion.getFullYear() == lowerDate.getFullYear()) &&
                (dateInQuestion.getMonth() > lowerDate.getMonth() || dateInQuestion.getMonth() == lowerDate.getMonth())&&
                (dateInQuestion.getDate() > lowerDate.getDate()) ) {isHigherThanLowest = true;}
            }
            if(biggerDate){

                if ((dateInQuestion.getFullYear() < biggerDate.getFullYear() || dateInQuestion.getFullYear() == biggerDate.getFullYear()) &&
                (dateInQuestion.getMonth() < biggerDate.getMonth() || dateInQuestion.getMonth() == biggerDate.getMonth())&&
                (dateInQuestion.getDate() < biggerDate.getDate())){isLowerThanHighest = true;}
            }
            if(isHigherThanLowest && isLowerThanHighest){
                isBetween = true;
            }
        }catch{ return false}

        return isBetween;
    }

export function isDateBetween(dateInQuestion: Date, lowerDate: Date, biggerDate: Date, inclusive: boolean = true): boolean {
    const targetTime = dateInQuestion.getTime();
    
    
    const minTime = Math.min(lowerDate.getTime(), biggerDate.getTime());
    const maxTime = Math.max(lowerDate.getTime(), biggerDate.getTime());

    if (inclusive) {
        return targetTime >= minTime && targetTime <= maxTime;
    } else {
        return targetTime > minTime && targetTime < maxTime;
    }
}
export function isInThisMonth(dateInQuestion : Date, year : number, monthIndex : number){
        let isBetween : boolean = false;
        
        if(!dateInQuestion){return false}
        if(dateInQuestion == undefined){return false}
        if(dateInQuestion == null){return false}
        try{

            
            if (dateInQuestion.getFullYear() == year && dateInQuestion.getMonth() == monthIndex){
                isBetween = true;
            }
        }catch{ return false}
            
        return isBetween;
}