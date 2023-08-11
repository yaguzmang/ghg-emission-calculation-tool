import { useMemo } from 'react';
import * as d3 from 'd3';
import useMeasure from 'react-use-measure';

type LollipopEntry = {
  label: string;
  value: number;
  color: null | string;
};

type LollipopChartProps = {
  data: LollipopEntry[];
};

export function LollipopChart({ data }: LollipopChartProps) {
  const [ref, bounds] = useMeasure();

  return (
    <div ref={ref} className="w-full h-full">
      {bounds.width > 0 && (
        <LollipopChartInner
          data={data}
          width={bounds.width}
          height={Math.max(bounds.height - 5, 10)}
        />
      )}
    </div>
  );
}

const MARGIN = { top: 32, right: 50, bottom: 30, left: 30 };

type LollipopChartInnerProps = {
  width: number;
  height: number;
  data: LollipopEntry[];
};

export const LollipopChartInner = ({
  width,
  height,
  data,
}: LollipopChartInnerProps) => {
  console.log(height);
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis is for groups since the barplot is horizontal
  const groups = data.sort((a, b) => b.value - a.value).map((d) => d.label);
  const yScale = useMemo(() => {
    return d3.scaleBand().domain(groups).range([0, boundsHeight]).padding(1);
  }, [data, height]);

  // X axis
  const xScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.value));
    return d3
      .scaleLinear()
      .domain([0, max || 10])
      .range([0, boundsWidth]);
  }, [data, width]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const y = yScale(d.label) ?? 0 + yScale.bandwidth() / 2;
    const circleStrokeColor = d.color || '#9396B0';
    const circleFillColor = d.color || '#9396B0';
    return (
      <g key={i} className="text-lollipop-line">
        <line
          x1={xScale(0)}
          y1={y}
          y2={y}
          x2={xScale(d.value)}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray={'2 2'}
        />
        <circle
          cy={y}
          cx={xScale(d.value)}
          stroke={circleStrokeColor}
          fill={circleFillColor}
          strokeWidth={1}
          r={10}
        />
        <g className="font-bold text-lollipop-label">
          <text
            x={xScale(d.value)}
            y={y - 16}
            textAnchor="start"
            alignmentBaseline="central"
            fontSize={10}
            fill="currentColor"
          >
            {d.label}
          </text>
        </g>
      </g>
    );
  });

  const grid = xScale
    .ticks(5)
    .slice(1)
    .map((value, i) => (
      <g key={i} className="text-lollipop-line font-normal">
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
          strokeDasharray={'2 2'}
        />
        <g className="text-lollipop-value">
          <text
            x={xScale(value)}
            // y={boundsHeight + 10}
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
    ));

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
      >
        {grid}
        {allShapes}
      </g>
    </svg>
  );
};
