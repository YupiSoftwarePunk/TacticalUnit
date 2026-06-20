export function isDateBetweenDates(dateInQuestion : Date, lowerDate? : Date, biggerDate? : Date){
        let isHigherThanLowest : boolean = false;
        let isLowerThanHighest : boolean = false;
        let isBetween : boolean = false;
        if(!dateInQuestion){return false}
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

        return isBetween;
    }
export function isInThisMonth(dateInQuestion : Date, year : number, monthIndex : number){
        let isBetween : boolean = false;
        
        if (dateInQuestion && dateInQuestion.getFullYear() == year && dateInQuestion.getMonth() == monthIndex){
            isBetween = true;
        }

        return isBetween;
}