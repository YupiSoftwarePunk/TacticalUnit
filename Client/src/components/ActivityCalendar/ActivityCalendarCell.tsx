import { useMemo } from "react";
import InfoContainer from "../ToolTip/InfoContainer";
import Tooltip from "../ToolTip/ToolTip";

export interface IActivityCalendarCell {
    isActive: boolean;
    isCurrentMonth: boolean;
    givenInfo?: IContainedInfo[];
    SingleDayActivities?: ISingleDayEvent[];
    States?: IUnitState[];
    dateDisplay?: string;
    borderColor?: string;
}

export const ActivityCalendarCell: React.FC<IActivityCalendarCell> = ({
    isActive,
    dateDisplay = "dd.mm.yyyy",
    isCurrentMonth,
    SingleDayActivities,
    States,
    givenInfo,
    borderColor
}) => {

    const prepInfo = useMemo(() => {
        let containedInfo: IContainedInfo[] = [];
        
        if (SingleDayActivities != undefined) {
            SingleDayActivities.forEach(element => {
                containedInfo.push({
                    type: "EVENT",
                    content: element.name,
                    color: element.color,
                    id: element.id
                });
            });
        }
        
        if (States != undefined) {
            States.forEach(element => {
                containedInfo.push({
                    type: "STATE",
                    content: element.status.name,
                    color: element.status.color,
                    id: element.id
                });
            });
        }
        
        if (givenInfo) {
            containedInfo = [...containedInfo, ...givenInfo];
        }
        
        return containedInfo;
    }, [SingleDayActivities, States, givenInfo]);

    return (
        <Tooltip 
            verticalPlacement="top" 
            tooltipAlignment="center" 
            tooltipText={dateDisplay} 
            style={borderColor ? { borderColor: borderColor } : undefined} 
            className={`flex size-full border-2 rounded-lg ${borderColor != undefined ? `` : "border-border-secondary"} ${isCurrentMonth ? "" : "hidden"}`}
        >
            <InfoContainer containedInfoList={prepInfo} appearOn="click" className={`flex size-full `}>
                <div className={`flex content-center justify-around size-full ${isActive ? "bg-green-400" : "bg-transparent"} rounded-md flex-wrap opacity-80`}>
                    {prepInfo.filter(x => x.type == "EVENT").map((item) => (
                        <div 
                            key={`${prepInfo.indexOf(item)}`} 
                            className="flex size-2 m-[2px] rounded-full self-center border border-border-secondary" 
                            style={{ backgroundColor: `${item.color}` }}
                        ></div>
                    ))}
                </div>
            </InfoContainer>
        </Tooltip>
    );
};