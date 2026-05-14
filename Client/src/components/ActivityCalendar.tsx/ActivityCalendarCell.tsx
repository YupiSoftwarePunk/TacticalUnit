export interface IActivityCalendarCell{
    isActive : boolean,
    isCurrentMonth : boolean
}
export const ActivityCalendarCell: React.FC<IActivityCalendarCell> = ({isActive,isCurrentMonth}) =>
{
    return(
        <div className={`flex size-full border-2 rounded-lg border-border-secondary ${isCurrentMonth? "":"hidden"}`}>
            <div className={`flex size-full ${isActive? "bg-green-400" : "bg-transparent"}`}>

            </div>
        </div>
    )
}