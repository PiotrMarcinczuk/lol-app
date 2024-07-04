"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./bubble_chart.module.css";

const championBaseUrl =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons";
interface BubbleChartProps {
  data: any[];
  nickname: string;
  tag: string;
}

interface CustomSimulationNodeDatum extends d3.SimulationNodeDatum {
  championId: number;
  championPoints: number;
  radius: number;
}

export default function BubbleChart({ data, nickname, tag }: BubbleChartProps) {
  const dataLen = data.length;
  const svgRef = useRef(null);
  const width = 800;
  const height = 380;
  const calculateSize = (championPoints: number) => {
    const minPoints = 15000; // Minimum points to consider
    const maxPoints = 2000000; // Maximum points to consider
    const minRadius = 5; // Minimum bubble radius
    const maxRadius = 40; // Maximum bubble radius

    // Create a logarithmic scale for champion points
    const sizeScale = d3
      .scaleLog()
      .domain([minPoints, maxPoints])
      .range([minRadius, maxRadius]);

    return sizeScale(championPoints);
  };

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("class", styles.svg);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    data.forEach((d) => {
      const radius = calculateSize(d.championPoints); // Calculate radius based on champion points
      const pattern = defs
        .append("pattern")
        .attr("id", `pattern${d.championId}`)
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", 1)
        .attr("height", 1);

      pattern
        .append("image")
        .attr("xlink:href", `${championBaseUrl}/${d.championId}.png`)
        .attr("width", radius * 2)
        .attr("height", radius * 2)
        .attr("x", 0)
        .attr("y", 0)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .classed(styles.champion_bubble, true);
    });

    const ticking = () => {
      svg
        .selectAll<SVGCircleElement, any>("circle")
        .data(simulationData)
        .join("circle")
        .attr("r", (d) => d.radius) // Use the pre-calculated radius
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!)
        .attr("fill", (d) => `url(#pattern${d.championId})`)
        .attr("class", styles.circle)
        .call(drag);
    };

    const drag = d3
      .drag<SVGCircleElement, any>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.05).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.2);
        setTimeout(() => {
          simulation.alphaTarget(0.01);
        }, 2000);
        d.fx = null;
        d.fy = null;
      });

    const simulationData: CustomSimulationNodeDatum[] = data.map((d) => ({
      ...d,
      radius: calculateSize(d.championPoints), // Calculate radius based on champion points
      x: width / 2,
      y: height / 2,
    }));

    const simulation = d3
      .forceSimulation(simulationData)
      .force("charge", d3.forceManyBody().strength(3)) // Increase the strength of charge to attract more to the center
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<CustomSimulationNodeDatum>().radius((d) => d.radius)
      )
      .force("x", d3.forceX(width / 2).strength(dataLen > 10 ? 0.035 : 0.09)) // Additional force to push towards the center on x-axis
      .force("y", d3.forceY(height / 2).strength(dataLen > 10 ? 0.035 : 0.09)) // Additional force to push towards the center on y-axis
      .alphaDecay(0.02) // Increase alpha decay for faster stabilization
      .on("tick", ticking);

    svg
      .selectAll<SVGCircleElement, CustomSimulationNodeDatum>("circle")
      .call(drag);

    return () => {
      simulation.stop();
    };
  }, [data, nickname, tag]);

  return <svg ref={svgRef}></svg>;
}
