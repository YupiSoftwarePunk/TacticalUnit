import { useState } from "react";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  tooltipText?: string;
  tooltipAlignment? : "left" | "center" | "right"
}
const Tooltip = ({children, tooltipText, className, tooltipAlignment = "left"}:CardProps) =>{
    const [showTooltip, setShowTooltip] = useState(false);
    return(
        <div className={`relative ${className}`} onMouseOver={()=>{setShowTooltip(true)}} onMouseLeave={()=>{setShowTooltip(false)}}>
            <div className={`size-full`}>{children}</div>
            {tooltipText &&
            <div className={`
                absolute text-text-primary font-text-bold top-full z-100 bg-bg-primary px-4 py-2 border border-border-secondary transition-all pointer-events-none ${showTooltip? "":"opacity-0"}
            ${tooltipAlignment == "left"? "left-0" : ""}
            ${tooltipAlignment == "right"? "right-0" : ""}
            ${tooltipAlignment == "center"? "self-center" : ""}
            `}>
                <p className=" uppercase" style={{fontSize: "16px"}}>{tooltipText}</p>
            </div>
            }
        </div>
    )
}

export default Tooltip;