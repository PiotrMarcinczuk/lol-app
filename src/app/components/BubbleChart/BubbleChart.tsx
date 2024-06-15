"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { SimulationNodeDatum } from "d3";
import styles from "./bubble_chart.module.css";

interface BubbleData extends SimulationNodeDatum {
  name: string;
  value: number;
  r: number;
  x: number;
  y: number;
}

interface BubbleProps {
  data: BubbleData[];
}

export default function BubbleChart({ data }: BubbleProps) {
  const svgRef = useRef(null);
  const width = 500;
  const height = 500;
  console.log(data);

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const ticking = () => {
      const circles = svg
        .selectAll("circle")
        .data(simulationData)
        .join("circle")
        .attr("r", 15)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("class", styles.circle)
        .call(drag as any);
    };

    const drag = d3
      .drag<SVGCircleElement, BubbleData>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const simulationData: BubbleData[] = data.map((d) => ({
      ...d,
      x: width / 2,
      y: height / 2,
    }));

    const simulation = d3
      .forceSimulation(simulationData)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(15))
      .on("tick", ticking);

    svg.selectAll<SVGCircleElement, BubbleData>("circle").call(drag);

    return () => {
      simulation.stop();
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
}
