'use client';

import { useMemo } from 'react';
import useMeasure from 'react-use-measure';

export type OverlappingProportionalBarChartEntryData = {
  value: number;
  color: null | string;
};

type OverlappingProportionalBarChartInnerProps = {
  width: number;
  barHeight: number;
  data: OverlappingProportionalBarChartEntryData[];
  highestTotal: number;
};

const MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };

const OverlappingProportionalBarChartInner = ({
  width,
  barHeight,
  data,
  highestTotal,
}: OverlappingProportionalBarChartInnerProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const chartTotalHeight = barHeight;

  const allBars = useMemo(
    () =>
      data.map((d, index) => {
        const segmentWidth =
          highestTotal > 0 ? (d.value / highestTotal) * boundsWidth : 0;
        return (
          <g key={`bar-group-${d.value}-${index + 1}`}>
            <rect
              x={0}
              y={0}
              width={segmentWidth}
              height={barHeight}
              fill={d.color || '#9396B0'}
            />
          </g>
        );
      }),
    [data, boundsWidth, barHeight, highestTotal],
  );

  return (
    <svg viewBox={`0 0 ${width} ${chartTotalHeight}`}>
        <g
          transform={`translate(${[0, MARGIN.top].join(',')})`}
          className="text-bar-axis-label"
        >
          {allBars}
        </g>
      </svg>
  );
};

type OverlappingProportionalBarChartProps = {
  data: OverlappingProportionalBarChartEntryData[];
  barHeight: number;
  highestTotal: number;
};

export function OverlappingProportionalBarChart({
  data,
  barHeight,
  highestTotal,
}: OverlappingProportionalBarChartProps) {
  const [ref, bounds] = useMeasure();
  return (
    <div ref={ref} className="relative w-full">
      <OverlappingProportionalBarChartInner
        data={data}
        width={bounds.width}
        barHeight={barHeight}
        highestTotal={highestTotal}
      />
    </div>
  );
}
