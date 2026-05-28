import { useState } from "react";

interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  tooltipText: string;
}
const Tooltip = ({children, header, footer, tooltipText, className}:CardProps) =>{
    const [showTooltip, setShowTooltip] = useState(false);
    return(
        <div className={`relative ${className}`} onMouseOver={()=>{setShowTooltip(true)}} onMouseLeave={()=>{setShowTooltip(false)}}>
            <div className={className}>{children}</div>
            <div className={`absolute text-text-primary font-text-bold top-full z-100 bg-bg-primary px-4 py-2 border border-border-secondary transition-all pointer-events-none ${showTooltip? "":"opacity-0"}`}>
                <p className=" uppercase" style={{fontSize: "16px"}}>{tooltipText}</p>
            </div>
        </div>
    )
}

export default Tooltip;