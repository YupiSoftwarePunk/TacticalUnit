import { useState } from "react";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  className_Tooltip?: string;
  tooltipText?: string;
  tooltipAlignment? : "left" | "center" | "right";
  verticalPlacement? : "top" | "bottom"
}
const Tooltip = ({children, tooltipText, className, innerClassName, className_Tooltip, tooltipAlignment = "left", verticalPlacement="bottom"}:CardProps) =>{
    const [showTooltip, setShowTooltip] = useState(false);
    return(
        <div className={`relative ${className}`} onMouseOver={()=>{setShowTooltip(true)}} onMouseLeave={()=>{setShowTooltip(false)}}>
            {tooltipText && verticalPlacement == "top" &&
            <div className={`
                absolute text-text-primary font-text-bold bottom-full z-100 bg-bg-primary px-4 py-2 border border-border-secondary transition-all pointer-events-none ${showTooltip? "":"opacity-0"}
            ${tooltipAlignment == "left"? "left-0" : ""}
            ${tooltipAlignment == "right"? "right-0" : ""}
            ${tooltipAlignment == "center"? "self-center" : ""}
            `}>
                <p className={`uppercase  ${className_Tooltip}`} >{tooltipText}</p>
            </div>
            }
            <div className={`size-full ${innerClassName}`}>{children}</div>
            {tooltipText && verticalPlacement == "bottom" &&
            <div className={`
                absolute text-text-primary font-text-bold top-full z-100 bg-bg-primary px-4 py-2 border border-border-secondary transition-all pointer-events-none ${showTooltip? "":"opacity-0"}
            ${tooltipAlignment == "left"? "left-0" : ""}
            ${tooltipAlignment == "right"? "right-0" : ""}
            ${tooltipAlignment == "center"? "self-center" : ""}
            `}>
                <p className={`uppercase  ${className_Tooltip}`} >{tooltipText}</p>
            </div>
            }
        </div>
    )
}

export default Tooltip;