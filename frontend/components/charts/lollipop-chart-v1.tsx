import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import useMeasure from 'react-use-measure';

interface DataItem {
  Country: string;
  Value: number;
}

export function LollipopChart() {
  const [data, setData] = useState<DataItem[]>([]);
  const [ref, bounds] = useMeasure();

  useEffect(() => {
    // Fetch the CSV data using D3
    d3.csv(
      'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv',
      (d) => {
        return { Country: d.Country, Value: d.Value ?? 0 } as DataItem;
      },
    ).then((data: DataItem[]) => {
      // Sort data
      data.sort((a, b) => b.Value - a.Value);
      setData(data);
    });
  }, []);

  return (
    <div id="my_dataviz" ref={ref} className='flex h-full w-full'>
      <LollipopChartInner
        data={data}
        width={bounds.width}
        height={bounds.height}
      />
    </div>
  );
}

interface LollipopChartInner {
  data: DataItem[];
  width: number;
  height: number;
}

export function LollipopChartInner({
  data,
  width,
  height,
}: LollipopChartInner) {
  // Dimensions and margins
  const margin = { top: 40, right: 10, bottom: 10, left: 10 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create scales
  const xScale = d3.scaleLinear().domain([0, 13000]).range([0, width]);

  const yScale = d3
    .scaleBand<string>()
    .range([0, innerHeight])
    .domain(data.map((d) => d.Country))
    .padding(1);

  return (
    <svg
      // width={innerWidth + margin.left + margin.right}
      // height={innerHeight + margin.top + margin.bottom}
      className="" viewBox={`0 0 ${width} ${height}`}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Y axis */}
        <g>
          {data.map((d) => (
            <g
              key={d.Country}
              transform={`translate(0, ${
                yScale(d.Country)! + yScale.bandwidth() / 2
              })`}
            >
              {/* Lollipop lines */}
              <line x2={xScale(d.Value)} stroke="grey" />
              {/* Country label */}
              <text
                x={xScale(d.Value) + 15} // Position the label outside the lollipop
                textAnchor="start"
                dominantBaseline="middle"
              >
                {d.Country}
              </text>
              {/* Lollipop circle */}
              <circle
                cx={xScale(d.Value)}
                r={7}
                fill="#69b3a2"
                stroke="black"
              />
            </g>
          ))}
          {/* Y axis line */}
          <line y1={0} y2={innerHeight} stroke="black" />
        </g>

        {/* X axis */}
        <g transform={`translate(0, 0)`}>
          <text
            x={innerWidth / 2}
            y={-margin.top * 0.7}
            textAnchor="middle"
            style={{ fontWeight: 'bold' }}
          >
            Value
          </text>
          {xScale.ticks().map((tickValue) => (
            <g key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
              {/* X axis tick lines */}
              <line y2={innerHeight} stroke="grey" />
              <text y={margin.top * 0.3} textAnchor="middle">
                {d3.format('~s')(tickValue)}
              </text>
            </g>
          ))}
          {/* X axis line */}
          <line x1={0} x2={innerWidth} y1={0} y2={0} stroke="black" />
        </g>
      </g>
    </svg>
  );
}
