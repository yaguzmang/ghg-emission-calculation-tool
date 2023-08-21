'use client';

import React from 'react';
import useMeasure from 'react-use-measure';

import * as d3 from 'd3';

type ProportionalSemiCirclesChartInnerProps = {
  normalizedValueTop: number;
  normalizedValueBottom: number;
  containerHeight: number;
  containerWidth: number;
};

const ProportionalSemiCirclesChartInner = ({
  normalizedValueTop,
  normalizedValueBottom,
  containerHeight,
  containerWidth,
}: ProportionalSemiCirclesChartInnerProps) => {
  const svgWidth = containerWidth;
  const svgHeight = containerHeight;

  const radiusTop = (normalizedValueTop * svgHeight) / 2;
  const radiusBottom = normalizedValueBottom * radiusTop;

  const semiCircleCenterX = svgWidth / 2;
  const semiCircleCenterY = svgHeight / 2;

  const arcGenerator = d3.arc();

  const topArc = arcGenerator({
    innerRadius: 0,
    outerRadius: radiusTop,
    startAngle: -Math.PI / 2,
    endAngle: Math.PI / 2,
  });

  const bottomArc = arcGenerator({
    innerRadius: 0,
    outerRadius: radiusBottom,
    startAngle: Math.PI / 2,
    endAngle: -Math.PI / 2,
  });

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g className="text-proportional-area-chart-primary">
        <path
          d={topArc ?? ''}
          transform={`translate(${semiCircleCenterX},${semiCircleCenterY})`}
          fill="currentColor"
        />
      </g>
      <g className="text-proportional-area-chart-secondary">
        <path
          d={bottomArc ?? ''}
          transform={`translate(${semiCircleCenterX},${semiCircleCenterY}) rotate(180)`}
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

type ProportionalSemiCirclesChartProps = {
  normalizedValueTop: number;
  normalizedValueBottom: number;
};

export const ProportionalSemiCirclesChart = ({
  normalizedValueTop,
  normalizedValueBottom,
}: ProportionalSemiCirclesChartProps) => {
  const [ref, bounds] = useMeasure();

  return (
    <div ref={ref} className="w-full h-full">
      {bounds.width > 0 && bounds.height > 0 && (
        <ProportionalSemiCirclesChartInner
          normalizedValueTop={normalizedValueTop}
          normalizedValueBottom={normalizedValueBottom}
          containerHeight={bounds.height}
          containerWidth={bounds.width}
        />
      )}
    </div>
  );
};
