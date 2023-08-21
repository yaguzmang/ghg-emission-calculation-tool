'use client';

import { RefObject, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

export type InteractionData = {
  xPos: number;
  yPos: number;
};

export interface ChartTooltipProps
  extends React.ButtonHTMLAttributes<HTMLDivElement> {
  interactionData: InteractionData | null;
  containerRef: RefObject<HTMLDivElement>;
  xOffSet?: number;
  yOffSet?: number;
}
export const ChartTooltip = ({
  interactionData,
  containerRef,
  xOffSet = 0,
  yOffSet = 0,
  className,
  children,
}: ChartTooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tooltipRef.current && interactionData && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;

      const containerRight = containerRef.current.getBoundingClientRect().right;
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const maxAllowedX = containerRight - tooltipWidth - 10; // Adjust the offset

      const finalXPos =
        interactionData.xPos + containerLeft > maxAllowedX
          ? interactionData.xPos - tooltipWidth - xOffSet
          : interactionData.xPos + xOffSet;

      tooltipRef.current.style.left = `${finalXPos}px`;
    }
  }, [interactionData, containerRef, xOffSet]);

  return interactionData ? (
    <div
      ref={tooltipRef}
      className={cn('absolute bg-graph-tooltip translate-y-[10%]', className)}
      style={{
        top: interactionData.yPos + yOffSet,
      }}
    >
      {children}
    </div>
  ) : null;
};
