import { useEffect, useState } from "react"
import InfoContainer from "../ToolTip/InfoContainer";
import Tooltip from "../ToolTip/ToolTip";

export interface IActivityCalendarCell{
    isActive : boolean,
    isCurrentMonth : boolean,
    givenInfo?: IContainedInfo[]
    SingleDayActivities? : ISingleDayEvent[],
    States? : IUnitState[],
    dateDisplay? : string,
    borderColor? : string
}
export const ActivityCalendarCell: React.FC<IActivityCalendarCell> = ({isActive, dateDisplay = "dd.mm.yyyy", isCurrentMonth, SingleDayActivities, States, givenInfo, borderColor}) =>
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
        <Tooltip verticalPlacement="top" tooltipAlignment="center" tooltipText={dateDisplay} style={borderColor? {borderColor: borderColor} : undefined} className={`flex size-full  border-2 rounded-lg ${borderColor != undefined? `` : "border-border-secondary"}  ${isCurrentMonth? "":"hidden"}`}>

            <InfoContainer containedInfoList={prepareGivenInfo()} appearOn="click" className={`flex size-full `} >
                <div className={`flex size-full ${isActive? "bg-green-400" : "bg-transparent"} rounded-md opacity-80`}>

                </div>
            </InfoContainer>
        </Tooltip>
    )
}