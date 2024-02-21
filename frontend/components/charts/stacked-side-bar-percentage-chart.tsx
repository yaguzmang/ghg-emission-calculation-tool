'use client';

import { useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useMeasure from 'react-use-measure';

import * as d3 from 'd3';

import { EmissionIconsByScope } from '../ui/icons/icons';
import { ChartTooltip, InteractionData } from './chart-tooltip';

export type StackedSideBarPercentageChartEntryData = {
  label: string;
  value: number;
  color: null | string;
  scope?: number;
};

export type StackedSideBarPercentageChartEntry = {
  title: string;
  data: StackedSideBarPercentageChartEntryData[];
};

type StackedSideBarPercentageChartInnerProps = {
  width: number;
  barHeight: number;
  data: StackedSideBarPercentageChartEntry[];
  unitLabel: string;
};

const MARGIN = { top: 10, right: 10, bottom: 30, left: 10 };

const StackedSideBarPercentageChartInner = ({
  width,
  barHeight,
  data,
  unitLabel,
}: StackedSideBarPercentageChartInnerProps) => {
  const { t } = useTranslation();
  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredElementData, setHoveredElementData] = useState<
    | (InteractionData & {
        label: string;
        value: number;
        percentage: number;
        scope: number | undefined;
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
        let xPosition = 0;

        const totalSumValues = d.data.reduce(
          (acc, entryData) => acc + entryData.value,
          0,
        );
        return (
          <g key={`bar-group-${d.title}`}>
            <g className="font-bold text-bar-label">
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
              {d.data.map((entry, index) => {
                const segmentWidth =
                  totalSumValues > 0
                    ? (entry.value / totalSumValues) * boundsWidth
                    : 0;

                const borderWidth = 1; // Width of the white border
                const borderOffset = index > 0 ? borderWidth : 0; // Offset for border

                const segment = (
                  <g
                    key={`segment-${d.title}-${entry.label}`}
                    onMouseMove={(e) => {
                      const svgRect =
                        tooltipContainerRef.current?.getBoundingClientRect();
                      if (!svgRect) return;

                      const svgX = e.clientX - svgRect.left;
                      const svgY = e.clientY - svgRect.top;

                      setHoveredElementData({
                        xPos: svgX,
                        yPos: svgY,
                        label: entry.label,
                        value: entry.value,
                        scope: entry.scope,
                        percentage:
                          totalSumValues > 0
                            ? (entry.value / totalSumValues) * 100
                            : 0,
                      });
                    }}
                    onMouseLeave={() => setHoveredElementData(null)}
                  >
                    {index > 0 && (
                      <rect
                        x={xPosition - borderOffset} // Adjusted to add the border on the left
                        y={0}
                        width={borderWidth}
                        height={barHeight}
                        fill="white"
                      />
                    )}
                    <rect
                      x={xPosition}
                      y={0}
                      width={segmentWidth - borderOffset} // Adjusted for the border width
                      height={barHeight}
                      fill={entry.color || '#9396B0'}
                    />
                  </g>
                );
                xPosition += segmentWidth;
                return segment;
              })}
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
        className="pointer-events-none absolute left-0 top-0 h-full w-full translate-y-2 text-graph-tooltip-foreground"
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
            <div className="flex flex-col gap-3 p-2 font-normal">
              <div className="flex items-center gap-1 text-base">
                <span>
                  {hoveredElementData.scope !== undefined &&
                    EmissionIconsByScope[
                      hoveredElementData.scope as keyof typeof EmissionIconsByScope
                    ]}
                </span>
                <span className="">{hoveredElementData.label}</span>
              </div>
              <div className="flex items-center justify-between gap-12 px-2 text-base">
                <div className="flex flex-col">
                  <span className="text-xs">
                    {t('results.ghgEmissionsByCategoryOverUnit.percentOfAll')}
                  </span>
                  <span className="text-base">
                    {hoveredElementData.percentage.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="ml-auto text-xs">
                    <Trans i18nKey={unitLabel} />
                  </span>
                  <span className="ml-auto text-base">
                    {hoveredElementData.value.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </ChartTooltip>
      </div>
    </>
  );
};

type StackedSideBarPercentageChartProps = {
  data: StackedSideBarPercentageChartEntry[];
  unitLabel: string;
  barHeight: number;
};

export function StackedSideBarPercentageChart({
  data,
  barHeight,
  unitLabel,
}: StackedSideBarPercentageChartProps) {
  const [ref, bounds] = useMeasure();

  return (
    <div ref={ref} className="h-content relative w-full">
      {bounds.width > 0 && (
        <StackedSideBarPercentageChartInner
          data={data}
          width={bounds.width}
          barHeight={barHeight}
          unitLabel={unitLabel}
        />
      )}
    </div>
  );
}
