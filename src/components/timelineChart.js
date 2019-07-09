import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TimelineChart({ data, keyVar, currentId }) {
  const refElement = useRef(null);

  useEffect(() => {
    const el = refElement.current;
    if (el && data.dataset.length && currentId && keyVar) {
      console.log(data);

      //format data
      const dataset = data.dataset.map(geo =>
        geo.data.map(d => ({
          date: d.year,
          y: d[keyVar],
          series: geo.zipcode
        }))
      );

      const margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      const xScale = d3
        .scaleLinear()
        .domain([0, 4])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, 4])
        .range([height, 0]);

      const line = d3
        .line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);

      const chart = d3
        .select(el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      chart
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

      chart
        .append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

      chart
        .append("path")
        .datum(dataset) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator

      return () => {
        if (el)
          d3.select(el)
            .select("svg")
            .remove();
      };
    }
  });

  return <div className="chart" ref={refElement} />;
}
