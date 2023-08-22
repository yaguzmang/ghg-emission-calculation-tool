'use client';

import { useMemo, useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import useMeasure from 'react-use-measure';

import * as d3 from 'd3';

import { ChartTooltip, InteractionData } from './chart-tooltip';

export type SideBarPercentageChartEntry = {
  title: string;
  value: number;
  total: number;
  color: null | string;
};

type SideBarPercentageChartInnerProps = {
  width: number;
  barHeight: number;
  data: SideBarPercentageChartEntry[];
  unitLabel: string;
};

const MARGIN = { top: 10, right: 10, bottom: 30, left: 10 };

const SideBarPercentageChartInner = ({
  width,
  barHeight,
  data,
  unitLabel,
}: SideBarPercentageChartInnerProps) => {
  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredElementData, setHoveredElementData] = useState<
    | (InteractionData & {
        value: number;
        percentage: number;
      })
    | null
  >(null);
  const fontSize = 12;
  const titlePadding = 10; // Padding between titles and bars

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const axisLabelHeight = 40; // Height of the axis labels area
  const chartTotalHeight =
    (barHeight + fontSize + titlePadding) * data.length + axisLabelHeight;

  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(data.map((d) => d.title))
        .range([axisLabelHeight, chartTotalHeight]),
    [data, chartTotalHeight],
  );

  const xScale = useMemo(
    () => d3.scaleLinear().domain([0, 100]).range([0, boundsWidth]),
    [boundsWidth],
  );

  const axisLabels = useMemo(
    () =>
      xScale.ticks(10).map((value, i) => (
        <text
          key={`axis-label-${value}`}
          x={
            MARGIN.left +
            xScale(value) +
            (i === 0 ? 8 : 0) +
            (i === 10 ? -5 : 0)
          }
          y={0}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={fontSize}
          fill="currentColor"
        >
          {`${value}%`}
        </text>
      )),
    [xScale],
  );

  const allBars = useMemo(
    () =>
      data.map((d) => {
        const titleY = yScale(d.title) ?? 0;
        const segmentWidth =
          d.total > 0 ? (d.value / d.total) * boundsWidth : 0;
        return (
          <g key={`bar-group-${d.title}`}>
            <g className="text-bar-label font-bold">
              <text
                x={MARGIN.left}
                y={titleY - titlePadding}
                textAnchor="start"
                alignmentBaseline="middle"
                fontSize={fontSize}
                fill="currentColor"
              >
                {d.title}
              </text>
            </g>
            <g transform={`translate(${[MARGIN.left, titleY].join(',')})`}>
              {
                <g
                  onMouseMove={(e) => {
                    const svgRect =
                      tooltipContainerRef.current?.getBoundingClientRect();
                    if (!svgRect) return;

                    const svgX = e.clientX - svgRect.left;
                    const svgY = e.clientY - svgRect.top;

                    setHoveredElementData({
                      xPos: svgX,
                      yPos: svgY,
                      value: d.value,
                      percentage: d.total > 0 ? (d.value / d.total) * 100 : 0,
                    });
                  }}
                  onMouseLeave={() => setHoveredElementData(null)}
                >
                  <rect
                    x={0}
                    y={0}
                    width={boundsWidth}
                    height={barHeight}
                    fill="#EBECF1"
                  />
                  <rect
                    x={0}
                    y={0}
                    width={segmentWidth} // Adjusted for the border width
                    height={barHeight}
                    fill={d.color || '#9396B0'}
                  />
                </g>
              }
            </g>
          </g>
        );
      }),
    [data, boundsWidth, barHeight, yScale],
  );

  return (
    <>
      <svg viewBox={`0 0 ${width} ${chartTotalHeight}`}>
        <g
          transform={`translate(${[0, MARGIN.top].join(',')})`}
          className="text-bar-axis-label"
        >
          {axisLabels}
          {allBars}
        </g>
      </svg>
      {/* Tooltip */}
      <div
        ref={tooltipContainerRef}
        className="absolute top-0 left-0 pointer-events-none text-graph-tooltip-foreground translate-y-2 w-full h-full"
        style={{
          marginLeft: MARGIN.left,
          marginTop: MARGIN.top,
        }}
      >
        <ChartTooltip
          interactionData={
            hoveredElementData
              ? {
                  xPos: hoveredElementData.xPos,
                  yPos: hoveredElementData.yPos,
                }
              : null
          }
          containerRef={tooltipContainerRef}
          xOffSet={10}
          yOffSet={10}
        >
          {hoveredElementData ? (
            <div className="flex flex-col p-2 gap-3 font-normal items-center">
              <div className="flex items-center gap-2">
                <span className="text-base">{hoveredElementData.value}</span>
                <span className="text-xs">
                  <Trans i18nKey={unitLabel} />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {hoveredElementData.percentage.toFixed(2)}
                </span>
                <span className="text-xs">%</span>
              </div>
            </div>
          ) : null}
        </ChartTooltip>
      </div>
    </>
  );
};

type SideBarPercentageChartProps = {
  data: SideBarPercentageChartEntry[];
  unitLabel: string;
  barHeight: number;
};

export function SideBarPercentageChart({
  data,
  barHeight,
  unitLabel,
}: SideBarPercentageChartProps) {
  const [ref, bounds] = useMeasure();

  return (
    <div ref={ref} className="relative w-full h-content">
      {bounds.width > 0 && (
        <SideBarPercentageChartInner
          data={data}
          width={bounds.width}
          barHeight={barHeight}
          unitLabel={unitLabel}
        />
      )}
    </div>
  );
}
