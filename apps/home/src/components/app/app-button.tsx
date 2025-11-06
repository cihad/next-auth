import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface AppButtonProps extends ComponentProps<typeof Button> {
  tooltip?: string;
}

export default function AppButton({ tooltip, ...buttonProps }: AppButtonProps) {
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button {...buttonProps} />
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return <Button {...buttonProps} />;
}
