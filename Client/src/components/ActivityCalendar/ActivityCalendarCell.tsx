import { useState } from "react"
import InfoContainer, { IContainedInfo } from "../ToolTip/InfoContainer"

export interface IActivityCalendarCell{
    isActive : boolean,
    isCurrentMonth : boolean,
    givenInfo?: IContainedInfo[]
    SingleDayActivities? : ISingleDayEvent[],
    States? : IUnitState[],
}
export const ActivityCalendarCell: React.FC<IActivityCalendarCell> = ({isActive,isCurrentMonth, SingleDayActivities, States, givenInfo}) =>
{
    function prepareGivenInfo(){
        let containedInfo : IContainedInfo[] = [];
        if(SingleDayActivities!= undefined){
            SingleDayActivities.forEach(element => {
                containedInfo.push({
                    content: element.name,
                    color : element.color
                })
            });
        }
        if(States!= undefined){
            States.forEach(element => {
                containedInfo.push({
                    content: element.status.name,
                    color : element.status.color
                })
            });
        }
        if (givenInfo){
            containedInfo = [...containedInfo, ...givenInfo]
        }
        return containedInfo;

    }
    return(
        <InfoContainer containedInfoList={prepareGivenInfo()} className={`flex size-full border-2 rounded-lg border-border-secondary ${isCurrentMonth? "":"hidden"}`}>
            <div className={`flex size-full ${isActive? "bg-green-400" : "bg-transparent"} rounded-md opacity-80`}>

            </div>
        </InfoContainer>
    )
}