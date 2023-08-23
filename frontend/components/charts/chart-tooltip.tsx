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
      const tooltipHeight = tooltipRect.height;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRect.height;

      const containerRight = containerRect.right;
      const containerLeft = containerRect.left;
      const maxAllowedX = containerRight - tooltipWidth; // Adjust the offset

      const finalYPos =
        interactionData.yPos + tooltipHeight + yOffSet > containerHeight
          ? interactionData.yPos -
            (interactionData.yPos + tooltipHeight + yOffSet - containerHeight)
          : interactionData.yPos + yOffSet;

      const finalXPos =
        interactionData.xPos + containerLeft > maxAllowedX
          ? interactionData.xPos - tooltipWidth - xOffSet
          : interactionData.xPos + xOffSet;

      tooltipRef.current.style.left = `${finalXPos}px`;
      tooltipRef.current.style.top = `${finalYPos}px`;
    }
  }, [interactionData, containerRef, xOffSet, yOffSet]);

  return interactionData ? (
    <div
      ref={tooltipRef}
      className={cn('absolute bg-graph-tooltip', className)}
    >
      {children}
    </div>
  ) : null;
};
