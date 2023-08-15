import { cn } from '@/lib/utils';

export type InteractionData = {
  xPos: number;
  yPos: number;
};

export interface ChartTooltipProps
  extends React.ButtonHTMLAttributes<HTMLDivElement> {
  interactionData: InteractionData | null;
}
export const ChartTooltip = ({
  interactionData,
  className,
  children,
}: ChartTooltipProps) => {
  if (!interactionData) {
    return null;
  }
  return (
    <div
      className={cn(
        'absolute bg-graph-tooltip translate-y-[10%] p-2',
        className,
      )}
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos,
      }}
    >
      {children}
    </div>
  );
};
