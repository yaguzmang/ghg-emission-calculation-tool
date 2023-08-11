// import * as d3 from "d3";
// import {
//   eachMonthOfInterval,
//   endOfMonth,
//   format,
//   isSameMonth,
//   parseISO,
//   startOfMonth,
// } from "date-fns";
// import useMeasure from "react-use-measure";
// import { motion } from "framer-motion";
// import estimatedMax from "~/utils/estimated-max";

// export default function Chart({ entries }) {
//   let [ref, bounds] = useMeasure();

//   if (
//     !entries
//       .flatMap((entry) => entry.sets)
//       .some((set) => set.reps > 0 && set.tracked)
//   ) {
//     return (
//       <div className="flex h-full w-full items-center justify-center">
//         <p className="text-sm italic text-gray-400">
//           Add a tracked set to see a chart!
//         </p>
//       </div>
//     );
//   }

//   let data = [...entries]
//     .sort((a, b) => (a.date > b.date ? 1 : -1))
//     .map((entry) => {
//       let setWithHighestEstimatedMax = entry.sets
//         .filter((set) => set.reps > 0 && set.tracked)
//         .sort((a, b) => estimatedMax(b) - estimatedMax(a))[0];

//       return {
//         date: parseISO(entry.date),
//         estimatedMax: setWithHighestEstimatedMax
//           ? estimatedMax(setWithHighestEstimatedMax)
//           : null,
//       };
//     })
//     .filter((s) => s.estimatedMax);

//   return (
//     <div className="relative h-full w-full" ref={ref}>
//       {bounds.width > 0 && (
//         <ChartInner data={data} width={bounds.width} height={bounds.height} />
//       )}
//     </div>
//   );
// }

// function ChartInner({ data, width, height }) {
//   let margin = {
//     top: 10,
//     right: 10,
//     bottom: 20,
//     left: 24,
//   };

//   let startDay = startOfMonth(data.at(0).date);
//   let endDay = endOfMonth(data.at(-1).date);
//   let months = eachMonthOfInterval({ start: startDay, end: endDay });

//   let xScale = d3
//     .scaleTime()
//     .domain([startDay, endDay])
//     .range([margin.left, width - margin.right]);

//   let yScale = d3
//     .scaleLinear()
//     .domain(d3.extent(data.map((d) => d.estimatedMax)))
//     .range([height - margin.bottom, margin.top]);

//   let line = d3
//     .line()
//     .x((d) => xScale(d.date))
//     .y((d) => yScale(d.estimatedMax));
//   let d = line(data);

//   return (
//     <>
//       <svg className="" viewBox={`0 0 ${width} ${height}`}>
//         {/* X axis */}
//         {months.map((month, i) => (
//           <g
//             key={month}
//             className="text-gray-400"
//             transform={`translate(${xScale(month)},0)`}
//           >
//             {i % 2 === 1 && (
//               <rect
//                 width={xScale(endOfMonth(month)) - xScale(month)}
//                 height={height - margin.bottom}
//                 fill="currentColor"
//                 className="text-gray-100"
//               />
//             )}
//             <text
//               x={(xScale(endOfMonth(month)) - xScale(month)) / 2}
//               y={height - 5}
//               textAnchor="middle"
//               fill="currentColor"
//               className="text-[10px]"
//             >
//               {format(month, "MMM")}
//             </text>
//           </g>
//         ))}

//         {/* Y axis */}
//         {yScale.ticks(5).map((max) => (
//           <g
//             transform={`translate(0,${yScale(max)})`}
//             className="text-gray-400"
//             key={max}
//           >
//             <line
//               x1={margin.left}
//               x2={width - margin.right}
//               stroke="currentColor"
//               strokeDasharray="1,3"
//             />
//             <text
//               alignmentBaseline="middle"
//               className="text-[10px]"
//               fill="currentColor"
//             >
//               {max}
//             </text>
//           </g>
//         ))}

//         {/* Line */}
//         <motion.path
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{ duration: 1.5, type: "spring" }}
//           d={d}
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         />

//         {/* Circles */}
//         {data.map((d, i) => (
//           <motion.circle
//             key={d.date}
//             r="5"
//             cx={xScale(d.date)}
//             cy={yScale(d.estimatedMax)}
//             fill="currentColor"
//             strokeWidth={2}
//             stroke={
//               months.findIndex((m) => isSameMonth(m, d.date)) % 2 === 1
//                 ? "#f5f5f4"
//                 : "white"
//             }
//           />
//         ))}
//       </svg>
//     </>
//   );
// }