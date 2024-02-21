'use client';

import { useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useMeasure from 'react-use-measure';

import * as d3 from 'd3';

import { ChartTooltip, InteractionData } from './chart-tooltip';

export type StackedSideBarPercentageChartWithTotalEntryData = {
  label: string;
  value: number;
  color: null | string;
};

export type StackedSideBarPercentageChartWithTotalEntry = {
  title: string;
  data: StackedSideBarPercentageChartWithTotalEntryData[];
};

type StackedSideBarPercentageChartWithTotalInnerProps = {
  width: number;
  barHeight: number;
  data: StackedSideBarPercentageChartWithTotalEntry[];
  unitLabel: string;
  total: number;
};

const MARGIN = { top: 10, right: 10, bottom: 80, left: 10 };

const StackedSideBarPercentageChartWithTotalInner = ({
  width,
  barHeight,
  data,
  unitLabel,
  total,
}: StackedSideBarPercentageChartWithTotalInnerProps) => {
  const { t } = useTranslation();
  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredElementData, setHoveredElementData] = useState<
    | (InteractionData & {
        total: number;
        data: StackedSideBarPercentageChartWithTotalEntryData[];
      })
    | null
  >(null);
  const fontSize = 12;
  const titlePadding = 10; // Padding between titles and bars

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const axisLabelHeight = 40; // Height of the axis labels area
  const chartTotalHeight =
    (barHeight + fontSize + titlePadding) * data.length + axisLabelHeight;
  const canvasHeight = chartTotalHeight + MARGIN.top + MARGIN.bottom;
  const backgroundPadding = 1;

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
          key={`axis-label-with-total-${value}`}
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
        const barGroupWidth = boundsWidth + backgroundPadding * 2;
        return (
          <g
            key={`bar-group-with-total-${d.title}`}
            onMouseMove={(e) => {
              const svgRect =
                tooltipContainerRef.current?.getBoundingClientRect();
              if (!svgRect) return;

              const svgX = e.clientX - svgRect.left;
              const svgY = e.clientY - svgRect.top;

              setHoveredElementData({
                xPos: svgX,
                yPos: svgY,
                total,
                data: d.data,
              });
            }}
            onMouseLeave={() => setHoveredElementData(null)}
          >
            <rect
              x={MARGIN.left - backgroundPadding}
              y={titleY - backgroundPadding}
              width={barGroupWidth}
              height={barHeight + backgroundPadding * 2}
              fill="white"
            />

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
              {d.data.map((entry) => {
                const segmentWidth =
                  total > 0 ? (entry.value / total) * boundsWidth : 0;
                if (segmentWidth === 0) return null;

                const borderWidth = 1;

                const segment = (
                  <g key={`segment-${d.title}-${entry.label}`}>
                    <rect
                      x={xPosition}
                      y={0}
                      width={segmentWidth - borderWidth} // Adjusted for the border width
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
    [data, boundsWidth, barHeight, yScale, total],
  );

  return (
    <>
      {width > 0 ? (
        <svg viewBox={`0 0 ${width} ${canvasHeight}`}>
          <g
            transform={`translate(${[0, MARGIN.top].join(',')})`}
            className="text-bar-axis-label"
          >
            {axisLabels}
            {allBars}
          </g>
        </svg>
      ) : (
        <svg viewBox={`0 0 0 ${canvasHeight}`} />
      )}
      {/* Tooltip */}
      <div
        ref={tooltipContainerRef}
        className="pointer-events-none absolute left-0 top-0 h-full w-full translate-y-2 text-graph-tooltip-foreground"
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
          xOffSet={30}
          yOffSet={20}
        >
          {hoveredElementData !== null && (
            <div className="flex min-w-[176px] flex-col gap-6 px-5 py-2 font-normal">
              {hoveredElementData.data.map((entry) => (
                <div key={`tooltip-sbpct-${entry.label}`}>
                  <div className="mr-auto flex items-center gap-1 text-base">
                    <span>{entry.label}</span>
                  </div>
                  <div className="mt-2 flex w-full justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs">
                        {t('dashboard.form.allGHGEmissions.percentOfTotal')}
                      </span>
                      <span className="text-base">
                        {Number(
                          (total > 0 ? (entry.value / total) * 100 : 0).toFixed(
                            2,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="ml-auto text-xs">
                        <Trans i18nKey={unitLabel} />
                      </span>
                      <span className="ml-auto text-base">
                        {entry.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartTooltip>
      </div>
    </>
  );
};

type StackedSideBarPercentageChartWithTotalProps = {
  data: StackedSideBarPercentageChartWithTotalEntry[];
  unitLabel: string;
  barHeight: number;
  total: number;
};

export function StackedSideBarPercentageChartWithTotal({
  data,
  barHeight,
  unitLabel,
  total,
}: StackedSideBarPercentageChartWithTotalProps) {
  const [ref, bounds] = useMeasure();

  return (
    <div ref={ref} className="relative w-full">
      <StackedSideBarPercentageChartWithTotalInner
        data={data}
        width={bounds.width}
        barHeight={barHeight}
        unitLabel={unitLabel}
        total={total}
      />
    </div>
  );
}
