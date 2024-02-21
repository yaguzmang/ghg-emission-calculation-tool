'use client';

import { useMemo, useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import useMeasure from 'react-use-measure';

import * as d3 from 'd3';

import { ChartTooltip, InteractionData } from './chart-tooltip';

import { cn } from '@/lib/utils';

export type LollipopEntry = {
  label: string;
  value: number;
  color: null | string;
};

const MARGIN = { top: 32, right: 15, bottom: 30, left: 15 };

type LollipopChartInnerProps = {
  width: number;
  height: number;
  data: LollipopEntry[];
  heightSizeType: 'container' | 'fit-content';
  unitLabel: string;
  sort: boolean;
};

export const LollipopChartInner = ({
  width,
  height,
  data,
  heightSizeType,
  unitLabel,
  sort,
}: LollipopChartInnerProps) => {
  const tooltipContainerRef = useRef<HTMLDivElement>(null);

  const lollipopRadius = 10;
  const fontSize = 10;
  const labelCharWidth = 5.3; // Depends on font type and size
  const labelBottomMargin = 6;
  const entryXPadding = 10;
  const entryHeight =
    2 * lollipopRadius + fontSize + labelBottomMargin + entryXPadding;
  const entriesHeight = data.length * entryHeight;

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight =
    heightSizeType === 'container'
      ? height - MARGIN.top - MARGIN.bottom - 5 // -5 to avoid the graph to expand due to sizing glitch
      : entriesHeight;

  const totalSvgContainerHeight =
    heightSizeType === 'container'
      ? height
      : entriesHeight + MARGIN.top + MARGIN.bottom;

  const [hoveredElementData, setHoveredElementData] = useState<
    (InteractionData & { label: string; value: number }) | null
  >(null);

  const yScale = useMemo(() => {
    const groups = sort
      ? data.sort((a, b) => b.value - a.value).map((d) => d.label)
      : data.map((d) => d.label);
    return d3.scaleBand().domain(groups).range([0, boundsHeight]).padding(1);
  }, [data, boundsHeight, sort]);

  const xScale = useMemo(() => {
    const [, max] = d3.extent(data.map((d) => d.value));
    return d3
      .scaleLinear()
      .domain([0, max || 10])
      .range([0, boundsWidth]);
  }, [data, boundsWidth]);

  const allShapes = useMemo(
    () =>
      data.map((d, _i) => {
        const y = yScale(d.label) ?? 0 + yScale.bandwidth() / 2;
        const circleStrokeColor = d.color || '#9396B0';
        const circleFillColor = d.color || '#9396B0';

        let labelAnchorX = xScale(d.value);
        // Move label text to the left if it overflows
        const labelAnchorWidth = d.label.length * labelCharWidth;
        if (labelAnchorX + labelAnchorWidth > boundsWidth) {
          labelAnchorX = boundsWidth - labelAnchorWidth;
        }
        return (
          <g key={`lollipop-line-group-${y}`} className="text-lollipop-line">
            <line
              x1={xScale(0)}
              y1={y}
              y2={y}
              x2={xScale(d.value)}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <circle
              cy={y}
              cx={xScale(d.value)}
              stroke={circleStrokeColor}
              fill={circleFillColor}
              strokeWidth={1}
              r={lollipopRadius}
              onMouseEnter={() => {
                setHoveredElementData({
                  xPos: xScale(d.value),
                  yPos: y,
                  label: d.label,
                  value: d.value,
                });
              }}
              onMouseLeave={() => setHoveredElementData(null)}
            />
            <g className="font-bold text-lollipop-label">
              <text
                x={labelAnchorX}
                y={y - lollipopRadius - labelBottomMargin}
                textAnchor="start"
                alignmentBaseline="central"
                fontSize={fontSize}
                fill="currentColor"
              >
                {d.label}
              </text>
            </g>
          </g>
        );
      }),
    [data, yScale, xScale, boundsWidth],
  );

  const grid = useMemo(
    () =>
      xScale
        .ticks(5)
        .slice(1)
        .map((value, i) => (
          <g
            key={`lollipop-grid-group-${value}`}
            className="font-normal text-lollipop-line"
          >
            {i === 0 && (
              <>
                <line
                  x1={0}
                  x2={0}
                  y1={0}
                  y2={boundsHeight}
                  stroke="currentColor"
                  strokeWidth={1}
                />
                <g className="text-lollipop-value">
                  <text
                    x={0}
                    y={-24}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    fontSize={18}
                    fill="currentColor"
                  >
                    0
                  </text>
                </g>
              </>
            )}
            <line
              x1={xScale(value)}
              x2={xScale(value)}
              y1={0}
              y2={boundsHeight}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <g className="text-lollipop-value">
              <text
                x={xScale(value)}
                y={-24}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={18}
                fill="currentColor"
              >
                {value}
              </text>
            </g>
          </g>
        )),
    [xScale, boundsHeight],
  );

  return (
    <>
      <svg viewBox={`0 0 ${width} ${totalSvgContainerHeight}`}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {grid}
          {allShapes}
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
          yOffSet={5}
        >
          {hoveredElementData ? (
            <div className="p-2">
              <span className="text-sm">
                {hoveredElementData.value.toFixed(2)}
              </span>
              <span className="pl-2 text-sm">
                <Trans i18nKey={unitLabel} />
              </span>
            </div>
          ) : null}
        </ChartTooltip>
      </div>
    </>
  );
};

type LollipopChartProps = {
  data: LollipopEntry[];
  unitLabel: string;
  heightSizeType: 'container' | 'fit-content';
  sort?: boolean;
};

export function LollipopChart({
  data,
  heightSizeType,
  unitLabel,
  sort = true,
}: LollipopChartProps) {
  const [ref, bounds] = useMeasure();

  return (
    <>
      <span className="ml-7 mr-auto py-[1px] text-lg text-text-regular">
        <Trans i18nKey={unitLabel} />
      </span>
      <div
        ref={ref}
        className={cn('relative w-full', {
          'h-full': heightSizeType === 'container',
          'h-content': heightSizeType === 'fit-content',
        })}
      >
        {bounds.width > 0 && (
          <LollipopChartInner
            data={data}
            width={bounds.width}
            height={heightSizeType === 'container' ? bounds.height : 0}
            heightSizeType={heightSizeType}
            unitLabel={unitLabel}
            sort={sort}
          />
        )}
      </div>
    </>
  );
}
