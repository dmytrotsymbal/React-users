import { ReactNode, ReactElement, forwardRef } from "react";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

type Props = {
  title: string;
  placement: "top" | "bottom" | "left" | "right";
  children: ReactNode; // Підтримка ReactNode
};

// Виправлений CustomTooltip із forwardRef
const CustomTooltip = forwardRef<HTMLDivElement, Props>(
  ({ title, placement, children }, ref) => {
    // Якщо children є ReactElement, тоді рендеримо Tooltip
    if (!children || typeof children !== "object" || !("type" in children)) {
      return null; // Повертаємо null, якщо children не є коректним ReactElement
    }

    return (
      <StyledCustomTooltip
        ref={ref} // Передаємо ref у Tooltip
        title={String(title)}
        placement={placement}
        arrow
      >
        {children as ReactElement}
      </StyledCustomTooltip>
    );
  }
);

// StyledCustomTooltip для стилізації тултипу
const StyledCustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#202123 !important",
    color: "#c5c5d2",
    maxWidth: 150,
    padding: 10,
    fontSize: "12px",
    borderRadius: "5px",
    border: "0.1px solid hsla(0, 0%, 100%, 0.2)",
  },
}));

// З forwardRef треба використовувати displayName, якщо це необхідно
CustomTooltip.displayName = "CustomTooltip";

export default CustomTooltip;
